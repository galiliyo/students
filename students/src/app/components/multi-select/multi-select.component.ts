import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { NgForOf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import {
  MatSelect,
  MatSelectChange,
  MatSelectModule,
} from '@angular/material/select';

export interface Option {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    FormsModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    NgForOf,
    MatCheckboxModule,
    MatSelectModule,
  ],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
})
export class MultiSelectComponent implements OnChanges, AfterViewInit {
  @ViewChild('select') select: MatSelect | null = null;
  @Input({ required: true }) options: Option[] = [];
  @Input({ required: true }) showSelectAll = false;
  @Input({ required: true }) label = '';
  @Input() initialSelections: string[] = [];
  allSelected = false;
  selectedOptions: string[] = [];
  @Output() selectionChange = new EventEmitter<string[]>();
  @Output() openChanged = new EventEmitter<boolean>();

  constructor(private cdr: ChangeDetectorRef) {}
  ngAfterViewInit() {
    // Set initial selections based on the provided `initialSelections` input
    // Update the `allSelected` flag based on the initial selections
    if (this.select) {
      this.select.value = this.initialSelections;
      this.updateAllSelected();
    }
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialSelections'] && this.select) {
      this.select.value = this.initialSelections;
      this.updateAllSelected();
    }
  }
  toggleAllSelection() {
    if (this.allSelected) {
      this.select?.options.forEach((item: MatOption) => item.select());
    } else {
      this.select?.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClick() {
    let newStatus = true;
    this.select?.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

  onSelectionChange($event: MatSelectChange) {
    this.updateAllSelected();
    this.selectionChange.emit($event.value);
  }

  onOpenChanged() {
    this.openChanged.emit(this.select?.panelOpen);
  }

  private updateAllSelected() {
    if (this.select) {
      const selectedValues = this.select.value;
      this.allSelected = selectedValues.length === this.options.length;
      this.selectedOptions = selectedValues;
    }
  }
}
