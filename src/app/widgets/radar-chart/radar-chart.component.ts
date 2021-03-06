import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {AreaValue, DevelopmentArea} from '../../models/area-value';
import {AppError} from '../../errors/app.error';
import {DevelopmentAreaService} from '../../services/development-area.service';
import Color from 'color';

@Component({
  selector: 'sspirit-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadarChartComponent implements OnInit, AfterViewInit, OnChanges {

  constructor(private areaService: DevelopmentAreaService, private cdr: ChangeDetectorRef) {
  }

  public get initialized(): boolean {
    return !!this.canvasContext;
  }

  public get context(): CanvasRenderingContext2D {
    if (!this.canvasContext) {
      throw new AppError('Trying to use context before initializing');
    }
    return this.canvasContext;
  }

  get isLight(): boolean {
    return this.theme === 'light';
  }

  get isPrimary(): boolean {
    return this.theme === 'primary';
  }

  get color(): Color {
    return this.isPrimary ? Color('#5D24FF') : Color('#FFFFFF');
  }

  get backColor(): Color {
    return this.color.alpha(this.isLight ? 0.07 : 0.07);
  }

  get frontColor(): Color {
    return this.color.alpha(this.isLight ? 0.38 : 0.38);
  }

  @Input() theme: 'primary' | 'light' = 'light';
  @Input() label = 'registros';

  @Input() values: AreaValue<number> = {
    affectivity: 0,
    character: 0,
    corporality: 0,
    creativity: 0,
    sociability: 0,
    spirituality: 0
  };

  areas = Object.keys(this.values) as DevelopmentArea[];

  @ViewChild('radar') radarChart?: ElementRef<HTMLCanvasElement>;
  @ViewChild('container') container?: ElementRef<HTMLDivElement>;

  public canvasContext: CanvasRenderingContext2D | null = null;
  areaPositions: AreaValue<[number, number]> = {
    affectivity: [0, 0],
    character: [0, 0],
    corporality: [0, 0],
    creativity: [0, 0],
    sociability: [0, 0],
    spirituality: [0, 0]
  };

  ignited = false;

  ngOnInit(): void {
  }

  getAreaName(area: DevelopmentArea): string {
    return this.areaService.getArea(area).name;
  }

  ngAfterViewInit(): void {
    if (!this.radarChart) {
      throw new AppError('Radar chart not found');
    }
    this.canvasContext = this.radarChart.nativeElement.getContext('2d');
    this.onResize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.values && this.initialized) {
      this.onResize();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.container || !this.radarChart) {
      return;
    }
    const [width, height] = [this.container.nativeElement.clientWidth, this.container.nativeElement.clientHeight];
    this.radarChart.nativeElement.width = width;
    this.radarChart.nativeElement.height = height;
    this.drawChart();
    this.cdr.detectChanges();
  }

  drawChart(): void {
    const ctx = this.context;

    const values = this.areas.map(a => this.values[a]);
    const back = this.drawValues(ctx, values.map(_ => 1), true);
    ctx.fillStyle = this.backColor.toString();
    ctx.strokeStyle = this.frontColor.toString();
    ctx.lineWidth = 3;
    ctx.fill(back);
    ctx.stroke(back);

    const front = this.drawValues(ctx, values);
    ctx.fillStyle = this.frontColor.toString();
    ctx.fill(front);
  }

  drawValues(ctx: CanvasRenderingContext2D, values: number[], positionIcons = false): Path2D {
    const [width, height] = [ctx.canvas.width, ctx.canvas.height];
    const center: [number, number] = [width / 2, height / 2];

    const n = values.length;
    const maxValue = values.reduce((prev, curr) => prev + curr, 0) > 0 ? Math.max(...values) + 0.5 : 32;
    const radius = Math.min(width, height) / 2;

    let idx: number;

    const path = new Path2D();
    for (idx = -1; idx < n; idx++) {
      const angle = (idx / n) * 2 * Math.PI;
      const itemRadius = ((values[idx] + 0.5) / maxValue) * radius;

      const [x, y] = [center[0] + itemRadius * Math.cos(angle), center[1] + itemRadius * Math.sin(angle)];
      if (idx < 0) {
        path.moveTo(x, y);
      } else if (positionIcons) {
        if (this.initialized) {
          this.areaPositions[this.areas[idx]] = [x, y];
        } else {
          this.ignited = true;
        }
      }
      path.lineTo(x, y);
    }
    path.closePath();
    return path;
  }
}
