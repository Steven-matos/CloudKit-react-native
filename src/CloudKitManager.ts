/**
 * CloudKit Manager - Main interface for CloudKit operations
 * Provides a clean, promise-based API following SOLID principles
 */

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
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

const { RNReactNativeIcloud } = NativeModules;

/**
 * Main CloudKit Manager class
 * Implements Single Responsibility Principle - handles only CloudKit operations
 */
export class CloudKitManager {
  private eventEmitter: NativeEventEmitter | null = null;
  private config: CloudKitConfig | null = null;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    if (Platform.OS === 'ios' && RNReactNativeIcloud) {
      this.eventEmitter = new NativeEventEmitter(RNReactNativeIcloud);
    }
  }

  /**
   * Initialize CloudKit with configuration
   * @param config - CloudKit configuration object
   * @returns Promise that resolves when initialization is complete
   */
  async initialize(config: CloudKitConfig): Promise<void> {
    if (Platform.OS !== 'ios') {
      throw new Error('CloudKit is only available on iOS');
    }

    if (!RNReactNativeIcloud) {
      throw new Error('Native CloudKit module not available');
    }

    // Validate required configuration
    if (!config.containerIdentifier) {
      throw new Error('containerIdentifier is required in CloudKit configuration');
    }

    if (!config.environment || !['development', 'production'].includes(config.environment)) {
      throw new Error('environment must be either "development" or "production"');
    }

    this.config = config;
    await RNReactNativeIcloud.initialize(config);
    this.setupEventListeners();
  }

  /**
   * Get the current authentication status
   * @returns Promise resolving to authentication status
   */
  async getAuthStatus(): Promise<CloudKitAuthStatus> {
    if (!this.isInitialized()) {
      throw new Error('CloudKit not initialized. Call initialize() first.');
    }
    return RNReactNativeIcloud.getAuthStatus();
  }

  /**
   * Get current user information
   * @returns Promise resolving to user information
   */
  async getCurrentUser(): Promise<CloudKitUser | null> {
    if (!this.isInitialized()) {
      throw new Error('CloudKit not initialized. Call initialize() first.');
    }
    return RNReactNativeIcloud.getCurrentUser();
  }

  /**
   * Request CloudKit permissions
   * @returns Promise resolving to permission status
   */
  async requestPermissions(): Promise<CloudKitPermissionStatus> {
    if (!this.isInitialized()) {
      throw new Error('CloudKit not initialized. Call initialize() first.');
    }
    return RNReactNativeIcloud.requestPermissions();
  }

  /**
   * Query records from CloudKit
   * @param query - Query configuration
   * @returns Promise resolving to query results
   */
  async query(query: CloudKitQuery): Promise<CloudKitQueryResult> {
    if (!this.isInitialized()) {
      throw new Error('CloudKit not initialized. Call initialize() first.');
    }
    return RNReactNativeIcloud.query(query);
  }

  /**
   * Save records to CloudKit
   * @param request - Save request configuration
   * @returns Promise resolving to save results
   */
  async save(request: CloudKitSaveRequest): Promise<CloudKitSaveResult> {
    if (!this.isInitialized()) {
      throw new Error('CloudKit not initialized. Call initialize() first.');
    }
    return RNReactNativeIcloud.save(request);
  }

  /**
   * Delete records from CloudKit
   * @param request - Delete request configuration
   * @returns Promise resolving to delete results
   */
  async delete(request: CloudKitDeleteRequest): Promise<CloudKitDeleteResult> {
    if (!this.isInitialized()) {
      throw new Error('CloudKit not initialized. Call initialize() first.');
    }
    return RNReactNativeIcloud.delete(request);
  }

  /**
   * Subscribe to CloudKit events
   * @param event - Event type to listen for
   * @param listener - Event listener function
   * @returns Function to unsubscribe from the event
   */
  addEventListener<K extends keyof CloudKitEvents>(
    event: K,
    listener: (data: CloudKitEvents[K]) => void
  ): () => void {
    if (!this.eventEmitter) {
      throw new Error('Event emitter not available');
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    const eventListeners = this.listeners.get(event) || [];
    eventListeners.push(listener);
    this.listeners.set(event, eventListeners);
    const subscription = this.eventEmitter.addListener(event, listener);

    return () => {
      subscription.remove();
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(listener);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    };
  }

  /**
   * Get current sync status
   * @returns Promise resolving to sync status
   */
  async getSyncStatus(): Promise<CloudKitSyncStatus> {
    if (!this.isInitialized()) {
      throw new Error('CloudKit not initialized. Call initialize() first.');
    }
    return RNReactNativeIcloud.getSyncStatus();
  }

  /**
   * Force sync with CloudKit
   * @returns Promise resolving when sync is complete
   */
  async sync(): Promise<void> {
    if (!this.isInitialized()) {
      throw new Error('CloudKit not initialized. Call initialize() first.');
    }
    return RNReactNativeIcloud.sync();
  }

  /**
   * Check if CloudKit is available on the device
   * @returns Promise resolving to availability status
   */
  async isCloudKitAvailable(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return false;
    }
    
    if (!RNReactNativeIcloud) {
      return false;
    }

    try {
      return await RNReactNativeIcloud.isCloudKitAvailable();
    } catch {
      return false;
    }
  }

  /**
   * Clean up resources and remove all event listeners
   */
  cleanup(): void {
    if (this.eventEmitter) {
      // Remove all listeners for each event type we're tracking
      this.listeners.forEach((listeners, event) => {
        this.eventEmitter!.removeAllListeners(event);
      });
      this.listeners.clear();
    }
  }

  /**
   * Private helper to check if CloudKit is initialized
   * @returns true if initialized, false otherwise
   */
  private isInitialized(): boolean {
    return this.config !== null;
  }

  /**
   * Private method to setup event listeners
   */
  private setupEventListeners(): void {
    if (!this.eventEmitter) {
      return;
    }

    // Auto-subscribe to important events if enabled in config
    if (this.config?.enableNotifications) {
      this.addEventListener('authStatusChanged', (status) => {
        console.log('CloudKit auth status changed:', status);
      });

      this.addEventListener('syncStatusChanged', (status) => {
        console.log('CloudKit sync status changed:', status);
      });

      this.addEventListener('error', (error) => {
        console.error('CloudKit error:', error);
      });
    }
  }
}

/**
 * Default CloudKit Manager instance
 * Following Singleton pattern for global access
 */
export const cloudKitManager = new CloudKitManager();
