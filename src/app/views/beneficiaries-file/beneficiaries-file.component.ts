import {Component, OnInit} from '@angular/core';
import {RouteParamsService} from '../../services/route-params.service';
import {Observable, of} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {map, shareReplay, switchMap} from 'rxjs/operators';
import {Beneficiary} from '../../models/beneficiary.model';
import {BeneficiariesService} from '../../services/beneficiaries.service';
import {SelectButtonItem} from '../../widgets/select-buttons/select-buttons.component';
import {ObjectivesService} from '../../services/objectives.service';
import {DevelopmentStage} from '../../models/area-value';
import {AlertService} from '../../services/alert.service';
import {ObjectiveLog} from '../../models/task.model';

@Component({
  selector: 'sspirit-beneficiaries-file',
  templateUrl: './beneficiaries-file.component.html',
  styleUrls: ['./beneficiaries-file.component.sass']
})
export class BeneficiariesFileComponent implements OnInit {
  beneficiaryId$: Observable<string>;
  beneficiary$: Observable<Beneficiary>;
  activeTask$: Observable<ObjectiveLog | null>;
  buttons: SelectButtonItem[] = [
    {
      id: 'binnacle',
      label: 'Bitácora',
      icon: 'auto_stories'
    },
    {
      id: 'registry',
      label: 'Registro',
      icon: 'manage_search'
    }
  ];

  option$: Observable<string>;
  shareUrl$: Observable<string | null>;

  private get beneficiaryId(): string {
    return this.routeParams.aggregatedParamsSnap.userId;
  }

  getStage(stage: DevelopmentStage): string {
    return this.objectives.getStage(stage).name;
  }

  constructor(
    private routeParams: RouteParamsService,
    private route: ActivatedRoute,
    private router: Router,
    private beneficiaries: BeneficiariesService,
    private objectives: ObjectivesService,
    private alerts: AlertService
  ) {
    this.beneficiaryId$ = routeParams.aggregatedParams$
      .pipe(map(params => params.userId));
    this.beneficiary$ = this.beneficiaryId$.pipe(
      switchMap(beneficiaryId => beneficiaries.get(beneficiaryId))
    );
    this.option$ = routeParams.url$.pipe(
      switchMap(() => this.route.firstChild?.url ?? of([])),
      map(url => {
        return url && url.length > 0 ? url[url.length - 1].path : 'binnacle';
      })
    );
    this.shareUrl$ = this.routeParams.beneficiaryId$.pipe(
      map(beneficiaryId => {
        const location = window.location;
        return `${location.origin}/beneficiaries/${beneficiaryId}/file/binnacle`;
      })
    );
    this.activeTask$ = this.beneficiary$.pipe(
      switchMap(beneficiary => beneficiary ?
        this.beneficiaries.getActiveTask(beneficiary.id, beneficiary.unit)
        : of(null)),
      shareReplay({refCount: true})
    );
  }

  ngOnInit(): void {
  }

  async onOption(option: string): Promise<void> {
    await this.router.navigate([option], {relativeTo: this.route});
  }

  onClipboardResult(result: boolean): void {
    if (result) {
      this.alerts.showSnackbar('Enlace copiado al portapapeles');
    } else {
      this.alerts.showSnackbar('Error copiando enlace');
    }
  }

  async showRegisters(task: ObjectiveLog): Promise<void> {
    await this.router.navigate(
      ['/districts', this.routeParams.districtId, 'groups', this.routeParams.groupId, 'dashboard', 'beneficiaries', 'b', this.beneficiaryId, 'file', 'registry'],
      {queryParams: {objective: task.objective}}
    );
  }
}
