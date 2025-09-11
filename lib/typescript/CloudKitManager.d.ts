/**
 * CloudKit Manager - Main interface for CloudKit operations
 * Provides a clean, promise-based API following SOLID principles
 */

import {
  CloudKitRecord,
  CloudKitQuery,
  CloudKitQueryResult,
  CloudKitSaveRequest,
  CloudKitSaveResult,
  CloudKitDeleteRequest,
  CloudKitDeleteResult,
  CloudKitUser,
  CloudKitAuthStatus,
  CloudKitPermissionStatus,
  CloudKitSyncStatus,
  CloudKitConfig,
  CloudKitEvents,
  CloudKitContainerConfig,
} from './types';

/**
 * Main CloudKit Manager class
 * Implements Single Responsibility Principle - handles only CloudKit operations
 */
export declare class CloudKitManager {
  constructor();

  /**
   * Initialize CloudKit with configuration
   * @param config - CloudKit configuration object
   * @returns Promise that resolves when initialization is complete
   */
  initialize(config: CloudKitConfig): Promise<void>;

  /**
   * Get the current authentication status
   * @returns Promise resolving to authentication status
   */
  getAuthStatus(): Promise<CloudKitAuthStatus>;

  /**
   * Get current user information
   * @returns Promise resolving to user information
   */
  getCurrentUser(): Promise<CloudKitUser | null>;

  /**
   * Request CloudKit permissions
   * @returns Promise resolving to permission status
   */
  requestPermissions(): Promise<CloudKitPermissionStatus>;

  /**
   * Query records from CloudKit
   * @param query - Query configuration
   * @returns Promise resolving to query results
   */
  query(query: CloudKitQuery): Promise<CloudKitQueryResult>;

  /**
   * Save records to CloudKit
   * @param request - Save request configuration
   * @returns Promise resolving to save results
   */
  save(request: CloudKitSaveRequest): Promise<CloudKitSaveResult>;

  /**
   * Delete records from CloudKit
   * @param request - Delete request configuration
   * @returns Promise resolving to delete results
   */
  delete(request: CloudKitDeleteRequest): Promise<CloudKitDeleteResult>;

  /**
   * Subscribe to CloudKit events
   * @param event - Event type to listen for
   * @param listener - Event listener function
   * @returns Function to unsubscribe from the event
   */
  addEventListener<K extends keyof CloudKitEvents>(
    event: K,
    listener: (data: CloudKitEvents[K]) => void
  ): () => void;

  /**
   * Get current sync status
   * @returns Promise resolving to sync status
   */
  getSyncStatus(): Promise<CloudKitSyncStatus>;

  /**
   * Force sync with CloudKit
   * @returns Promise resolving when sync is complete
   */
  sync(): Promise<void>;

  /**
   * Check if CloudKit is available on the device
   * @returns Promise resolving to availability status
   */
  isCloudKitAvailable(): Promise<boolean>;

  /**
   * Clean up resources and remove all event listeners
   */
  cleanup(): void;
}

/**
 * Default CloudKit Manager instance
 * Following Singleton pattern for global access
 */
export declare const cloudKitManager: CloudKitManager;