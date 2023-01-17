import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})
export class SignInComponent implements OnInit {

  user = {
    email: '',
    password: ''
  };

  loadingRegular = false;
  loadingGoogle = false;

  constructor(public authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  signInWithGoogle() {
    this.loadingGoogle = true;
    this.authService.signInWithGoogle()
      .then(() => {
        this.loadingGoogle = false;
        this.router.navigate(['projects']);
      })
      .catch((err) => {
        this.loadingGoogle = false;
      });
  }

  signInWithEmail() {
    this.loadingRegular = true;

    const valid = new Promise((resolve, reject) => {
      if (this.user.email.trim().length === 0) {
        return reject('Please enter an email.');
      }

      if (this.user.password.trim().length === 0) {
        return reject('Please enter a password.');
      }

      resolve();
    });

    valid.then(() => {
      this.authService.signInRegular(this.user.email, this.user.password)
        .then(() => {
          this.loadingRegular = false;
          this.router.navigate(['projects']);
        })
        .catch((err) => {
          if (err.code === 'auth/invalid-email') {
            this.showError(err.message);
          } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
            this.showError('Invalid credentials entered.');
          } else if (err === 'auth/unverified-email') {
            this.showError('Please verify your email before logging in.');
          } else {
            this.showError('Unknown error occurred while logging in, try again later.');
          }
          this.loadingRegular = false;
        });
    }).catch(errorMessage => {
      this.showError(errorMessage);
      this.loadingRegular = false;
    });
  }

  showError(message: string) {
    this.snackBar.open(message, null, { verticalPosition: 'top' });
  }
}
