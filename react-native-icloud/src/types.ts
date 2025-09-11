/**
 * CloudKit Record Types and Interfaces
 * Following CloudKitJS API patterns for consistency
 */

import { CloudKitComparator } from './CloudKitComparator';

/**
 * Represents a CloudKit record with its metadata
 */
export interface CloudKitRecord {
  recordName: string;
  recordType: string;
  fields: Record<string, CloudKitFieldValue>;
  recordChangeTag?: string;
  created?: CloudKitTimestamp;
  modified?: CloudKitTimestamp;
  deleted?: boolean;
}

/**
 * CloudKit field value types
 */
export type CloudKitFieldValue = 
  | string
  | number
  | boolean
  | CloudKitTimestamp
  | CloudKitLocation
  | CloudKitAsset
  | CloudKitReference
  | CloudKitReferenceList
  | CloudKitStringList
  | CloudKitBytes;

/**
 * CloudKit timestamp representation
 */
export interface CloudKitTimestamp {
  timestamp: number;
}

/**
 * CloudKit location representation
 */
export interface CloudKitLocation {
  latitude: number;
  longitude: number;
}

/**
 * CloudKit asset (file) representation
 */
export interface CloudKitAsset {
  fileChecksum: string;
  size: number;
  downloadURL?: string;
}

/**
 * CloudKit reference to another record
 */
export interface CloudKitReference {
  recordName: string;
  action: 'DELETE_SELF' | 'NONE';
}

/**
 * CloudKit reference list
 */
export interface CloudKitReferenceList {
  references: CloudKitReference[];
}

/**
 * CloudKit string list
 */
export interface CloudKitStringList {
  strings: string[];
}

/**
 * CloudKit bytes representation
 */
export interface CloudKitBytes {
  bytes: string; // Base64 encoded
}

/**
 * CloudKit query configuration
 */
export interface CloudKitQuery {
  recordType: string;
  filterBy?: CloudKitFilter[];
  sortBy?: CloudKitSort[];
  resultsLimit?: number;
  desiredKeys?: string[];
}

/**
 * CloudKit filter for queries
 */
export interface CloudKitFilter {
  fieldName: string;
  comparator: CloudKitComparator;
  fieldValue: CloudKitFieldValue;
}

/**
 * CloudKit sort configuration
 */
export interface CloudKitSort {
  fieldName: string;
  ascending: boolean;
}

/**
 * CloudKit query result
 */
export interface CloudKitQueryResult {
  records: CloudKitRecord[];
  continuationMarker?: string;
  moreComing: boolean;
}

/**
 * CloudKit save request
 */
export interface CloudKitSaveRequest {
  records: CloudKitRecord[];
  atomic?: boolean;
}

/**
 * CloudKit save result
 */
export interface CloudKitSaveResult {
  records: CloudKitRecord[];
  serverError?: CloudKitError;
}

/**
 * CloudKit delete request
 */
export interface CloudKitDeleteRequest {
  recordNames: string[];
  atomic?: boolean;
}

/**
 * CloudKit delete result
 */
export interface CloudKitDeleteResult {
  records: CloudKitRecord[];
  serverError?: CloudKitError;
}

/**
 * CloudKit error information
 */
export interface CloudKitError {
  reason: string;
  serverErrorCode: string;
  retryAfter?: number;
  uuid?: string;
  redirectURL?: string;
}

/**
 * CloudKit user information
 */
export interface CloudKitUser {
  userRecordName: string;
  isDiscoverable: boolean;
  nameComponents?: {
    givenName?: string;
    familyName?: string;
    nickname?: string;
  };
}

/**
 * CloudKit container configuration
 */
export interface CloudKitContainerConfig {
  containerIdentifier: string;
  apiToken?: string;
  environment: 'development' | 'production';
}

/**
 * CloudKit authentication status
 */
export type CloudKitAuthStatus = 
  | 'available'
  | 'restricted'
  | 'noAccount'
  | 'couldNotDetermine';

/**
 * CloudKit permission status
 */
export type CloudKitPermissionStatus = 
  | 'granted'
  | 'denied'
  | 'restricted'
  | 'limited'
  | 'undetermined';

/**
 * CloudKit sync status
 */
export interface CloudKitSyncStatus {
  isSyncing: boolean;
  lastSyncDate?: Date;
  error?: CloudKitError;
}

/**
 * Event types for CloudKit operations
 */
export interface CloudKitEvents {
  'authStatusChanged': CloudKitAuthStatus;
  'syncStatusChanged': CloudKitSyncStatus;
  'recordsChanged': CloudKitRecord[];
  'error': CloudKitError;
}

/**
 * Configuration options for the CloudKit manager
 */
export interface CloudKitConfig {
  containerIdentifier: string;
  apiToken?: string;
  environment: 'development' | 'production';
  enableNotifications?: boolean;
  syncInterval?: number; // in milliseconds
}
