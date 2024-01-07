export type DataType = 'string' | 'number' | 'date';
export type OperatorType =
  | 'contain'
  | 'greaterThan'
  | 'lessThan'
  | 'before'
  | 'after';

export type matOption = { viewValue: string; value: string };

export const operatorOptionsConfig = {
  string: [{ viewValue: 'Contains', value: 'contain' }],
  number: [
    { viewValue: 'Greater than', value: 'greaterThan' },
    { viewValue: 'Less than', value: 'lessThan' },
  ],
  date: [
    { viewValue: 'Before', value: 'before' },
    { viewValue: 'After', value: 'after' },
  ],
} as Record<string, matOption[]>;

export interface DynamicFilterConfig {
  column: string;
  label: string;
  dataType: DataType;
}
[];
