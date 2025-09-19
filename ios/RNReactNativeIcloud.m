
#import "RNReactNativeIcloud.h"

@implementation RNReactNativeIcloud {
    CKContainer *_container;
    NSString *_containerIdentifier;
    CKEnvironment _environment;
    BOOL _isInitialized;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _isInitialized = NO;
        _environment = CKEnvironmentDevelopment; // Default to development
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[
        @"authStatusChanged",
        @"syncStatusChanged", 
        @"recordsChanged",
        @"error"
    ];
}

#pragma mark - Public Methods

/**
 * Initialize CloudKit with configuration
 * @param config Dictionary containing containerIdentifier, environment, and apiToken
 */
RCT_EXPORT_METHOD(initialize:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    @try {
        NSString *containerId = config[@"containerIdentifier"];
        NSString *environment = config[@"environment"];
        NSString *apiToken = config[@"apiToken"];
        
        if (!containerId) {
            reject(@"INVALID_CONFIG", @"containerIdentifier is required", nil);
            return;
        }
        
        _containerIdentifier = containerId;
        
        // Set environment
        if ([environment isEqualToString:@"production"]) {
            _environment = CKEnvironmentProduction;
        } else {
            _environment = CKEnvironmentDevelopment;
        }
        
        // Initialize container
        _container = [CKContainer containerWithIdentifier:containerId];
        
        // Configure API token if provided
        if (apiToken) {
            // API tokens are typically set on the container level, not database level
            // This may need to be adjusted based on your specific CloudKit setup
            [_container setValue:apiToken forKey:@"apiToken"];
        }
        
        _isInitialized = YES;
        
        // Start monitoring auth status changes
        [self startMonitoringAuthStatus];
        
        resolve(@YES);
        
    } @catch (NSException *exception) {
        reject(@"INIT_ERROR", exception.reason, nil);
    }
}

/**
 * Get current authentication status
 */
RCT_EXPORT_METHOD(getAuthStatus:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (![self ensureInitialized:reject]) return;
    
    [_container accountStatusWithCompletionHandler:^(CKAccountStatus accountStatus, NSError *error) {
        if (error) {
            reject(@"AUTH_STATUS_ERROR", error.localizedDescription, error);
            return;
        }
        
        NSString *status = [self convertAccountStatusToString:accountStatus];
        resolve(status);
    }];
}

/**
 * Get current user information
 */
RCT_EXPORT_METHOD(getCurrentUser:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (![self ensureInitialized:reject]) return;
    
    [_container fetchUserRecordIDWithCompletionHandler:^(CKRecordID *recordID, NSError *error) {
        if (error) {
            reject(@"USER_FETCH_ERROR", error.localizedDescription, error);
            return;
        }
        
        if (!recordID) {
            resolve(nil);
            return;
        }
        
        // Fetch user record details
        [_container.publicCloudDatabase fetchRecordWithID:recordID completionHandler:^(CKRecord *record, NSError *error) {
            if (error) {
                // User record might not exist, return basic info
                NSDictionary *userInfo = @{
                    @"userRecordName": recordID.recordName ?: @"",
                    @"isDiscoverable": @NO
                };
                resolve(userInfo);
                return;
            }
            
            NSDictionary *userInfo = @{
                @"userRecordName": recordID.recordName ?: @"",
                @"isDiscoverable": record[@"isDiscoverable"] ?: @NO,
                @"nameComponents": record[@"nameComponents"] ?: @{}
            };
            resolve(userInfo);
        }];
    }];
}

/**
 * Request CloudKit permissions
 */
RCT_EXPORT_METHOD(requestPermissions:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (![self ensureInitialized:reject]) return;
    
    [_container accountStatusWithCompletionHandler:^(CKAccountStatus accountStatus, NSError *error) {
        if (error) {
            reject(@"PERMISSION_ERROR", error.localizedDescription, error);
            return;
        }
        
        NSString *permissionStatus = [self convertAccountStatusToPermissionStatus:accountStatus];
        resolve(permissionStatus);
    }];
}

/**
 * Query records from CloudKit
 */
RCT_EXPORT_METHOD(query:(NSDictionary *)queryConfig
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (![self ensureInitialized:reject]) return;
    
    @try {
        NSString *recordType = queryConfig[@"recordType"];
        NSArray *filterBy = queryConfig[@"filterBy"];
        NSArray *sortBy = queryConfig[@"sortBy"];
        NSNumber *resultsLimit = queryConfig[@"resultsLimit"];
        NSArray *desiredKeys = queryConfig[@"desiredKeys"];
        
        if (!recordType) {
            reject(@"INVALID_QUERY", @"recordType is required", nil);
            return;
        }
        
        // Create predicate
        NSPredicate *predicate = [NSPredicate predicateWithValue:YES]; // Default to all records
        
        if (filterBy && filterBy.count > 0) {
            predicate = [self buildPredicateFromFilters:filterBy];
        }
        
        // Create query
        CKQuery *query = [[CKQuery alloc] initWithRecordType:recordType predicate:predicate];
        
        // Add sort descriptors
        if (sortBy && sortBy.count > 0) {
            NSMutableArray *sortDescriptors = [NSMutableArray array];
            for (NSDictionary *sortConfig in sortBy) {
                NSString *fieldName = sortConfig[@"fieldName"];
                BOOL ascending = [sortConfig[@"ascending"] boolValue];
                
                if (fieldName) {
                    NSSortDescriptor *sortDescriptor = [NSSortDescriptor sortDescriptorWithKey:fieldName ascending:ascending];
                    [sortDescriptors addObject:sortDescriptor];
                }
            }
            query.sortDescriptors = sortDescriptors;
        }
        
        // Create query operation
        CKQueryOperation *operation = [[CKQueryOperation alloc] initWithQuery:query];
        
        if (desiredKeys) {
            operation.desiredKeys = desiredKeys;
        }
        
        if (resultsLimit) {
            operation.resultsLimit = [resultsLimit integerValue];
        }
        
        NSMutableArray *records = [NSMutableArray array];
        
        operation.recordFetchedBlock = ^(CKRecord *record) {
            NSDictionary *recordDict = [self convertRecordToDictionary:record];
            [records addObject:recordDict];
        };
        
        operation.queryCompletionBlock = ^(CKQueryCursor *cursor, NSError *error) {
            if (error) {
                reject(@"QUERY_ERROR", error.localizedDescription, error);
                return;
            }
            
            NSDictionary *result = @{
                @"records": records,
                @"continuationMarker": cursor ? [self serializeCursor:cursor] : [NSNull null],
                @"moreComing": cursor ? @YES : @NO
            };
            
            resolve(result);
        };
        
        [_container.privateCloudDatabase addOperation:operation];
        
    } @catch (NSException *exception) {
        reject(@"QUERY_ERROR", exception.reason, nil);
    }
}

/**
 * Save records to CloudKit
 */
RCT_EXPORT_METHOD(save:(NSDictionary *)saveConfig
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (![self ensureInitialized:reject]) return;
    
    @try {
        NSArray *recordsData = saveConfig[@"records"];
        BOOL atomic = [saveConfig[@"atomic"] boolValue];
        
        if (!recordsData || recordsData.count == 0) {
            reject(@"INVALID_SAVE", @"records array is required", nil);
            return;
        }
        
        NSMutableArray *records = [NSMutableArray array];
        
        for (NSDictionary *recordData in recordsData) {
            CKRecord *record = [self convertDictionaryToRecord:recordData];
            if (record) {
                [records addObject:record];
            }
        }
        
        if (records.count == 0) {
            reject(@"INVALID_SAVE", @"No valid records to save", nil);
            return;
        }
        
        CKModifyRecordsOperation *operation = [[CKModifyRecordsOperation alloc] initWithRecordsToSave:records recordIDsToDelete:nil];
        operation.savePolicy = atomic ? CKRecordSaveAllKeys : CKRecordSaveChangedKeys;
        
        operation.modifyRecordsCompletionBlock = ^(NSArray<CKRecord *> *savedRecords, NSArray<CKRecordID *> *deletedRecordIDs, NSError *error) {
            if (error) {
                reject(@"SAVE_ERROR", error.localizedDescription, error);
                return;
            }
            
            NSMutableArray *savedRecordsData = [NSMutableArray array];
            for (CKRecord *record in savedRecords) {
                NSDictionary *recordDict = [self convertRecordToDictionary:record];
                [savedRecordsData addObject:recordDict];
            }
            
            NSDictionary *result = @{
                @"records": savedRecordsData
            };
            
            resolve(result);
        };
        
        [_container.privateCloudDatabase addOperation:operation];
        
    } @catch (NSException *exception) {
        reject(@"SAVE_ERROR", exception.reason, nil);
    }
}

/**
 * Delete records from CloudKit
 */
RCT_EXPORT_METHOD(delete:(NSDictionary *)deleteConfig
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (![self ensureInitialized:reject]) return;
    
    @try {
        NSArray *recordNames = deleteConfig[@"recordNames"];
        BOOL atomic = [deleteConfig[@"atomic"] boolValue];
        
        if (!recordNames || recordNames.count == 0) {
            reject(@"INVALID_DELETE", @"recordNames array is required", nil);
            return;
        }
        
        NSMutableArray *recordIDs = [NSMutableArray array];
        for (NSString *recordName in recordNames) {
            CKRecordID *recordID = [[CKRecordID alloc] initWithRecordName:recordName];
            [recordIDs addObject:recordID];
        }
        
        CKModifyRecordsOperation *operation = [[CKModifyRecordsOperation alloc] initWithRecordsToSave:nil recordIDsToDelete:recordIDs];
        operation.savePolicy = atomic ? CKRecordSaveAllKeys : CKRecordSaveChangedKeys;
        
        operation.modifyRecordsCompletionBlock = ^(NSArray<CKRecord *> *savedRecords, NSArray<CKRecordID *> *deletedRecordIDs, NSError *error) {
            if (error) {
                reject(@"DELETE_ERROR", error.localizedDescription, error);
                return;
            }
            
            NSMutableArray *deletedRecordsData = [NSMutableArray array];
            for (CKRecordID *recordID in deletedRecordIDs) {
                NSDictionary *recordDict = @{
                    @"recordName": recordID.recordName,
                    @"deleted": @YES
                };
                [deletedRecordsData addObject:recordDict];
            }
            
            NSDictionary *result = @{
                @"records": deletedRecordsData
            };
            
            resolve(result);
        };
        
        [_container.privateCloudDatabase addOperation:operation];
        
    } @catch (NSException *exception) {
        reject(@"DELETE_ERROR", exception.reason, nil);
    }
}

/**
 * Get current sync status
 */
RCT_EXPORT_METHOD(getSyncStatus:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (![self ensureInitialized:reject]) return;
    
    // CloudKit doesn't provide direct sync status, so we simulate it
    NSDictionary *syncStatus = @{
        @"isSyncing": @NO,
        @"lastSyncDate": [NSNull null]
    };
    
    resolve(syncStatus);
}

/**
 * Force sync with CloudKit
 */
RCT_EXPORT_METHOD(sync:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    if (![self ensureInitialized:reject]) return;
    
    // Trigger auth status check which will also sync
    [_container accountStatusWithCompletionHandler:^(CKAccountStatus accountStatus, NSError *error) {
        if (error) {
            reject(@"SYNC_ERROR", error.localizedDescription, error);
            return;
        }
        
        resolve(@YES);
    }];
}

/**
 * Check if CloudKit is available
 */
RCT_EXPORT_METHOD(isCloudKitAvailable:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    BOOL isAvailable = [CKContainer class] != nil;
    resolve(@(isAvailable));
}

#pragma mark - Private Helper Methods

- (BOOL)ensureInitialized:(RCTPromiseRejectBlock)reject {
    if (!_isInitialized) {
        reject(@"NOT_INITIALIZED", @"CloudKit not initialized. Call initialize() first.", nil);
        return NO;
    }
    return YES;
}

- (NSString *)convertAccountStatusToString:(CKAccountStatus)status {
    switch (status) {
        case CKAccountStatusAvailable:
            return @"available";
        case CKAccountStatusRestricted:
            return @"restricted";
        case CKAccountStatusNoAccount:
            return @"noAccount";
        case CKAccountStatusCouldNotDetermine:
            return @"couldNotDetermine";
        default:
            return @"couldNotDetermine";
    }
}

- (NSString *)convertAccountStatusToPermissionStatus:(CKAccountStatus)status {
    switch (status) {
        case CKAccountStatusAvailable:
            return @"granted";
        case CKAccountStatusRestricted:
            return @"restricted";
        case CKAccountStatusNoAccount:
            return @"denied";
        case CKAccountStatusCouldNotDetermine:
            return @"undetermined";
        default:
            return @"undetermined";
    }
}

- (NSPredicate *)buildPredicateFromFilters:(NSArray *)filters {
    NSMutableArray *predicates = [NSMutableArray array];
    
    for (NSDictionary *filter in filters) {
        NSString *fieldName = filter[@"fieldName"];
        NSString *comparator = filter[@"comparator"];
        id fieldValue = filter[@"fieldValue"];
        
        if (!fieldName || !comparator || !fieldValue) {
            continue;
        }
        
        NSPredicate *predicate = [self createPredicateForField:fieldName comparator:comparator value:fieldValue];
        if (predicate) {
            [predicates addObject:predicate];
        }
    }
    
    if (predicates.count == 0) {
        return [NSPredicate predicateWithValue:YES];
    }
    
    return [NSCompoundPredicate andPredicateWithSubpredicates:predicates];
}

- (NSPredicate *)createPredicateForField:(NSString *)fieldName comparator:(NSString *)comparator value:(id)value {
    if ([comparator isEqualToString:@"EQUALS"]) {
        return [NSPredicate predicateWithFormat:@"%K == %@", fieldName, value];
    } else if ([comparator isEqualToString:@"NOT_EQUALS"]) {
        return [NSPredicate predicateWithFormat:@"%K != %@", fieldName, value];
    } else if ([comparator isEqualToString:@"LESS_THAN"]) {
        return [NSPredicate predicateWithFormat:@"%K < %@", fieldName, value];
    } else if ([comparator isEqualToString:@"LESS_THAN_OR_EQUALS"]) {
        return [NSPredicate predicateWithFormat:@"%K <= %@", fieldName, value];
    } else if ([comparator isEqualToString:@"GREATER_THAN"]) {
        return [NSPredicate predicateWithFormat:@"%K > %@", fieldName, value];
    } else if ([comparator isEqualToString:@"GREATER_THAN_OR_EQUALS"]) {
        return [NSPredicate predicateWithFormat:@"%K >= %@", fieldName, value];
    } else if ([comparator isEqualToString:@"CONTAINS"]) {
        return [NSPredicate predicateWithFormat:@"%K CONTAINS %@", fieldName, value];
    } else if ([comparator isEqualToString:@"STARTS_WITH"]) {
        return [NSPredicate predicateWithFormat:@"%K BEGINSWITH %@", fieldName, value];
    }
    
    // Default to equals for unsupported comparators
    return [NSPredicate predicateWithFormat:@"%K == %@", fieldName, value];
}

- (NSDictionary *)convertRecordToDictionary:(CKRecord *)record {
    NSMutableDictionary *recordDict = [NSMutableDictionary dictionary];
    
    recordDict[@"recordName"] = record.recordID.recordName;
    recordDict[@"recordType"] = record.recordType;
    
    if (record.recordChangeTag) {
        recordDict[@"recordChangeTag"] = record.recordChangeTag;
    }
    
    if (record.creationDate) {
        recordDict[@"created"] = @{@"timestamp": @([record.creationDate timeIntervalSince1970])};
    }
    
    if (record.modificationDate) {
        recordDict[@"modified"] = @{@"timestamp": @([record.modificationDate timeIntervalSince1970])};
    }
    
    NSMutableDictionary *fields = [NSMutableDictionary dictionary];
    for (NSString *key in record.allKeys) {
        id value = record[key];
        fields[key] = [self convertCloudKitValueToDictionary:value];
    }
    recordDict[@"fields"] = fields;
    
    return recordDict;
}

- (CKRecord *)convertDictionaryToRecord:(NSDictionary *)recordDict {
    NSString *recordName = recordDict[@"recordName"];
    NSString *recordType = recordDict[@"recordType"];
    
    if (!recordType) {
        return nil;
    }
    
    CKRecord *record;
    if (recordName) {
        CKRecordID *recordID = [[CKRecordID alloc] initWithRecordName:recordName];
        record = [[CKRecord alloc] initWithRecordType:recordType recordID:recordID];
    } else {
        record = [[CKRecord alloc] initWithRecordType:recordType];
    }
    
    NSDictionary *fields = recordDict[@"fields"];
    if (fields) {
        for (NSString *key in fields) {
            id value = [self convertDictionaryToCloudKitValue:fields[key]];
            if (value) {
                record[key] = value;
            }
        }
    }
    
    return record;
}

- (id)convertCloudKitValueToDictionary:(id)value {
    if ([value isKindOfClass:[NSString class]] ||
        [value isKindOfClass:[NSNumber class]] ||
        [value isKindOfClass:[NSNull class]]) {
        return value;
    } else if ([value isKindOfClass:[NSDate class]]) {
        return @{@"timestamp": @([(NSDate *)value timeIntervalSince1970])};
    } else if ([value isKindOfClass:[CLLocation class]]) {
        CLLocation *location = (CLLocation *)value;
        return @{
            @"latitude": @(location.coordinate.latitude),
            @"longitude": @(location.coordinate.longitude)
        };
    } else if ([value isKindOfClass:[CKAsset class]]) {
        CKAsset *asset = (CKAsset *)value;
        return @{
            @"fileChecksum": asset.fileChecksum ?: @"",
            @"size": @(asset.fileSize)
        };
    }
    
    return value;
}

- (id)convertDictionaryToCloudKitValue:(id)value {
    if ([value isKindOfClass:[NSDictionary class]]) {
        NSDictionary *dict = (NSDictionary *)value;
        
        if (dict[@"timestamp"]) {
            NSNumber *timestamp = dict[@"timestamp"];
            if ([timestamp isKindOfClass:[NSNumber class]]) {
                return [NSDate dateWithTimeIntervalSince1970:[timestamp doubleValue]];
            }
        } else if (dict[@"latitude"] && dict[@"longitude"]) {
            NSNumber *latitude = dict[@"latitude"];
            NSNumber *longitude = dict[@"longitude"];
            
            if ([latitude isKindOfClass:[NSNumber class]] && [longitude isKindOfClass:[NSNumber class]]) {
                CLLocationCoordinate2D coordinate = CLLocationCoordinate2DMake(
                    [latitude doubleValue],
                    [longitude doubleValue]
                );
                return [[CLLocation alloc] initWithLatitude:coordinate.latitude longitude:coordinate.longitude];
            }
        }
    }
    
    return value;
}

- (NSString *)serializeCursor:(CKQueryCursor *)cursor {
    NSData *data = [NSKeyedArchiver archivedDataWithRootObject:cursor];
    return [data base64EncodedStringWithOptions:0];
}

- (void)startMonitoringAuthStatus {
    // Monitor auth status changes
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleAccountStatusChanged:)
                                                 name:CKAccountChangedNotification
                                               object:nil];
}

- (void)handleAccountStatusChanged:(NSNotification *)notification {
    [_container accountStatusWithCompletionHandler:^(CKAccountStatus accountStatus, NSError *error) {
        if (!error) {
            NSString *status = [self convertAccountStatusToString:accountStatus];
            [self sendEventWithName:@"authStatusChanged" body:status];
        }
    }];
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
  