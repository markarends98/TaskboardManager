import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.sass']
})
export class TableComponent implements OnInit {
  @Input()
  displayedColumns: string[];

  @Input()
  dataSource: any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  matTableDataSource = new MatTableDataSource(this.dataSource);

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if(this.dataSource) {
      this.matTableDataSource = new MatTableDataSource(this.dataSource);
      this.matTableDataSource.paginator = this.paginator;
      this.matTableDataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.matTableDataSource.filter = filterValue.trim().toLowerCase();
  }
}