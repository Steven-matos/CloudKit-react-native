"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudKitComparator = void 0;
exports.isValidComparatorForField = isValidComparatorForField;
/**
 * CloudKit Query Comparators
 * Enumeration of all available CloudKit query comparators following CloudKitJS standards
 */
let CloudKitComparator = exports.CloudKitComparator = /*#__PURE__*/function (CloudKitComparator) {
  CloudKitComparator["EQUALS"] = "EQUALS";
  CloudKitComparator["NOT_EQUALS"] = "NOT_EQUALS";
  CloudKitComparator["LESS_THAN"] = "LESS_THAN";
  CloudKitComparator["LESS_THAN_OR_EQUALS"] = "LESS_THAN_OR_EQUALS";
  CloudKitComparator["GREATER_THAN"] = "GREATER_THAN";
  CloudKitComparator["GREATER_THAN_OR_EQUALS"] = "GREATER_THAN_OR_EQUALS";
  CloudKitComparator["NEAR"] = "NEAR";
  CloudKitComparator["NOT_NEAR"] = "NOT_NEAR";
  CloudKitComparator["CONTAINS"] = "CONTAINS";
  CloudKitComparator["NOT_CONTAINS"] = "NOT_CONTAINS";
  CloudKitComparator["CONTAINS_ALL_TOKENS"] = "CONTAINS_ALL_TOKENS";
  CloudKitComparator["CONTAINS_ANY_TOKENS"] = "CONTAINS_ANY_TOKENS";
  CloudKitComparator["NOT_CONTAINS_ALL_TOKENS"] = "NOT_CONTAINS_ALL_TOKENS";
  CloudKitComparator["NOT_CONTAINS_ANY_TOKENS"] = "NOT_CONTAINS_ANY_TOKENS";
  CloudKitComparator["IN"] = "IN";
  CloudKitComparator["NOT_IN"] = "NOT_IN";
  CloudKitComparator["CONTAINS_ALL"] = "CONTAINS_ALL";
  CloudKitComparator["CONTAINS_ANY"] = "CONTAINS_ANY";
  CloudKitComparator["NOT_CONTAINS_ALL"] = "NOT_CONTAINS_ALL";
  CloudKitComparator["NOT_CONTAINS_ANY"] = "NOT_CONTAINS_ANY";
  CloudKitComparator["LIST_CONTAINS"] = "LIST_CONTAINS";
  CloudKitComparator["LIST_NOT_CONTAINS"] = "LIST_NOT_CONTAINS";
  CloudKitComparator["LIST_CONTAINS_ALL"] = "LIST_CONTAINS_ALL";
  CloudKitComparator["LIST_CONTAINS_ANY"] = "LIST_CONTAINS_ANY";
  CloudKitComparator["LIST_NOT_CONTAINS_ALL"] = "LIST_NOT_CONTAINS_ALL";
  CloudKitComparator["LIST_NOT_CONTAINS_ANY"] = "LIST_NOT_CONTAINS_ANY";
  CloudKitComparator["STARTS_WITH"] = "STARTS_WITH";
  CloudKitComparator["NOT_STARTS_WITH"] = "NOT_STARTS_WITH";
  CloudKitComparator["ENDS_WITH"] = "ENDS_WITH";
  CloudKitComparator["NOT_ENDS_WITH"] = "NOT_ENDS_WITH";
  CloudKitComparator["LIKE"] = "LIKE";
  CloudKitComparator["NOT_LIKE"] = "NOT_LIKE";
  CloudKitComparator["MATCHES"] = "MATCHES";
  CloudKitComparator["NOT_MATCHES"] = "NOT_MATCHES";
  return CloudKitComparator;
}({});
/**
 * Helper function to validate comparator usage with field types
 * @param comparator - The comparator to validate
 * @param fieldValue - The field value to check compatibility with
 * @returns true if the comparator is valid for the field type
 */
function isValidComparatorForField(comparator, fieldValue) {
  const stringComparators = [CloudKitComparator.EQUALS, CloudKitComparator.NOT_EQUALS, CloudKitComparator.CONTAINS, CloudKitComparator.NOT_CONTAINS, CloudKitComparator.CONTAINS_ALL_TOKENS, CloudKitComparator.CONTAINS_ANY_TOKENS, CloudKitComparator.NOT_CONTAINS_ALL_TOKENS, CloudKitComparator.NOT_CONTAINS_ANY_TOKENS, CloudKitComparator.STARTS_WITH, CloudKitComparator.NOT_STARTS_WITH, CloudKitComparator.ENDS_WITH, CloudKitComparator.NOT_ENDS_WITH, CloudKitComparator.LIKE, CloudKitComparator.NOT_LIKE, CloudKitComparator.MATCHES, CloudKitComparator.NOT_MATCHES];
  const numberComparators = [CloudKitComparator.EQUALS, CloudKitComparator.NOT_EQUALS, CloudKitComparator.LESS_THAN, CloudKitComparator.LESS_THAN_OR_EQUALS, CloudKitComparator.GREATER_THAN, CloudKitComparator.GREATER_THAN_OR_EQUALS];
  const locationComparators = [CloudKitComparator.EQUALS, CloudKitComparator.NOT_EQUALS, CloudKitComparator.NEAR, CloudKitComparator.NOT_NEAR];
  const listComparators = [CloudKitComparator.EQUALS, CloudKitComparator.NOT_EQUALS, CloudKitComparator.IN, CloudKitComparator.NOT_IN, CloudKitComparator.CONTAINS_ALL, CloudKitComparator.CONTAINS_ANY, CloudKitComparator.NOT_CONTAINS_ALL, CloudKitComparator.NOT_CONTAINS_ANY, CloudKitComparator.LIST_CONTAINS, CloudKitComparator.LIST_NOT_CONTAINS, CloudKitComparator.LIST_CONTAINS_ALL, CloudKitComparator.LIST_CONTAINS_ANY, CloudKitComparator.LIST_NOT_CONTAINS_ALL, CloudKitComparator.LIST_NOT_CONTAINS_ANY];
  const booleanComparators = [CloudKitComparator.EQUALS, CloudKitComparator.NOT_EQUALS];

  // Determine field type
  if (typeof fieldValue === 'string') {
    return stringComparators.includes(comparator);
  }
  if (typeof fieldValue === 'number') {
    return numberComparators.includes(comparator);
  }
  if (typeof fieldValue === 'boolean') {
    return booleanComparators.includes(comparator);
  }
  if (fieldValue && typeof fieldValue === 'object') {
    if ('latitude' in fieldValue && 'longitude' in fieldValue) {
      return locationComparators.includes(comparator);
    }
    if (Array.isArray(fieldValue) || fieldValue.strings || fieldValue.references) {
      return listComparators.includes(comparator);
    }
  }
  return false;
}
//# sourceMappingURL=CloudKitComparator.js.map