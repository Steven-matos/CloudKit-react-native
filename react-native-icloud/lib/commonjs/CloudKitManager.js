"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloudKitManager = exports.CloudKitManager = void 0;
var _reactNative = require("react-native");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * CloudKit Manager - Main interface for CloudKit operations
 * Provides a clean, promise-based API following SOLID principles
 */
const {
  RNReactNativeIcloud
} = _reactNative.NativeModules;

/**
 * Main CloudKit Manager class
 * Implements Single Responsibility Principle - handles only CloudKit operations
 */
class CloudKitManager {
  constructor() {
    _defineProperty(this, "eventEmitter", null);
    _defineProperty(this, "config", null);
    _defineProperty(this, "listeners", new Map());
    if (_reactNative.Platform.OS === 'ios' && RNReactNativeIcloud) {
      this.eventEmitter = new _reactNative.NativeEventEmitter(RNReactNativeIcloud);
    }
  }

  /**
   * Initialize CloudKit with configuration
   * @param config - CloudKit configuration object
   * @returns Promise that resolves when initialization is complete
   */
  async initialize(config) {
    if (_reactNative.Platform.OS !== 'ios') {
      throw new Error('CloudKit is only available on iOS');
    }
    if (!RNReactNativeIcloud) {
      throw new Error('Native CloudKit module not available');
    }
    this.config = config;
    await RNReactNativeIcloud.initialize(config);
    this.setupEventListeners();
  }

  /**
   * Get the current authentication status
   * @returns Promise resolving to authentication status
   */
  async getAuthStatus() {
    if (!this.isInitialized()) {
      throw new Error('CloudKit not initialized. Call initialize() first.');
    }
    return RNReactNativeIcloud.getAuthStatus();
  }

  /**
   * Get current user information
   * @returns Promise resolving to user information
   */
  async getCurrentUser() {
    if (!this.isInitialized()) {
      throw new Error('CloudKit not initialized. Call initialize() first.');
    }
    return RNReactNativeIcloud.getCurrentUser();
  }

  /**
   * Request CloudKit permissions
   * @returns Promise resolving to permission status
   */
  async requestPermissions() {
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
  async query(query) {
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
  async save(request) {
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
  async delete(request) {
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
  addEventListener(event, listener) {
    if (!this.eventEmitter) {
      throw new Error('Event emitter not available');
    }
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(listener);
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
  async getSyncStatus() {
    if (!this.isInitialized()) {
      throw new Error('CloudKit not initialized. Call initialize() first.');
    }
    return RNReactNativeIcloud.getSyncStatus();
  }

  /**
   * Force sync with CloudKit
   * @returns Promise resolving when sync is complete
   */
  async sync() {
    if (!this.isInitialized()) {
      throw new Error('CloudKit not initialized. Call initialize() first.');
    }
    return RNReactNativeIcloud.sync();
  }

  /**
   * Check if CloudKit is available on the device
   * @returns Promise resolving to availability status
   */
  async isCloudKitAvailable() {
    if (_reactNative.Platform.OS !== 'ios') {
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
  cleanup() {
    if (this.eventEmitter) {
      this.listeners.forEach((listeners, event) => {
        listeners.forEach(listener => {
          this.eventEmitter.removeAllListeners(event);
        });
      });
      this.listeners.clear();
    }
  }

  /**
   * Private helper to check if CloudKit is initialized
   * @returns true if initialized, false otherwise
   */
  isInitialized() {
    return this.config !== null;
  }

  /**
   * Private method to setup event listeners
   */
  setupEventListeners() {
    var _this$config;
    if (!this.eventEmitter) {
      return;
    }

    // Auto-subscribe to important events if enabled in config
    if ((_this$config = this.config) !== null && _this$config !== void 0 && _this$config.enableNotifications) {
      this.addEventListener('authStatusChanged', status => {
        console.log('CloudKit auth status changed:', status);
      });
      this.addEventListener('syncStatusChanged', status => {
        console.log('CloudKit sync status changed:', status);
      });
      this.addEventListener('error', error => {
        console.error('CloudKit error:', error);
      });
    }
  }
}

/**
 * Default CloudKit Manager instance
 * Following Singleton pattern for global access
 */
exports.CloudKitManager = CloudKitManager;
const cloudKitManager = exports.cloudKitManager = new CloudKitManager();
//# sourceMappingURL=CloudKitManager.js.map