import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../../../shared/services/project/project.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ProjectAddComponent } from '../project-add/project-add.component';
import { Project } from 'src/app/shared/interface/project';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'firebase';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass']
})
export class ProjectsComponent implements OnInit {
  displayedColumns: string[];
  projects: Project[];
  dataSource: any;
  archiveFilter: string;
  owners: {};

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  matTableDataSource = new MatTableDataSource(this.dataSource);

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    this.authService.afAuth.authState.subscribe(user => {
      if(user) {
        this.projectService.getProjects(user).subscribe(projects => {
          this.displayedColumns = ['name', 'description', 'owner', 'star'];
          this.projects = projects.filter(project => project.members.find(member => member.uid == user.uid));
          this.owners = {};
          this.projects.forEach(project => {
            let user;
  
            user = project.members.find(member => member.role == 'owner');
            this.owners[project.id] = user;
          })
          this.onToggleArchive();
          this.matTableDataSource = new MatTableDataSource(this.dataSource);
          this.matTableDataSource.paginator = this.paginator;
          this.matTableDataSource.sort = this.sort;
        });
    
        this.archiveFilter = 'active';
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.matTableDataSource.filter = filterValue.trim().toLowerCase();
  }

  openCreateProjectDialog(): void {
    this.dialog.open(ProjectAddComponent);
  }

  onToggleArchive() {
    if (this.archiveFilter === 'active') {
      this.dataSource = this.projects.filter(project => !project.archived).sort((a, b) => (a.name > b.name ? 1 : -1));
    } else if (this.archiveFilter === 'all') {
      this.dataSource = this.projects.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else if (this.archiveFilter === 'archived') {
      this.dataSource = this.projects.filter(project => project.archived).sort((a, b) => (a.name > b.name ? 1 : -1));
    }

    this.matTableDataSource.data = this.dataSource;
  }

  onArchiveClick(id: string) {
    this.projectService.archiveProject(id).then(() => {
      let snackBarRef = this.snackBar.open('Project has been archived', 'Undo')
      snackBarRef.onAction().subscribe(() => {
        this.projectService.deArchiveProject(id).then(() => {
          this.snackBar.open('Project has been de-archived')
        })
      })
    })
  }

  onDeArchiveClick(id: string) {
    this.projectService.deArchiveProject(id).then(() => {
      let snackBarRef = this.snackBar.open('Project has been de-archived', 'Undo')
      snackBarRef.onAction().subscribe(() => {
        this.projectService.archiveProject(id).then(() => {
          this.snackBar.open('Project has been archived')
        })
      })
    })
  }
}
