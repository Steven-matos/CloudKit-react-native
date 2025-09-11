// Jest setup file for react-native-icloud tests

// Mock React Native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  return {
    ...RN,
    NativeModules: {
      ...RN.NativeModules,
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
  };
});

// Global test utilities
global.mockCloudKitResponse = (data) => {
  const { NativeModules } = require('react-native');
  Object.keys(NativeModules.RNReactNativeIcloud).forEach(method => {
    if (typeof NativeModules.RNReactNativeIcloud[method] === 'function') {
      NativeModules.RNReactNativeIcloud[method].mockResolvedValue(data);
    }
  });
};

global.mockCloudKitError = (error) => {
  const { NativeModules } = require('react-native');
  Object.keys(NativeModules.RNReactNativeIcloud).forEach(method => {
    if (typeof NativeModules.RNReactNativeIcloud[method] === 'function') {
      NativeModules.RNReactNativeIcloud[method].mockRejectedValue(error);
    }
  });
};
