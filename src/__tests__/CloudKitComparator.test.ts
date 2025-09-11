/**
 * Unit tests for CloudKitComparator
 * Tests comparator validation and functionality
 */

import { CloudKitComparator, isValidComparatorForField } from '../CloudKitComparator';

describe('CloudKitComparator', () => {
  describe('enum values', () => {
    it('should have all expected comparator values', () => {
      expect(CloudKitComparator.EQUALS).toBe('EQUALS');
      expect(CloudKitComparator.NOT_EQUALS).toBe('NOT_EQUALS');
      expect(CloudKitComparator.LESS_THAN).toBe('LESS_THAN');
      expect(CloudKitComparator.LESS_THAN_OR_EQUALS).toBe('LESS_THAN_OR_EQUALS');
      expect(CloudKitComparator.GREATER_THAN).toBe('GREATER_THAN');
      expect(CloudKitComparator.GREATER_THAN_OR_EQUALS).toBe('GREATER_THAN_OR_EQUALS');
      expect(CloudKitComparator.NEAR).toBe('NEAR');
      expect(CloudKitComparator.NOT_NEAR).toBe('NOT_NEAR');
      expect(CloudKitComparator.CONTAINS).toBe('CONTAINS');
      expect(CloudKitComparator.NOT_CONTAINS).toBe('NOT_CONTAINS');
      expect(CloudKitComparator.CONTAINS_ALL_TOKENS).toBe('CONTAINS_ALL_TOKENS');
      expect(CloudKitComparator.CONTAINS_ANY_TOKENS).toBe('CONTAINS_ANY_TOKENS');
      expect(CloudKitComparator.NOT_CONTAINS_ALL_TOKENS).toBe('NOT_CONTAINS_ALL_TOKENS');
      expect(CloudKitComparator.NOT_CONTAINS_ANY_TOKENS).toBe('NOT_CONTAINS_ANY_TOKENS');
      expect(CloudKitComparator.IN).toBe('IN');
      expect(CloudKitComparator.NOT_IN).toBe('NOT_IN');
      expect(CloudKitComparator.CONTAINS_ALL).toBe('CONTAINS_ALL');
      expect(CloudKitComparator.CONTAINS_ANY).toBe('CONTAINS_ANY');
      expect(CloudKitComparator.NOT_CONTAINS_ALL).toBe('NOT_CONTAINS_ALL');
      expect(CloudKitComparator.NOT_CONTAINS_ANY).toBe('NOT_CONTAINS_ANY');
      expect(CloudKitComparator.LIST_CONTAINS).toBe('LIST_CONTAINS');
      expect(CloudKitComparator.LIST_NOT_CONTAINS).toBe('LIST_NOT_CONTAINS');
      expect(CloudKitComparator.LIST_CONTAINS_ALL).toBe('LIST_CONTAINS_ALL');
      expect(CloudKitComparator.LIST_CONTAINS_ANY).toBe('LIST_CONTAINS_ANY');
      expect(CloudKitComparator.LIST_NOT_CONTAINS_ALL).toBe('LIST_NOT_CONTAINS_ALL');
      expect(CloudKitComparator.LIST_NOT_CONTAINS_ANY).toBe('LIST_NOT_CONTAINS_ANY');
      expect(CloudKitComparator.STARTS_WITH).toBe('STARTS_WITH');
      expect(CloudKitComparator.NOT_STARTS_WITH).toBe('NOT_STARTS_WITH');
      expect(CloudKitComparator.ENDS_WITH).toBe('ENDS_WITH');
      expect(CloudKitComparator.NOT_ENDS_WITH).toBe('NOT_ENDS_WITH');
      expect(CloudKitComparator.LIKE).toBe('LIKE');
      expect(CloudKitComparator.NOT_LIKE).toBe('NOT_LIKE');
      expect(CloudKitComparator.MATCHES).toBe('MATCHES');
      expect(CloudKitComparator.NOT_MATCHES).toBe('NOT_MATCHES');
    });
  });

  describe('isValidComparatorForField', () => {
    describe('string fields', () => {
      const stringValue = 'test string';

      it('should validate string comparators', () => {
        expect(isValidComparatorForField(CloudKitComparator.EQUALS, stringValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_EQUALS, stringValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.CONTAINS, stringValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_CONTAINS, stringValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.CONTAINS_ALL_TOKENS, stringValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.CONTAINS_ANY_TOKENS, stringValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_CONTAINS_ALL_TOKENS, stringValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_CONTAINS_ANY_TOKENS, stringValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.STARTS_WITH, stringValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_STARTS_WITH, stringValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.ENDS_WITH, stringValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_ENDS_WITH, stringValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.LIKE, stringValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_LIKE, stringValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.MATCHES, stringValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_MATCHES, stringValue)).toBe(true);
      });

      it('should reject non-string comparators', () => {
        expect(isValidComparatorForField(CloudKitComparator.LESS_THAN, stringValue)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.GREATER_THAN, stringValue)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.NEAR, stringValue)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.LIST_CONTAINS, stringValue)).toBe(false);
      });
    });

    describe('number fields', () => {
      const numberValue = 42;

      it('should validate number comparators', () => {
        expect(isValidComparatorForField(CloudKitComparator.EQUALS, numberValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_EQUALS, numberValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.LESS_THAN, numberValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.LESS_THAN_OR_EQUALS, numberValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.GREATER_THAN, numberValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.GREATER_THAN_OR_EQUALS, numberValue)).toBe(true);
      });

      it('should reject non-number comparators', () => {
        expect(isValidComparatorForField(CloudKitComparator.CONTAINS, numberValue)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.STARTS_WITH, numberValue)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.NEAR, numberValue)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.LIST_CONTAINS, numberValue)).toBe(false);
      });
    });

    describe('boolean fields', () => {
      const booleanValue = true;

      it('should validate boolean comparators', () => {
        expect(isValidComparatorForField(CloudKitComparator.EQUALS, booleanValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_EQUALS, booleanValue)).toBe(true);
      });

      it('should reject non-boolean comparators', () => {
        expect(isValidComparatorForField(CloudKitComparator.LESS_THAN, booleanValue)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.CONTAINS, booleanValue)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.NEAR, booleanValue)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.LIST_CONTAINS, booleanValue)).toBe(false);
      });
    });

    describe('location fields', () => {
      const locationValue = {
        latitude: 37.7749,
        longitude: -122.4194,
      };

      it('should validate location comparators', () => {
        expect(isValidComparatorForField(CloudKitComparator.EQUALS, locationValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_EQUALS, locationValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NEAR, locationValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_NEAR, locationValue)).toBe(true);
      });

      it('should reject non-location comparators', () => {
        expect(isValidComparatorForField(CloudKitComparator.LESS_THAN, locationValue)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.CONTAINS, locationValue)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.STARTS_WITH, locationValue)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.LIST_CONTAINS, locationValue)).toBe(false);
      });
    });

    describe('list fields', () => {
      const stringListValue = {
        strings: ['tag1', 'tag2', 'tag3'],
      };

      const referenceListValue = {
        references: [
          { recordName: 'note1', action: 'NONE' },
          { recordName: 'note2', action: 'NONE' },
        ],
      };

      const arrayValue = ['item1', 'item2', 'item3'];

      it('should validate list comparators for string lists', () => {
        expect(isValidComparatorForField(CloudKitComparator.EQUALS, stringListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_EQUALS, stringListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.IN, stringListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_IN, stringListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.CONTAINS_ALL, stringListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.CONTAINS_ANY, stringListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_CONTAINS_ALL, stringListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_CONTAINS_ANY, stringListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.LIST_CONTAINS, stringListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.LIST_NOT_CONTAINS, stringListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.LIST_CONTAINS_ALL, stringListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.LIST_CONTAINS_ANY, stringListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.LIST_NOT_CONTAINS_ALL, stringListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.LIST_NOT_CONTAINS_ANY, stringListValue)).toBe(true);
      });

      it('should validate list comparators for reference lists', () => {
        expect(isValidComparatorForField(CloudKitComparator.EQUALS, referenceListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_EQUALS, referenceListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.LIST_CONTAINS, referenceListValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.LIST_NOT_CONTAINS, referenceListValue)).toBe(true);
      });

      it('should validate list comparators for arrays', () => {
        expect(isValidComparatorForField(CloudKitComparator.EQUALS, arrayValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_EQUALS, arrayValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.IN, arrayValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.NOT_IN, arrayValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.LIST_CONTAINS, arrayValue)).toBe(true);
        expect(isValidComparatorForField(CloudKitComparator.LIST_NOT_CONTAINS, arrayValue)).toBe(true);
      });

      it('should reject non-list comparators', () => {
        expect(isValidComparatorForField(CloudKitComparator.LESS_THAN, stringListValue)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.CONTAINS, stringListValue)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.STARTS_WITH, stringListValue)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.NEAR, stringListValue)).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should handle null and undefined values', () => {
        expect(isValidComparatorForField(CloudKitComparator.EQUALS, null)).toBe(false);
        expect(isValidComparatorForField(CloudKitComparator.EQUALS, undefined)).toBe(false);
      });

      it('should handle empty objects', () => {
        expect(isValidComparatorForField(CloudKitComparator.EQUALS, {})).toBe(false);
      });

      it('should handle objects with wrong structure', () => {
        const invalidLocation = { lat: 37.7749, lng: -122.4194 };
        expect(isValidComparatorForField(CloudKitComparator.NEAR, invalidLocation)).toBe(false);
      });

      it('should handle mixed-type objects', () => {
        const mixedObject = {
          latitude: 37.7749,
          longitude: -122.4194,
          name: 'San Francisco',
        };
        expect(isValidComparatorForField(CloudKitComparator.NEAR, mixedObject)).toBe(false);
      });
    });
  });
});
