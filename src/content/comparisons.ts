import { computeComparisons } from './comparisons/compute';
import { storageComparisons } from './comparisons/storage';
import { networkingComparisons } from './comparisons/networking';
import { databasesComparisons } from './comparisons/databases';
import { securityComparisons } from './comparisons/security';
import { observabilityComparisons } from './comparisons/observability';
import { eventDrivenComparisons } from './comparisons/eventDriven';
import { iacComparisons } from './comparisons/iac';
import { costReliabilityComparisons } from './comparisons/costReliability';
import type { Comparison } from '../types';

export const allComparisons: Comparison[] = [
  ...computeComparisons,
  ...storageComparisons,
  ...networkingComparisons,
  ...databasesComparisons,
  ...securityComparisons,
  ...observabilityComparisons,
  ...eventDrivenComparisons,
  ...iacComparisons,
  ...costReliabilityComparisons,
];
