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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
})
export class GenericTableComponent<T>
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() columnDefs: ColumnDef[] = [];
  @Input() data: Record<string, any>[] = [];
  @Input() selectedRowId: number | null = null;
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Input() pageSize: number = 10;
  @Output() selectedRowChange = new EventEmitter<any>();
  @Output() addRow = new EventEmitter<void>();
  @Output() deleteRow = new EventEmitter<number>();
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];

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
      return item[property];
    };
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  onRowClicked(row: any) {
    this.selectedRowChange.emit(row);
  }

  onNewRowClicked() {
    this.addRow.emit();
  }
  onDeleteRowClicked(rowId: number | null) {
    if (!rowId) return;
    this.deleteRow.emit(rowId);
  }
}
