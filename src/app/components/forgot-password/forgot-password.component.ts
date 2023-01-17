import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.sass']
})
export class ForgotPasswordComponent implements OnInit {

  user = {
    password: ''
  };

  constructor(
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  forgotPassword() {
    this.authService.forgotPassword(this.user.password).then(() => {
      this.snackBar.open('Password reset email sent, check your inbox.');
    }).catch(error => {
      window.alert(error);
    });
  }
}
