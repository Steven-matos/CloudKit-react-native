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

// Enums and constants
export { CloudKitComparator } from './CloudKitComparator';

// Re-export the main manager as default
export { cloudKitManager as default } from './CloudKitManager';
//# sourceMappingURL=index.js.map