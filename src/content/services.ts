import { computeStorageServices } from './services/computeStorage';
import { databaseServices } from './services/database';
import { iacDevopsServices } from './services/iacDevops';
import { monitoringServices } from './services/monitoring';
import { networkingServices } from './services/networking';
import { securityServicesPart1 } from './services/security1';
import { securityServicesPart2 } from './services/security2';
import type { AWSService } from '../types';

export const allServices: AWSService[] = [
  ...computeStorageServices,
  ...networkingServices,
  ...databaseServices,
  ...securityServicesPart1,
  ...securityServicesPart2,
  ...monitoringServices,
  ...iacDevopsServices,
];
