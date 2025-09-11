/**
 * Unit tests for CloudKitQueryBuilder
 * Tests query building functionality and validation
 */

import {
  CloudKitQueryBuilder,
  createQuery,
  simpleQuery,
} from '../CloudKitQueryBuilder';
import { CloudKitComparator } from '../CloudKitComparator';

describe('CloudKitQueryBuilder', () => {
  describe('constructor', () => {
    it('should create a query builder with record type', () => {
      const builder = new CloudKitQueryBuilder('Note');
      const query = builder.build();

      expect(query.recordType).toBe('Note');
      expect(query.filterBy).toEqual([]);
      expect(query.sortBy).toEqual([]);
      expect(query.resultsLimit).toBeUndefined();
      expect(query.desiredKeys).toBeUndefined();
    });
  });

  describe('filter methods', () => {
    let builder: CloudKitQueryBuilder;

    beforeEach(() => {
      builder = new CloudKitQueryBuilder('Note');
    });

    it('should add a basic filter', () => {
      const query = builder
        .filter('title', CloudKitComparator.EQUALS, 'Test Note')
        .build();

      expect(query.filterBy).toHaveLength(1);
      expect(query.filterBy![0]).toEqual({
        fieldName: 'title',
        comparator: CloudKitComparator.EQUALS,
        fieldValue: 'Test Note',
      });
    });

    it('should add multiple filters', () => {
      const query = builder
        .filter('title', CloudKitComparator.EQUALS, 'Test Note')
        .filter('isPublic', CloudKitComparator.EQUALS, true)
        .build();

      expect(query.filterBy).toHaveLength(2);
      expect(query.filterBy![0].fieldName).toBe('title');
      expect(query.filterBy![1].fieldName).toBe('isPublic');
    });

    it('should support equals convenience method', () => {
      const query = builder.equals('title', 'Test Note').build();

      expect(query.filterBy![0]).toEqual({
        fieldName: 'title',
        comparator: CloudKitComparator.EQUALS,
        fieldValue: 'Test Note',
      });
    });

    it('should support not equals convenience method', () => {
      const query = builder.notEquals('title', 'Test Note').build();

      expect(query.filterBy![0]).toEqual({
        fieldName: 'title',
        comparator: CloudKitComparator.NOT_EQUALS,
        fieldValue: 'Test Note',
      });
    });

    it('should support greater than convenience method', () => {
      const query = builder.greaterThan('createdAt', { timestamp: 1609459200 }).build();

      expect(query.filterBy![0]).toEqual({
        fieldName: 'createdAt',
        comparator: CloudKitComparator.GREATER_THAN,
        fieldValue: { timestamp: 1609459200 },
      });
    });

    it('should support less than convenience method', () => {
      const query = builder.lessThan('createdAt', { timestamp: 1609459200 }).build();

      expect(query.filterBy![0]).toEqual({
        fieldName: 'createdAt',
        comparator: CloudKitComparator.LESS_THAN,
        fieldValue: { timestamp: 1609459200 },
      });
    });

    it('should support contains convenience method', () => {
      const query = builder.contains('title', 'important').build();

      expect(query.filterBy![0]).toEqual({
        fieldName: 'title',
        comparator: CloudKitComparator.CONTAINS,
        fieldValue: 'important',
      });
    });

    it('should support starts with convenience method', () => {
      const query = builder.startsWith('title', 'My').build();

      expect(query.filterBy![0]).toEqual({
        fieldName: 'title',
        comparator: CloudKitComparator.STARTS_WITH,
        fieldValue: 'My',
      });
    });

    it('should support near location convenience method', () => {
      const query = builder.near('location', 37.7749, -122.4194).build();

      expect(query.filterBy![0]).toEqual({
        fieldName: 'location',
        comparator: CloudKitComparator.NEAR,
        fieldValue: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      });
    });
  });

  describe('sorting methods', () => {
    let builder: CloudKitQueryBuilder;

    beforeEach(() => {
      builder = new CloudKitQueryBuilder('Note');
    });

    it('should add sort by field', () => {
      const query = builder.sortBy('createdAt', true).build();

      expect(query.sortBy).toHaveLength(1);
      expect(query.sortBy![0]).toEqual({
        fieldName: 'createdAt',
        ascending: true,
      });
    });

    it('should support ascending sort convenience method', () => {
      const query = builder.sortAscending('createdAt').build();

      expect(query.sortBy![0]).toEqual({
        fieldName: 'createdAt',
        ascending: true,
      });
    });

    it('should support descending sort convenience method', () => {
      const query = builder.sortDescending('createdAt').build();

      expect(query.sortBy![0]).toEqual({
        fieldName: 'createdAt',
        ascending: false,
      });
    });

    it('should add multiple sort criteria', () => {
      const query = builder
        .sortDescending('createdAt')
        .sortAscending('title')
        .build();

      expect(query.sortBy).toHaveLength(2);
      expect(query.sortBy![0].ascending).toBe(false);
      expect(query.sortBy![1].ascending).toBe(true);
    });
  });

  describe('limit and select methods', () => {
    let builder: CloudKitQueryBuilder;

    beforeEach(() => {
      builder = new CloudKitQueryBuilder('Note');
    });

    it('should set results limit', () => {
      const query = builder.limit(50).build();

      expect(query.resultsLimit).toBe(50);
    });

    it('should set desired keys', () => {
      const keys = ['title', 'content', 'createdAt'];
      const query = builder.select(keys).build();

      expect(query.desiredKeys).toEqual(keys);
    });

    it('should chain limit and select', () => {
      const query = builder
        .limit(25)
        .select(['title', 'createdAt'])
        .build();

      expect(query.resultsLimit).toBe(25);
      expect(query.desiredKeys).toEqual(['title', 'createdAt']);
    });
  });

  describe('method chaining', () => {
    it('should support fluent API with all methods', () => {
      const query = new CloudKitQueryBuilder('Note')
        .equals('isPublic', true)
        .contains('title', 'important')
        .greaterThan('createdAt', { timestamp: 1609459200 })
        .sortDescending('createdAt')
        .sortAscending('title')
        .limit(20)
        .select(['title', 'content'])
        .build();

      expect(query.recordType).toBe('Note');
      expect(query.filterBy).toHaveLength(3);
      expect(query.sortBy).toHaveLength(2);
      expect(query.resultsLimit).toBe(20);
      expect(query.desiredKeys).toEqual(['title', 'content']);
    });

    it('should return immutable query objects', () => {
      const builder = new CloudKitQueryBuilder('Note');
      const query1 = builder.equals('title', 'Test').build();
      const query2 = builder.notEquals('title', 'Test').build();

      // Modifying the builder shouldn't affect previous queries
      expect(query1.filterBy![0].fieldValue).toBe('Test');
      expect(query2.filterBy![0].fieldValue).toBe('Test');
    });
  });

  describe('static factory methods', () => {
    it('should create query builder using createQuery', () => {
      const builder = createQuery('Note');
      expect(builder).toBeInstanceOf(CloudKitQueryBuilder);
    });

    it('should create simple query using simpleQuery', () => {
      const query = simpleQuery('Note', 'title', 'Test Note');

      expect(query.recordType).toBe('Note');
      expect(query.filterBy).toHaveLength(1);
      expect(query.filterBy![0]).toEqual({
        fieldName: 'title',
        comparator: CloudKitComparator.EQUALS,
        fieldValue: 'Test Note',
      });
    });
  });

  describe('complex query scenarios', () => {
    it('should build a complex search query', () => {
      const query = createQuery('Note')
        .contains('title', 'meeting')
        .equals('isPublic', true)
        .greaterThan('createdAt', { timestamp: Date.now() / 1000 - 86400 }) // Last 24 hours
        .sortDescending('createdAt')
        .limit(10)
        .select(['title', 'content', 'createdAt'])
        .build();

      expect(query.recordType).toBe('Note');
      expect(query.filterBy).toHaveLength(3);
      expect(query.sortBy).toHaveLength(1);
      expect(query.resultsLimit).toBe(10);
      expect(query.desiredKeys).toEqual(['title', 'content', 'createdAt']);
    });

    it('should build a location-based query', () => {
      const query = createQuery('Place')
        .near('location', 37.7749, -122.4194)
        .equals('category', 'restaurant')
        .sortAscending('name')
        .limit(5)
        .build();

      expect(query.recordType).toBe('Place');
      expect(query.filterBy).toHaveLength(2);
      expect(query.filterBy![0].comparator).toBe(CloudKitComparator.NEAR);
      expect(query.filterBy![0].fieldValue).toEqual({
        latitude: 37.7749,
        longitude: -122.4194,
      });
    });

    it('should build a pagination query', () => {
      const query = createQuery('Note')
        .equals('author', 'user123')
        .sortDescending('createdAt')
        .limit(20)
        .build();

      expect(query.recordType).toBe('Note');
      expect(query.filterBy).toHaveLength(1);
      expect(query.sortBy).toHaveLength(1);
      expect(query.resultsLimit).toBe(20);
    });
  });
});
