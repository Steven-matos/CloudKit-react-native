/**
 * React Native CloudKit Library
 * Main entry point for the library
 * Exports all public APIs following KISS principle
 */

// Core CloudKit functionality
export { CloudKitManager, cloudKitManager } from './CloudKitManager';

// Query building utilities
export { CloudKitQueryBuilder, createQuery, simpleQuery } from './CloudKitQueryBuilder';

// Types and interfaces
export type {
  CloudKitRecord,
  CloudKitFieldValue,
  CloudKitTimestamp,
  CloudKitLocation,
  CloudKitAsset,
  CloudKitReference,
  CloudKitReferenceList,
  CloudKitStringList,
  CloudKitBytes,
  CloudKitQuery,
  CloudKitFilter,
  CloudKitSort,
  CloudKitQueryResult,
  CloudKitSaveRequest,
  CloudKitSaveResult,
  CloudKitDeleteRequest,
  CloudKitDeleteResult,
  CloudKitError,
  CloudKitUser,
  CloudKitContainerConfig,
  CloudKitAuthStatus,
  CloudKitPermissionStatus,
  CloudKitSyncStatus,
  CloudKitEvents,
  CloudKitConfig,
} from './types';

// Enums and constants
export { CloudKitComparator } from './CloudKitComparator';

// Re-export the main manager as default
export { cloudKitManager as default } from './CloudKitManager';
