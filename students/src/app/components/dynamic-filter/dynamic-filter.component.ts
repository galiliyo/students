import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DataType,
  dataTypes,
  matOption,
  operatorOptionsConfig,
  OperatorType,
} from './dynamic-filter.config';

export interface FilterOutput {
  filteredData: any[];
  filters: {
    column: string;
    operator: string;
    criteria: string;
  };
}

export interface FilterState {
  column: string;
  operator: string;
  criteria: string;
}
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
  styleUrls: ['./dynamic-filter.component.scss'],
})
export class DynamicFilterComponent implements OnInit {
  @Input({ required: true }) columnsConfig: {
    column: string;
    label: string;
    dataType: DataType;
  }[] = [{ column: '', label: '', dataType: dataTypes.string }];
  @Input({ required: true }) data: any[] = [];
  @Input() initialFilters: FilterState | null = null;
  @Output() filteredData = new EventEmitter<FilterOutput>();

  selectedColumn: string = 'name';
  selectedOperator: OperatorType = 'contain';
  filterCriteria: string = ''; //string and number user input
  dateCriteria: string = ''; // date user input
  protected columnOptions: { viewValue: string; value: string }[] = [];
  protected filterDataType: DataType = dataTypes.string; // filter set to string, number or date mode
  protected operatorOptions: matOption[] = [
    { viewValue: 'Contains', value: 'contain' },
  ];

  ngOnInit() {
    this.setColumnOptions();
    this.setInitialFilter();
  }

  resetFilters() {
    this.selectedColumn = 'name';
    this.filterDataType = 'string';
    this.operatorOptions = operatorOptionsConfig['string'];
    this.selectedOperator = 'contain';
    this.filterCriteria = '';

    this.applyFilter();
  }

  applyFilter(): void {
    if (
      !this.selectedColumn ||
      !this.selectedOperator ||
      !this.isFilterCriteriaValid()
    ) {
      this.emitFilterOutput(this.data);
      return;
    }

    const filteredResult = this.data.filter((item) => {
      const columnValue = item[this.selectedColumn];
      switch (this.filterDataType) {
        case dataTypes.string:
          return this.applyStringFilter(columnValue);
        case dataTypes.number:
          return this.applyNumberFilter(columnValue);
        case dataTypes.date:
          return this.applyDateFilter(columnValue);
        default:
          return false;
      }
    });
    this.emitFilterOutput(filteredResult); // emit filtered data and filter criteria for storage
  }

  onColumnSelected() {
    this.updateFilterDataTypeAndOptions();
  }

  setInitialFilter(): void {
    // restore from storage

    this.selectedColumn = this.initialFilters?.column || 'name';
    this.selectedOperator = this.initialFilters?.operator as OperatorType;

    if (this.initialFilters?.column === 'joinDate') {
      this.dateCriteria = this.initialFilters.criteria || '';
    } else {
      this.filterCriteria = this.initialFilters?.criteria || '';
    }

    this.updateFilterDataTypeAndOptions();
  }

  private setColumnOptions() {
    // populate column options for mat-select
    this.columnOptions = this.columnsConfig.map((item) => ({
      value: item.column,
      viewValue: item.label,
    }));
  }

  private isFilterCriteriaValid() {
    // check if date criteria is valid when filter is set to date mode
    // or if string/number criteria is valid when filter is set to string/number mode
    return this.filterDataType !== dataTypes.date
      ? !!this.filterCriteria
      : !!this.dateCriteria;
  }

  private emitFilterOutput(filteredData: any[]) {
    const filterOutput: FilterOutput = {
      filteredData,
      filters: {
        column: this.selectedColumn,
        operator: this.selectedOperator,
        criteria:
          this.filterDataType === dataTypes.date
            ? this.dateCriteria
            : this.filterCriteria,
      },
    };

    this.filteredData.emit(filterOutput);
  }

  private applyStringFilter(columnValue: string): boolean {
    if (this.selectedOperator === 'contain') {
      return columnValue
        .toLowerCase()
        .includes(this.filterCriteria.toLowerCase());
    }
    return false;
  }

  private applyNumberFilter(columnValue: string): boolean {
    const numericValue = parseFloat(columnValue);
    if (!isNaN(numericValue)) {
      if (this.selectedOperator === 'greaterThan') {
        return numericValue > parseFloat(this.filterCriteria);
      } else if (this.selectedOperator === 'lessThan') {
        return numericValue < parseFloat(this.filterCriteria);
      }
    }
    return false;
  }

  private applyDateFilter(columnValue: string): boolean {
    const dateValue = new Date(columnValue);
    if (!isNaN(dateValue.getTime())) {
      if (this.selectedOperator === 'before') {
        return dateValue < new Date(this.dateCriteria);
      } else if (this.selectedOperator === 'after') {
        return dateValue > new Date(this.dateCriteria);
      }
    }
    return false;
  }

  private updateFilterDataTypeAndOptions() {
    const selectedColumnConfig = this.columnsConfig.find(
      (item) => item.column === this.selectedColumn,
    );
    this.filterDataType = selectedColumnConfig?.dataType || dataTypes.string;
    this.operatorOptions = operatorOptionsConfig[
      this.filterDataType
    ] as matOption[];
    this.selectedOperator = this.operatorOptions[0].value as OperatorType;
  }
}
