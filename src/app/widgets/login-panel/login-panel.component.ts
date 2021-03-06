import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'sspirit-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.sass']
})
export class LoginPanelComponent implements OnInit {
  loading = false;

  email = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);

  form = new FormGroup({
    email: this.email,
    password: this.password,
  });

  constructor(private auth: AuthenticationService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  async signIn(): Promise<void> {
    this.loading = true;
    this.form.disable();
    const email = this.email.value;
    try {
      const response = await this.auth.signIn(email, this.password.value);
      if (!response) {
        this.snackBar.open('Credenciales incorrectas', 'Cerrar');
      } else {
        await this.router.navigate(['/no-group']);
      }
    } catch (e) {
      switch (e.code) {
        case 'UserNotConfirmedException':
          this.snackBar.open(`Por favor confirme su cuenta de correo electrónico`, 'Cerrar');
          await this.router.navigate(['/confirm'], {queryParams: {email}});
          break;
        default:
          this.snackBar.open('Algo pasó. Intente de nuevo más tarde', 'Cerrar');
          console.error(e);
      }
    } finally {
      this.loading = false;
      this.form.enable();
    }
  }
}
