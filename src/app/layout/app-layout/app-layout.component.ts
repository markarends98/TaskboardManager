import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.sass']
})
export class AppLayoutComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone
  ) { }

  ngOnInit(): void {
  }

  toggleMenu() {
     document.getElementById('sidebar').classList.toggle('active');
  }

  signOut() {
    this.authService.signOut().then(() => {
      this.router.navigate(['sign-in']);
    }).catch(error => {
      window.alert(error);
    });
  }
}
