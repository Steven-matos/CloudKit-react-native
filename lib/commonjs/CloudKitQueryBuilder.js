"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudKitQueryBuilder = void 0;
exports.createQuery = createQuery;
exports.simpleQuery = simpleQuery;
var _CloudKitComparator = require("./CloudKitComparator");
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * CloudKit Query Builder - Fluent API for building CloudKit queries
 * Implements Builder pattern for complex query construction
 */
/**
 * Query builder class for constructing CloudKit queries
 * Follows Builder pattern and DRY principle
 */
class CloudKitQueryBuilder {
  constructor(recordType) {
    _defineProperty(this, "query", void 0);
    this.query = {
      recordType,
      filterBy: [],
      sortBy: [],
      resultsLimit: undefined,
      desiredKeys: undefined
    };
  }

  /**
   * Add a filter to the query
   * @param fieldName - Name of the field to filter on
   * @param comparator - Comparison operator
   * @param fieldValue - Value to compare against
   * @returns This builder instance for method chaining
   */
  filter(fieldName, comparator, fieldValue) {
    if (!this.query.filterBy) {
      this.query.filterBy = [];
    }
    this.query.filterBy.push({
      fieldName,
      comparator,
      fieldValue
    });
    return this;
  }

  /**
   * Add an equals filter (convenience method)
   * @param fieldName - Name of the field
   * @param value - Value to match
   * @returns This builder instance for method chaining
   */
  equals(fieldName, value) {
    return this.filter(fieldName, _CloudKitComparator.CloudKitComparator.EQUALS, value);
  }

  /**
   * Add a not equals filter (convenience method)
   * @param fieldName - Name of the field
   * @param value - Value to not match
   * @returns This builder instance for method chaining
   */
  notEquals(fieldName, value) {
    return this.filter(fieldName, _CloudKitComparator.CloudKitComparator.NOT_EQUALS, value);
  }

  /**
   * Add a greater than filter (convenience method)
   * @param fieldName - Name of the field
   * @param value - Value to be greater than
   * @returns This builder instance for method chaining
   */
  greaterThan(fieldName, value) {
    return this.filter(fieldName, _CloudKitComparator.CloudKitComparator.GREATER_THAN, value);
  }

  /**
   * Add a less than filter (convenience method)
   * @param fieldName - Name of the field
   * @param value - Value to be less than
   * @returns This builder instance for method chaining
   */
  lessThan(fieldName, value) {
    return this.filter(fieldName, _CloudKitComparator.CloudKitComparator.LESS_THAN, value);
  }

  /**
   * Add a contains filter (convenience method)
   * @param fieldName - Name of the field
   * @param value - Value to contain
   * @returns This builder instance for method chaining
   */
  contains(fieldName, value) {
    return this.filter(fieldName, _CloudKitComparator.CloudKitComparator.CONTAINS, value);
  }

  /**
   * Add a starts with filter (convenience method)
   * @param fieldName - Name of the field
   * @param value - Value to start with
   * @returns This builder instance for method chaining
   */
  startsWith(fieldName, value) {
    return this.filter(fieldName, _CloudKitComparator.CloudKitComparator.STARTS_WITH, value);
  }

  /**
   * Add a near location filter (convenience method)
   * @param fieldName - Name of the field
   * @param latitude - Latitude coordinate
   * @param longitude - Longitude coordinate
   * @returns This builder instance for method chaining
   */
  near(fieldName, latitude, longitude) {
    return this.filter(fieldName, _CloudKitComparator.CloudKitComparator.NEAR, {
      latitude,
      longitude
    });
  }

  /**
   * Add a sort order to the query
   * @param fieldName - Name of the field to sort by
   * @param ascending - Sort direction (true for ascending, false for descending)
   * @returns This builder instance for method chaining
   */
  sortBy(fieldName, ascending = true) {
    if (!this.query.sortBy) {
      this.query.sortBy = [];
    }
    this.query.sortBy.push({
      fieldName,
      ascending
    });
    return this;
  }

  /**
   * Add ascending sort (convenience method)
   * @param fieldName - Name of the field to sort by
   * @returns This builder instance for method chaining
   */
  sortAscending(fieldName) {
    return this.sortBy(fieldName, true);
  }

  /**
   * Add descending sort (convenience method)
   * @param fieldName - Name of the field to sort by
   * @returns This builder instance for method chaining
   */
  sortDescending(fieldName) {
    return this.sortBy(fieldName, false);
  }

  /**
   * Set the maximum number of results to return
   * @param limit - Maximum number of results
   * @returns This builder instance for method chaining
   */
  limit(limit) {
    this.query.resultsLimit = limit;
    return this;
  }

  /**
   * Set the desired fields to return
   * @param keys - Array of field names to include in results
   * @returns This builder instance for method chaining
   */
  select(keys) {
    this.query.desiredKeys = keys;
    return this;
  }

  /**
   * Build and return the final query object
   * @returns Complete CloudKit query object
   */
  build() {
    return {
      ...this.query
    };
  }
}

/**
 * Static factory method for creating a new query builder
 * @param recordType - Type of records to query
 * @returns New CloudKitQueryBuilder instance
 */
exports.CloudKitQueryBuilder = CloudKitQueryBuilder;
function createQuery(recordType) {
  return new CloudKitQueryBuilder(recordType);
}

/**
 * Convenience function for creating simple queries
 * @param recordType - Type of records to query
 * @param fieldName - Field to filter on
 * @param value - Value to match
 * @returns Complete CloudKit query object
 */
function simpleQuery(recordType, fieldName, value) {
  return createQuery(recordType).equals(fieldName, value).build();
}
//# sourceMappingURL=CloudKitQueryBuilder.js.map