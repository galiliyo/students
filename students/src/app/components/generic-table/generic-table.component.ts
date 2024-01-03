import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { NgClass, NgForOf } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
export interface ColumnDef {
  colId: string;
  header: string;
  sortable: boolean;
}
@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    NgForOf,
    MatPaginatorModule,
    NgClass,
  ],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
})
export class GenericTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() columnDefs: ColumnDef[] = [];
  @Input() data: Record<string, any>[] = [];
  @Input() selectedRowId: string | number | null = null;
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Input() pageSize: number = 10;
  @Output() selectedRowChange = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];
  selectedRow: any;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data);
    this.displayedColumns = this.columnDefs.map((cd) => cd.colId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sortData(sort: Sort) {
    this.dataSource.sortingDataAccessor = (
      item: { [x: string]: any },
      property: string | number,
    ) => {
      console.log('sortData', item, property);
      // You can add custom sorting logic here if necessary
      return item[property];
    };
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  onRowClicked(row: any) {
    this.selectedRowChange.emit(row);
  }
}
