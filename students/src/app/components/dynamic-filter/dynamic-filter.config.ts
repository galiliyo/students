export const dataTypes = {
  string: 'string',
  number: 'number',
  date: 'date',
} as const;

export type DataType = keyof typeof dataTypes;

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
