import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/shared/services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass']
})
export class SignUpComponent implements OnInit {
  user = {
    fullname: '',
    email: '',
    password: ''
  };

  loadingRegular = false;
  loadingGoogle = false;

  constructor(public authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  signUpWithGoogle() {
    this.loadingGoogle = true;
    this.authService.signInWithGoogle()
      .then(() => {
        this.loadingGoogle = false;
        this.router.navigate(['projects']);
      }).catch((err) => {
        this.loadingGoogle = false;
      });
  }

  signUp() {
    this.loadingRegular = true;

    const valid = new Promise((resolve, reject) => {
      if (this.user.fullname.trim().length === 0) {
        return reject('Please enter a full name.');
      }

      if (this.user.email.trim().length === 0) {
        return reject('Please enter an email.');
      }

      if (this.user.password.trim().length === 0) {
        return reject('Please enter a password.');
      }

      resolve();
    });

    valid.then(() => {
      this.authService.signUp(this.user.fullname, this.user.email, this.user.password).then(() => {
        this.router.navigate(['verify-email-address']);
      }).catch((err) => {
        if (err.code === 'auth/invalid-email') {
          this.showError(err.message);
        } else if (err.code === 'auth/email-already-in-use') {
          this.showError(err.message);
        } else if (err.code === 'auth/weak-password') {
          this.showError('Password is not strong enough.');
        } else {
          this.showError('Unknown error occurred while signing up, try again later.');
        }
        this.loadingRegular = false;
      });
    }).catch(errorMessage => {
      this.showError(errorMessage);
      this.loadingRegular = false;
    });

  }

  showError(message: string) {
    this.snackBar.open(message, null, {verticalPosition: 'top'});
  }
}
