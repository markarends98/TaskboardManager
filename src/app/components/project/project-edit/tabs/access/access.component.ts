import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProjectService } from 'src/app/shared/services/project/project.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddPeopleComponent } from './add-people/add-people.component';
import { Project } from 'src/app/shared/interface/project';
import { RemovePeopleComponent } from './remove-people/remove-people.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.sass']
})
export class AccessComponent implements OnInit {
  displayedColumns: string[];
  dataSource: any;
  project: Project;
  isOwner: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  matTableDataSource = new MatTableDataSource(this.dataSource);

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.projectService.getProject(this.route.snapshot.paramMap.get("id")).subscribe(project => {
      this.displayedColumns = ['displayName', 'email', 'role', 'star'];
      this.project = project;
      this.project.owner == this.authService.user.uid ? this.isOwner = true : this.isOwner = false
      this.dataSource = this.project.members;
      this.matTableDataSource = new MatTableDataSource(this.dataSource);
      this.matTableDataSource.paginator = this.paginator;
      this.matTableDataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.matTableDataSource.filter = filterValue.trim().toLowerCase();
  }

  showAddPeopleDialog() {
    this.dialog.open(AddPeopleComponent, {
      data: {
        project: this.project
      }
    });
  }

  onRemoveClick(user: any) {
    this.dialog.open(RemovePeopleComponent, {
      data: {
        project: this.project,
        user: user
      }
    })
  }
}
