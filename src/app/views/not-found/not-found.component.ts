import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'sspirit-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.sass']
})
export class NotFoundComponent implements OnInit {
  user$ = this.auth.user$;

  constructor(private router: Router, private auth: AuthenticationService, private snackbar: MatSnackBar, private alert: AlertService) {
  }

  ngOnInit(): void {
  }

  async signOut(): Promise<void> {
    try {
      if (!await this.alert.askConfirmation('¿Seguro que quieres cerrar sesión?')) {
        return;
      }
      await this.auth.signOut();
      await this.router.navigate(['/']);
    } catch (e) {
      this.snackbar.open('Error while signing out');
      throw e;
    }
  }
}
