/**
 * CloudKit Query Comparators
 * Enumeration of all available CloudKit query comparators following CloudKitJS standards
 */

export declare enum CloudKitComparator {
  EQUALS = "EQUALS",
  NOT_EQUALS = "NOT_EQUALS",
  LESS_THAN = "LESS_THAN",
  LESS_THAN_OR_EQUALS = "LESS_THAN_OR_EQUALS",
  GREATER_THAN = "GREATER_THAN",
  GREATER_THAN_OR_EQUALS = "GREATER_THAN_OR_EQUALS",
  NEAR = "NEAR",
  NOT_NEAR = "NOT_NEAR",
  CONTAINS = "CONTAINS",
  NOT_CONTAINS = "NOT_CONTAINS",
  CONTAINS_ALL_TOKENS = "CONTAINS_ALL_TOKENS",
  CONTAINS_ANY_TOKENS = "CONTAINS_ANY_TOKENS",
  NOT_CONTAINS_ALL_TOKENS = "NOT_CONTAINS_ALL_TOKENS",
  NOT_CONTAINS_ANY_TOKENS = "NOT_CONTAINS_ANY_TOKENS",
  IN = "IN",
  NOT_IN = "NOT_IN",
  CONTAINS_ALL = "CONTAINS_ALL",
  CONTAINS_ANY = "CONTAINS_ANY",
  NOT_CONTAINS_ALL = "NOT_CONTAINS_ALL",
  NOT_CONTAINS_ANY = "NOT_CONTAINS_ANY",
  LIST_CONTAINS = "LIST_CONTAINS",
  LIST_NOT_CONTAINS = "LIST_NOT_CONTAINS",
  LIST_CONTAINS_ALL = "LIST_CONTAINS_ALL",
  LIST_CONTAINS_ANY = "LIST_CONTAINS_ANY",
  LIST_NOT_CONTAINS_ALL = "LIST_NOT_CONTAINS_ALL",
  LIST_NOT_CONTAINS_ANY = "LIST_NOT_CONTAINS_ANY",
  STARTS_WITH = "STARTS_WITH",
  NOT_STARTS_WITH = "NOT_STARTS_WITH",
  ENDS_WITH = "ENDS_WITH",
  NOT_ENDS_WITH = "NOT_ENDS_WITH",
  LIKE = "LIKE",
  NOT_LIKE = "NOT_LIKE",
  MATCHES = "MATCHES",
  NOT_MATCHES = "NOT_MATCHES",
}

/**
 * Helper function to validate comparator usage with field types
 * @param comparator - The comparator to validate
 * @param fieldValue - The field value to check compatibility with
 * @returns true if the comparator is valid for the field type
 */
export declare function isValidComparatorForField(
  comparator: CloudKitComparator,
  fieldValue: any
): boolean;