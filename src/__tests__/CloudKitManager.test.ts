/**
 * Unit tests for CloudKitManager
 * Tests core functionality and error handling
 */

import { CloudKitManager } from '../CloudKitManager';
import { CloudKitConfig, CloudKitAuthStatus } from '../types';

// Mock React Native modules
jest.mock('react-native', () => ({
  NativeModules: {
    RNReactNativeIcloud: {
      initialize: jest.fn(),
      getAuthStatus: jest.fn(),
      getCurrentUser: jest.fn(),
      requestPermissions: jest.fn(),
      query: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      getSyncStatus: jest.fn(),
      sync: jest.fn(),
      isCloudKitAvailable: jest.fn(),
    },
  },
  NativeEventEmitter: jest.fn(() => ({
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeAllListeners: jest.fn(),
  })),
  Platform: {
    OS: 'ios',
  },
}));

describe('CloudKitManager', () => {
  let cloudKit: CloudKitManager;
  let mockNativeModule: any;

  beforeEach(() => {
    cloudKit = new CloudKitManager();
    mockNativeModule = require('react-native').NativeModules.RNReactNativeIcloud;
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    cloudKit.cleanup();
  });

  describe('initialization', () => {
    const validConfig: CloudKitConfig = {
      containerIdentifier: 'iCloud.com.test.app',
      environment: 'development',
      enableNotifications: true,
    };

    it('should initialize successfully with valid config', async () => {
      mockNativeModule.initialize.mockResolvedValue(true);

      await expect(cloudKit.initialize(validConfig)).resolves.toBeUndefined();
      expect(mockNativeModule.initialize).toHaveBeenCalledWith(validConfig);
    });

    it('should throw error if native module is not available', async () => {
      const { NativeModules } = require('react-native');
      NativeModules.RNReactNativeIcloud = null;

      const newCloudKit = new CloudKitManager();
      await expect(newCloudKit.initialize(validConfig)).rejects.toThrow(
        'Native CloudKit module not available'
      );
    });

    it('should throw error if not on iOS platform', async () => {
      const { Platform } = require('react-native');
      Platform.OS = 'android';

      await expect(cloudKit.initialize(validConfig)).rejects.toThrow(
        'CloudKit is only available on iOS'
      );
    });

    it('should handle initialization errors', async () => {
      const error = new Error('Initialization failed');
      mockNativeModule.initialize.mockRejectedValue(error);

      await expect(cloudKit.initialize(validConfig)).rejects.toThrow(
        'Initialization failed'
      );
    });
  });

  describe('authentication', () => {
    beforeEach(async () => {
      const validConfig: CloudKitConfig = {
        containerIdentifier: 'iCloud.com.test.app',
        environment: 'development',
      };
      mockNativeModule.initialize.mockResolvedValue(true);
      await cloudKit.initialize(validConfig);
    });

    it('should get authentication status', async () => {
      const mockStatus: CloudKitAuthStatus = 'available';
      mockNativeModule.getAuthStatus.mockResolvedValue(mockStatus);

      const status = await cloudKit.getAuthStatus();
      expect(status).toBe(mockStatus);
      expect(mockNativeModule.getAuthStatus).toHaveBeenCalled();
    });

    it('should get current user information', async () => {
      const mockUser = {
        userRecordName: 'test-user',
        isDiscoverable: true,
      };
      mockNativeModule.getCurrentUser.mockResolvedValue(mockUser);

      const user = await cloudKit.getCurrentUser();
      expect(user).toEqual(mockUser);
      expect(mockNativeModule.getCurrentUser).toHaveBeenCalled();
    });

    it('should request permissions', async () => {
      mockNativeModule.requestPermissions.mockResolvedValue('granted');

      const permission = await cloudKit.requestPermissions();
      expect(permission).toBe('granted');
      expect(mockNativeModule.requestPermissions).toHaveBeenCalled();
    });

    it('should throw error if not initialized', async () => {
      const newCloudKit = new CloudKitManager();
      await expect(newCloudKit.getAuthStatus()).rejects.toThrow(
        'CloudKit not initialized. Call initialize() first.'
      );
    });
  });

  describe('query operations', () => {
    beforeEach(async () => {
      const validConfig: CloudKitConfig = {
        containerIdentifier: 'iCloud.com.test.app',
        environment: 'development',
      };
      mockNativeModule.initialize.mockResolvedValue(true);
      await cloudKit.initialize(validConfig);
    });

    it('should query records successfully', async () => {
      const mockQuery = {
        recordType: 'Note',
        filterBy: [],
        sortBy: [],
      };

      const mockResult = {
        records: [
          {
            recordName: 'note1',
            recordType: 'Note',
            fields: { title: 'Test Note' },
          },
        ],
        moreComing: false,
      };

      mockNativeModule.query.mockResolvedValue(mockResult);

      const result = await cloudKit.query(mockQuery);
      expect(result).toEqual(mockResult);
      expect(mockNativeModule.query).toHaveBeenCalledWith(mockQuery);
    });

    it('should handle query errors', async () => {
      const mockQuery = {
        recordType: 'Note',
        filterBy: [],
        sortBy: [],
      };

      const error = new Error('Query failed');
      mockNativeModule.query.mockRejectedValue(error);

      await expect(cloudKit.query(mockQuery)).rejects.toThrow('Query failed');
    });
  });

  describe('save operations', () => {
    beforeEach(async () => {
      const validConfig: CloudKitConfig = {
        containerIdentifier: 'iCloud.com.test.app',
        environment: 'development',
      };
      mockNativeModule.initialize.mockResolvedValue(true);
      await cloudKit.initialize(validConfig);
    });

    it('should save records successfully', async () => {
      const mockSaveRequest = {
        records: [
          {
            recordType: 'Note',
            fields: { title: 'New Note', content: 'Note content' },
          },
        ],
      };

      const mockResult = {
        records: [
          {
            recordName: 'new-note-id',
            recordType: 'Note',
            fields: { title: 'New Note', content: 'Note content' },
          },
        ],
      };

      mockNativeModule.save.mockResolvedValue(mockResult);

      const result = await cloudKit.save(mockSaveRequest);
      expect(result).toEqual(mockResult);
      expect(mockNativeModule.save).toHaveBeenCalledWith(mockSaveRequest);
    });

    it('should handle save errors', async () => {
      const mockSaveRequest = {
        records: [
          {
            recordType: 'Note',
            fields: { title: 'New Note' },
          },
        ],
      };

      const error = new Error('Save failed');
      mockNativeModule.save.mockRejectedValue(error);

      await expect(cloudKit.save(mockSaveRequest)).rejects.toThrow('Save failed');
    });
  });

  describe('delete operations', () => {
    beforeEach(async () => {
      const validConfig: CloudKitConfig = {
        containerIdentifier: 'iCloud.com.test.app',
        environment: 'development',
      };
      mockNativeModule.initialize.mockResolvedValue(true);
      await cloudKit.initialize(validConfig);
    });

    it('should delete records successfully', async () => {
      const mockDeleteRequest = {
        recordNames: ['note1', 'note2'],
      };

      const mockResult = {
        records: [
          { recordName: 'note1', deleted: true },
          { recordName: 'note2', deleted: true },
        ],
      };

      mockNativeModule.delete.mockResolvedValue(mockResult);

      const result = await cloudKit.delete(mockDeleteRequest);
      expect(result).toEqual(mockResult);
      expect(mockNativeModule.delete).toHaveBeenCalledWith(mockDeleteRequest);
    });

    it('should handle delete errors', async () => {
      const mockDeleteRequest = {
        recordNames: ['note1'],
      };

      const error = new Error('Delete failed');
      mockNativeModule.delete.mockRejectedValue(error);

      await expect(cloudKit.delete(mockDeleteRequest)).rejects.toThrow(
        'Delete failed'
      );
    });
  });

  describe('event listeners', () => {
    beforeEach(async () => {
      const validConfig: CloudKitConfig = {
        containerIdentifier: 'iCloud.com.test.app',
        environment: 'development',
        enableNotifications: true,
      };
      mockNativeModule.initialize.mockResolvedValue(true);
      await cloudKit.initialize(validConfig);
    });

    it('should add event listeners', () => {
      const mockListener = jest.fn();
      const unsubscribe = cloudKit.addEventListener('authStatusChanged', mockListener);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should throw error if event emitter not available', () => {
      const { NativeEventEmitter } = require('react-native');
      NativeEventEmitter.mockReturnValue(null);

      const newCloudKit = new CloudKitManager();
      expect(() => {
        newCloudKit.addEventListener('authStatusChanged', jest.fn());
      }).toThrow('Event emitter not available');
    });
  });

  describe('utility methods', () => {
    it('should check CloudKit availability', async () => {
      mockNativeModule.isCloudKitAvailable.mockResolvedValue(true);

      const isAvailable = await cloudKit.isCloudKitAvailable();
      expect(isAvailable).toBe(true);
      expect(mockNativeModule.isCloudKitAvailable).toHaveBeenCalled();
    });

    it('should get sync status', async () => {
      const validConfig: CloudKitConfig = {
        containerIdentifier: 'iCloud.com.test.app',
        environment: 'development',
      };
      mockNativeModule.initialize.mockResolvedValue(true);
      mockNativeModule.getSyncStatus.mockResolvedValue({
        isSyncing: false,
        lastSyncDate: null,
      });

      await cloudKit.initialize(validConfig);
      const syncStatus = await cloudKit.getSyncStatus();

      expect(syncStatus).toEqual({
        isSyncing: false,
        lastSyncDate: null,
      });
    });

    it('should force sync', async () => {
      const validConfig: CloudKitConfig = {
        containerIdentifier: 'iCloud.com.test.app',
        environment: 'development',
      };
      mockNativeModule.initialize.mockResolvedValue(true);
      mockNativeModule.sync.mockResolvedValue(true);

      await cloudKit.initialize(validConfig);
      await cloudKit.sync();

      expect(mockNativeModule.sync).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should cleanup resources', () => {
      expect(() => cloudKit.cleanup()).not.toThrow();
    });
  });
});
