import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {User} from '../interface/user';
import {auth as firebaseAuth} from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: User = null;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        this.user = null;
        localStorage.setItem('user', null);
      }
    });
  }

  // Handle google sign in
  signInWithGoogle(): Promise<void> {
    return this.afAuth.signInWithPopup(new firebaseAuth.GoogleAuthProvider()).then(result => {
      return this.updateUserData(result.user);
    });
  }

  // Update user data
  updateUserData({uid, email, displayName, photoURL, emailVerified}: User): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
    const userData: User = {
      uid,
      email,
      displayName,
      photoURL,
      emailVerified
    };

    return userRef.set(userData, {merge: true});
  }

  // Sign in
  signInRegular(email, password) {
    return new Promise((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password).then(result => {
        if (!result.user.emailVerified) {
          return reject('auth/unverified-email');
        }
        return resolve(this.updateUserData(result.user));
      }).catch(error => {
        return reject(error);
      });
    });
  }

  // Sign up
  signUp(displayName, email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(result => {
        result.user.updateProfile({
          displayName: displayName,
          photoURL: ''
        }).then(() => {
          return this.updateUserData(result.user);
        });
      }).then(() => {
        return this.sendVerificationMail();
      });
  }

  // Send email verification
  async sendVerificationMail() {
    const user = (await this.afAuth.currentUser);
    return user.sendEmailVerification();
  }

  // Reset password
  forgotPassword(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail);
  }

  // Get if user is logged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false);
  }

  // Sign out current user
  signOut() {
    return this.afAuth.signOut().then(() => {
      return localStorage.removeItem('user');
    });
  }
}
