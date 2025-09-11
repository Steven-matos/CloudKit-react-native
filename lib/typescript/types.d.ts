/**
 * CloudKit Record Types and Interfaces
 * Following CloudKitJS API patterns for consistency
 */

export declare enum CloudKitComparator {
  EQUALS = "EQUALS",
  NOT_EQUALS = "NOT_EQUALS",
  LESS_THAN = "LESS_THAN",
  LESS_THAN_OR_EQUALS = "LESS_THAN_OR_EQUALS",
  GREATER_THAN = "GREATER_THAN",
  GREATER_THAN_OR_EQUALS = "GREATER_THAN_OR_EQUALS",
  NEAR = "NEAR",
  NOT_NEAR = "NOT_NEAR",
  CONTAINS = "CONTAINS",
  NOT_CONTAINS = "NOT_CONTAINS",
  CONTAINS_ALL_TOKENS = "CONTAINS_ALL_TOKENS",
  CONTAINS_ANY_TOKENS = "CONTAINS_ANY_TOKENS",
  NOT_CONTAINS_ALL_TOKENS = "NOT_CONTAINS_ALL_TOKENS",
  NOT_CONTAINS_ANY_TOKENS = "NOT_CONTAINS_ANY_TOKENS",
  IN = "IN",
  NOT_IN = "NOT_IN",
  CONTAINS_ALL = "CONTAINS_ALL",
  CONTAINS_ANY = "CONTAINS_ANY",
  NOT_CONTAINS_ALL = "NOT_CONTAINS_ALL",
  NOT_CONTAINS_ANY = "NOT_CONTAINS_ANY",
  LIST_CONTAINS = "LIST_CONTAINS",
  LIST_NOT_CONTAINS = "LIST_NOT_CONTAINS",
  LIST_CONTAINS_ALL = "LIST_CONTAINS_ALL",
  LIST_CONTAINS_ANY = "LIST_CONTAINS_ANY",
  LIST_NOT_CONTAINS_ALL = "LIST_NOT_CONTAINS_ALL",
  LIST_NOT_CONTAINS_ANY = "LIST_NOT_CONTAINS_ANY",
  STARTS_WITH = "STARTS_WITH",
  NOT_STARTS_WITH = "NOT_STARTS_WITH",
  ENDS_WITH = "ENDS_WITH",
  NOT_ENDS_WITH = "NOT_ENDS_WITH",
  LIKE = "LIKE",
  NOT_LIKE = "NOT_LIKE",
  MATCHES = "MATCHES",
  NOT_MATCHES = "NOT_MATCHES",
}

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
export declare type CloudKitFieldValue = 
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
export declare type CloudKitAuthStatus = 
  | 'available'
  | 'restricted'
  | 'noAccount'
  | 'couldNotDetermine';

/**
 * CloudKit permission status
 */
export declare type CloudKitPermissionStatus = 
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