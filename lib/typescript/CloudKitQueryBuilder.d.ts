/**
 * CloudKit Query Builder - Fluent API for building CloudKit queries
 * Implements Builder pattern for complex query construction
 */

import {
  CloudKitQuery,
  CloudKitFilter,
  CloudKitSort,
  CloudKitFieldValue,
} from './types';
import { CloudKitComparator } from './CloudKitComparator';

/**
 * Query builder class for constructing CloudKit queries
 * Follows Builder pattern and DRY principle
 */
export declare class CloudKitQueryBuilder {
  constructor(recordType: string);

  /**
   * Add a filter to the query
   * @param fieldName - Name of the field to filter on
   * @param comparator - Comparison operator
   * @param fieldValue - Value to compare against
   * @returns This builder instance for method chaining
   */
  filter(
    fieldName: string,
    comparator: CloudKitComparator,
    fieldValue: CloudKitFieldValue
  ): CloudKitQueryBuilder;

  /**
   * Add an equals filter (convenience method)
   * @param fieldName - Name of the field
   * @param value - Value to match
   * @returns This builder instance for method chaining
   */
  equals(fieldName: string, value: CloudKitFieldValue): CloudKitQueryBuilder;

  /**
   * Add a not equals filter (convenience method)
   * @param fieldName - Name of the field
   * @param value - Value to not match
   * @returns This builder instance for method chaining
   */
  notEquals(fieldName: string, value: CloudKitFieldValue): CloudKitQueryBuilder;

  /**
   * Add a greater than filter (convenience method)
   * @param fieldName - Name of the field
   * @param value - Value to be greater than
   * @returns This builder instance for method chaining
   */
  greaterThan(fieldName: string, value: CloudKitFieldValue): CloudKitQueryBuilder;

  /**
   * Add a less than filter (convenience method)
   * @param fieldName - Name of the field
   * @param value - Value to be less than
   * @returns This builder instance for method chaining
   */
  lessThan(fieldName: string, value: CloudKitFieldValue): CloudKitQueryBuilder;

  /**
   * Add a contains filter (convenience method)
   * @param fieldName - Name of the field
   * @param value - Value to contain
   * @returns This builder instance for method chaining
   */
  contains(fieldName: string, value: string): CloudKitQueryBuilder;

  /**
   * Add a starts with filter (convenience method)
   * @param fieldName - Name of the field
   * @param value - Value to start with
   * @returns This builder instance for method chaining
   */
  startsWith(fieldName: string, value: string): CloudKitQueryBuilder;

  /**
   * Add a near location filter (convenience method)
   * @param fieldName - Name of the field
   * @param latitude - Latitude coordinate
   * @param longitude - Longitude coordinate
   * @returns This builder instance for method chaining
   */
  near(fieldName: string, latitude: number, longitude: number): CloudKitQueryBuilder;

  /**
   * Add a sort order to the query
   * @param fieldName - Name of the field to sort by
   * @param ascending - Sort direction (true for ascending, false for descending)
   * @returns This builder instance for method chaining
   */
  sortBy(fieldName: string, ascending?: boolean): CloudKitQueryBuilder;

  /**
   * Add ascending sort (convenience method)
   * @param fieldName - Name of the field to sort by
   * @returns This builder instance for method chaining
   */
  sortAscending(fieldName: string): CloudKitQueryBuilder;

  /**
   * Add descending sort (convenience method)
   * @param fieldName - Name of the field to sort by
   * @returns This builder instance for method chaining
   */
  sortDescending(fieldName: string): CloudKitQueryBuilder;

  /**
   * Set the maximum number of results to return
   * @param limit - Maximum number of results
   * @returns This builder instance for method chaining
   */
  limit(limit: number): CloudKitQueryBuilder;

  /**
   * Set the desired fields to return
   * @param keys - Array of field names to include in results
   * @returns This builder instance for method chaining
   */
  select(keys: string[]): CloudKitQueryBuilder;

  /**
   * Build and return the final query object
   * @returns Complete CloudKit query object
   */
  build(): CloudKitQuery;
}

/**
 * Static factory method for creating a new query builder
 * @param recordType - Type of records to query
 * @returns New CloudKitQueryBuilder instance
 */
export declare function createQuery(recordType: string): CloudKitQueryBuilder;

/**
 * Convenience function for creating simple queries
 * @param recordType - Type of records to query
 * @param fieldName - Field to filter on
 * @param value - Value to match
 * @returns Complete CloudKit query object
 */
export declare function simpleQuery(
  recordType: string,
  fieldName: string,
  value: CloudKitFieldValue
): CloudKitQuery;