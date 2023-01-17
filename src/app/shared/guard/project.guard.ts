import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from '../services/project/project.service';
import { Project } from '../interface/project';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectGuard implements CanActivate {
  project: Project;

  constructor(
    private route: ActivatedRoute,
    public projectService: ProjectService,
    public authService: AuthService,
    public router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let projectId = next.paramMap.get('id');

    return new Promise((resolve) => {
      this.projectService.getProject(projectId).subscribe(response => {
        this.project = response;

        if(this.project) {
          if(this.project.members) {
            if ((this.project.owner === this.authService.user.uid) || (this.project.members.filter(member => member.uid === this.authService.user.uid).length == 1)) {
              return resolve(true);
            }
          }
        }

        this.router.navigate(['404']);
        return resolve(false);
      })
    })
  }

}
