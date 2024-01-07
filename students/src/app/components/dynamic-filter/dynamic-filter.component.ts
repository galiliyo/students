import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf } from '@angular/common';
import {
  DataType,
  matOption,
  operatorOptionsConfig,
  OperatorType,
} from './dynamic-filter.config';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-dynamic-filter',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    NgForOf,
    MatListModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dynamic-filter.component.html',
  styleUrl: './dynamic-filter.component.scss',
})
export class DynamicFilterComponent {
  @Input() config = [
    { column: 'name', label: 'Name', dataType: 'string' },
    { column: 'grade', label: 'Grade', dataType: 'number' },
    { column: 'date', label: 'Date', dataType: 'date' },
  ];
  @Input() data: any[] = [];
  @Output() filteredData = new EventEmitter<any[]>();

  selectedColumn: string = 'name';
  selectedOperator: OperatorType = 'contain';
  filterCriteria: string = '';
  selectedDate: string = '';
  protected columnOptions: { viewValue: string; value: string }[];
  protected filterDataType: DataType = 'string';
  protected operatorOptions: matOption[] = [
    { viewValue: 'Contains', value: 'contain' },
  ];

  constructor() {
    this.columnOptions = this.config.map((item) => ({
      value: item.column,
      viewValue: item.label,
    }));
  }

  resetFilters() {
    this.selectedColumn = 'name';
    this.filterDataType = 'string';
    this.operatorOptions = operatorOptionsConfig['string'];
    this.selectedOperator = 'contain';
    this.filterCriteria = '';
    this.filteredData.emit(this.data);
  }

  applyFilter(): void {
    if (
      !this.selectedColumn ||
      !this.selectedOperator ||
      (this.filterDataType !== 'date' && !this.filterCriteria) ||
      (this.filterDataType === 'date' && !this.selectedDate)
    ) {
      this.filteredData.emit(this.data);
      return;
    }

    const filteredResult = this.data.filter((item) => {
      const columnValue = item[this.selectedColumn];
      switch (this.filterDataType) {
        case 'string':
          if (this.selectedOperator === 'contain') {
            return columnValue
              .toLowerCase()
              .includes(this.filterCriteria.toLowerCase());
          }
          break;
        case 'number':
          const numericValue = parseFloat(columnValue);
          if (!isNaN(numericValue)) {
            if (this.selectedOperator === 'greaterThan') {
              return numericValue > parseFloat(this.filterCriteria);
            } else if (this.selectedOperator === 'lessThan') {
              return numericValue < parseFloat(this.filterCriteria);
            }
          }
          break;
        case 'date':
          const dateValue = new Date(columnValue);
          debugger;
          if (!isNaN(dateValue.getTime())) {
            if (this.selectedOperator === 'before') {
              return new Date(dateValue) < new Date(this.selectedDate);
            } else if (this.selectedOperator === 'after') {
              return new Date(dateValue) > new Date(this.selectedDate);
            }
          }
          break;
      }
      return false;
    });

    this.filteredData.emit(filteredResult);
  }

  onColumnSelected() {
    // set the filter data type based on the selected column
    this.filterDataType =
      (this.config.find((item) => {
        return item.column === this.selectedColumn;
      })?.dataType as DataType) || 'string';
    this.operatorOptions = operatorOptionsConfig[
      this.filterDataType
    ] as matOption[];

    this.selectedOperator = this.operatorOptions[0].value as OperatorType;
  }

  private getOperatorOptions(filterDataType: DataType) {}
}
