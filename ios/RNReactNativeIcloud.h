
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"
#else
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#endif

#import <CloudKit/CloudKit.h>
#import <CoreLocation/CoreLocation.h>

@interface RNReactNativeIcloud : RCTEventEmitter <RCTBridgeModule>

@end
  