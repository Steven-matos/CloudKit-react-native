# React Native CloudKit

A comprehensive React Native library for seamless CloudKit integration with iOS applications. This library provides a modern, type-safe API for interacting with Apple's CloudKit services, following SOLID, DRY, and KISS principles.

## Features

- 🔄 **Full CloudKit Integration** - Complete CRUD operations with CloudKit
- 🎯 **TypeScript Support** - Full type definitions for better development experience
- 🏗️ **Modern Architecture** - Built with SOLID principles and clean code practices
- 🔍 **Query Builder** - Fluent API for building complex CloudKit queries
- 📱 **iOS Only** - Optimized specifically for iOS CloudKit integration
- 🔐 **Authentication Management** - Handle user authentication and permissions
- 📡 **Event System** - Real-time updates for auth status and data changes
- 🧪 **Well Tested** - Comprehensive test coverage

## Installation

```bash
npm install react-native-icloud
# or
yarn add react-native-icloud
```

### iOS Setup

1. **Enable CloudKit in your iOS project:**
   - Open your project in Xcode
   - Select your app target
   - Go to "Signing & Capabilities"
   - Click "+ Capability" and add "iCloud"
   - Enable "CloudKit" and configure your container

2. **Configure your CloudKit container:**
   - Go to [CloudKit Dashboard](https://icloud.developer.apple.com/dashboard/)
   - Create or select your container
   - Note your container identifier

3. **Link the library (React Native 0.60+):**
   ```bash
   cd ios && pod install
   ```

## Quick Start

```typescript
import CloudKit, { CloudKitManager, createQuery } from 'react-native-icloud';

// Initialize CloudKit
const cloudKit = new CloudKitManager();

await cloudKit.initialize({
  containerIdentifier: 'iCloud.com.yourcompany.yourapp',
  environment: 'development', // or 'production'
  enableNotifications: true,
});

// Check authentication status
const authStatus = await cloudKit.getAuthStatus();
console.log('Auth status:', authStatus);

// Create and save a record
const record = {
  recordType: 'Note',
  fields: {
    title: 'My First Note',
    content: 'This is my first CloudKit note!',
    createdAt: { timestamp: Date.now() / 1000 }
  }
};

const saveResult = await cloudKit.save({
  records: [record]
});

// Query records
const query = createQuery('Note')
  .contains('title', 'First')
  .sortDescending('createdAt')
  .limit(10)
  .build();

const results = await cloudKit.query(query);
console.log('Found notes:', results.records);
```

## API Reference

### CloudKitManager

The main class for interacting with CloudKit.

#### Methods

##### `initialize(config: CloudKitConfig): Promise<void>`

Initialize CloudKit with your configuration.

```typescript
interface CloudKitConfig {
  containerIdentifier: string;
  environment: 'development' | 'production';
  apiToken?: string;
  enableNotifications?: boolean;
  syncInterval?: number;
}
```

##### `getAuthStatus(): Promise<CloudKitAuthStatus>`

Get the current authentication status.

Returns: `'available' | 'restricted' | 'noAccount' | 'couldNotDetermine'`

##### `getCurrentUser(): Promise<CloudKitUser | null>`

Get information about the current user.

##### `requestPermissions(): Promise<CloudKitPermissionStatus>`

Request CloudKit permissions from the user.

##### `query(query: CloudKitQuery): Promise<CloudKitQueryResult>`

Query records from CloudKit.

##### `save(request: CloudKitSaveRequest): Promise<CloudKitSaveResult>`

Save records to CloudKit.

##### `delete(request: CloudKitDeleteRequest): Promise<CloudKitDeleteResult>`

Delete records from CloudKit.

##### `addEventListener(event, listener): () => void`

Subscribe to CloudKit events.

Available events:
- `authStatusChanged`: Authentication status changes
- `syncStatusChanged`: Sync status updates
- `recordsChanged`: Record changes from other devices
- `error`: Error notifications

### Query Builder

Build complex queries using the fluent API:

```typescript
import { createQuery, CloudKitComparator } from 'react-native-icloud';

// Simple query
const simpleQuery = createQuery('Note')
  .equals('isPublic', true)
  .build();

// Complex query
const complexQuery = createQuery('Note')
  .contains('title', 'important')
  .greaterThan('createdAt', { timestamp: Date.now() / 1000 - 86400 })
  .sortDescending('createdAt')
  .limit(20)
  .build();

// Location-based query
const locationQuery = createQuery('Place')
  .near('location', 37.7749, -122.4194)
  .build();
```

#### Available Comparators

- `EQUALS`, `NOT_EQUALS`
- `LESS_THAN`, `LESS_THAN_OR_EQUALS`
- `GREATER_THAN`, `GREATER_THAN_OR_EQUALS`
- `CONTAINS`, `NOT_CONTAINS`
- `STARTS_WITH`, `ENDS_WITH`
- `NEAR`, `NOT_NEAR` (for location fields)
- `IN`, `NOT_IN`
- And many more...

### Data Types

The library supports all CloudKit data types:

```typescript
// String
title: 'My Note'

// Number
count: 42

// Boolean
isPublic: true

// Date
createdAt: { timestamp: 1609459200 }

// Location
location: { latitude: 37.7749, longitude: -122.4194 }

// Asset (file)
attachment: { fileChecksum: 'abc123', size: 1024 }

// Reference
parentNote: { recordName: 'note123', action: 'NONE' }

// String List
tags: { strings: ['work', 'important'] }
```

## Advanced Usage

### Event Handling

```typescript
// Listen for authentication changes
const unsubscribe = cloudKit.addEventListener('authStatusChanged', (status) => {
  if (status === 'available') {
    console.log('User is signed in to iCloud');
  } else if (status === 'noAccount') {
    console.log('User needs to sign in to iCloud');
  }
});

// Clean up listener
unsubscribe();
```

### Error Handling

```typescript
try {
  const result = await cloudKit.save({
    records: [record]
  });
} catch (error) {
  if (error.code === 'PERMISSION_DENIED') {
    console.log('User denied CloudKit permissions');
  } else if (error.code === 'NETWORK_ERROR') {
    console.log('Network error occurred');
  }
}
```

### Batch Operations

```typescript
// Save multiple records atomically
const records = [
  { recordType: 'Note', fields: { title: 'Note 1' } },
  { recordType: 'Note', fields: { title: 'Note 2' } },
  { recordType: 'Note', fields: { title: 'Note 3' } }
];

const result = await cloudKit.save({
  records,
  atomic: true // All records saved together or none at all
});
```

## Best Practices

### 1. Initialize Early

Initialize CloudKit as early as possible in your app lifecycle:

```typescript
// In your App.tsx
useEffect(() => {
  const initCloudKit = async () => {
    try {
      await cloudKit.initialize({
        containerIdentifier: 'iCloud.com.yourcompany.yourapp',
        environment: __DEV__ ? 'development' : 'production',
        enableNotifications: true,
      });
    } catch (error) {
      console.error('Failed to initialize CloudKit:', error);
    }
  };
  
  initCloudKit();
}, []);
```

### 2. Handle Authentication Gracefully

```typescript
const checkAuthStatus = async () => {
  const status = await cloudKit.getAuthStatus();
  
  switch (status) {
    case 'available':
      // User is signed in and ready
      break;
    case 'noAccount':
      // Show sign-in prompt
      break;
    case 'restricted':
      // Show restricted access message
      break;
    case 'couldNotDetermine':
      // Retry or show error
      break;
  }
};
```

### 3. Use Query Limits

Always set reasonable limits on your queries:

```typescript
const query = createQuery('Note')
  .limit(50) // Don't fetch too many records at once
  .build();
```

### 4. Handle Network Conditions

```typescript
// Check if CloudKit is available
const isAvailable = await cloudKit.isCloudKitAvailable();
if (!isAvailable) {
  // Handle offline scenario
  return;
}
```

## Troubleshooting

### Common Issues

1. **"CloudKit not initialized" error**
   - Make sure you call `initialize()` before using other methods
   - Check that your container identifier is correct

2. **Authentication failures**
   - Ensure the user is signed in to iCloud on their device
   - Check that your app has CloudKit capabilities enabled

3. **Permission errors**
   - Call `requestPermissions()` before performing operations
   - Check your CloudKit container configuration

4. **Network errors**
   - CloudKit requires an active internet connection
   - Handle network failures gracefully in your app

### Debug Mode

Enable debug logging by setting the environment to 'development':

```typescript
await cloudKit.initialize({
  containerIdentifier: 'iCloud.com.yourcompany.yourapp',
  environment: 'development', // This enables debug logging
});
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/stevenmatos/react-native-icloud.git
cd react-native-icloud
npm install
npm run build
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/stevenmatos/react-native-icloud#readme)
- 🐛 [Issues](https://github.com/stevenmatos/react-native-icloud/issues)
- 💬 [Discussions](https://github.com/stevenmatos/react-native-icloud/discussions)

## Changelog

### 1.0.0
- Initial release
- Full CloudKit integration
- TypeScript support
- Query builder API
- Event system
- Comprehensive documentation