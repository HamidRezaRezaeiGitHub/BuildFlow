/**
 * Tests for newly added DTOs (Estimate, WorkItem, Quote)
 * These tests verify that all new DTOs can be imported and used correctly
 */

import {
  // Estimate types
  Estimate,
  EstimateGroup,
  EstimateLine,
  EstimateLineStrategy,
  // WorkItem types
  WorkItem,
  CreateWorkItemRequest,
  CreateWorkItemResponse,
  WorkItemDomain,
  // Quote types
  Quote,
  QuoteLocation,
  QuoteDomain,
  QuoteUnit,
  QuoteUnitDisplay,
  // Base types
  UpdatableEntityDto
} from './index';

describe('Estimate DTOs', () => {
  test('EstimateLine type should have correct structure', () => {
    const estimateLine: EstimateLine = {
      id: '1',
      workItemId: '101',
      quantity: 50,
      estimateStrategy: EstimateLineStrategy.AVERAGE,
      multiplier: 1.0,
      computedCost: '5000.00',
      createdAt: '2024-01-15T10:00:00Z',
      lastUpdatedAt: '2024-01-15T10:00:00Z'
    };

    expect(estimateLine.id).toBe('1');
    expect(estimateLine.workItemId).toBe('101');
    expect(estimateLine.quantity).toBe(50);
    expect(estimateLine.estimateStrategy).toBe(EstimateLineStrategy.AVERAGE);
  });

  test('EstimateGroup type should have correct structure', () => {
    const estimateGroup: EstimateGroup = {
      id: '2',
      workItemId: '102',
      name: 'Foundation',
      description: 'Foundation work items',
      estimateLines: []
    };

    expect(estimateGroup.id).toBe('2');
    expect(estimateGroup.name).toBe('Foundation');
    expect(Array.isArray(estimateGroup.estimateLines)).toBe(true);
  });

  test('Estimate type should have correct structure', () => {
    const estimate: Estimate = {
      id: '3',
      projectId: '456',
      overallMultiplier: 1.15,
      groups: [],
      createdAt: '2024-01-15T10:00:00Z',
      lastUpdatedAt: '2024-01-15T10:00:00Z'
    };

    expect(estimate.id).toBe('3');
    expect(estimate.projectId).toBe('456');
    expect(estimate.overallMultiplier).toBe(1.15);
  });

  test('EstimateLineStrategy enum should have correct values', () => {
    expect(EstimateLineStrategy.AVERAGE).toBe('AVERAGE');
    expect(EstimateLineStrategy.LATEST).toBe('LATEST');
    expect(EstimateLineStrategy.LOWEST).toBe('LOWEST');
  });
});

describe('WorkItem DTOs', () => {
  test('WorkItem type should have correct structure', () => {
    const workItem: WorkItem = {
      id: '4',
      code: 'S1-001',
      name: 'Foundation Preparation',
      description: 'Prepare the foundation area',
      optional: false,
      userId: '123',
      defaultGroupName: 'Site Preparation',
      domain: WorkItemDomain.PUBLIC,
      createdAt: '2024-01-15T10:00:00Z',
      lastUpdatedAt: '2024-01-15T10:00:00Z'
    };

    expect(workItem.id).toBe('4');
    expect(workItem.code).toBe('S1-001');
    expect(workItem.name).toBe('Foundation Preparation');
    expect(workItem.optional).toBe(false);
  });

  test('CreateWorkItemRequest type should have correct structure', () => {
    const request: CreateWorkItemRequest = {
      code: 'S1-002',
      name: 'Excavation',
      description: 'Excavate the site',
      optional: false,
      userId: '123',
      defaultGroupName: 'Site Work',
      domain: WorkItemDomain.PRIVATE
    };

    expect(request.code).toBe('S1-002');
    expect(request.name).toBe('Excavation');
    expect(request.userId).toBe('123');
  });

  test('CreateWorkItemResponse type should have correct structure', () => {
    const workItem: WorkItem = {
      id: '5',
      code: 'S1-003',
      name: 'Test Item',
      optional: false,
      userId: '123',
      domain: WorkItemDomain.PUBLIC,
      createdAt: '2024-01-15T10:00:00Z',
      lastUpdatedAt: '2024-01-15T10:00:00Z'
    };

    const response: CreateWorkItemResponse = {
      workItem: workItem
    };

    expect(response.workItem.id).toBe('5');
    expect(response.workItem.code).toBe('S1-003');
  });

  test('WorkItemDomain enum should have correct values', () => {
    expect(WorkItemDomain.PUBLIC).toBe('PUBLIC');
    expect(WorkItemDomain.PRIVATE).toBe('PRIVATE');
  });
});

describe('Quote DTOs', () => {
  test('QuoteLocation type should have correct structure', () => {
    const location: QuoteLocation = {
      id: '6',
      streetNumberAndName: '123 Main St',
      city: 'Toronto',
      stateOrProvince: 'ON',
      postalOrZipCode: 'M5H 2N2',
      country: 'Canada'
    };

    expect(location.id).toBe('6');
    expect(location.city).toBe('Toronto');
    expect(location.stateOrProvince).toBe('ON');
  });

  test('Quote type should have correct structure', () => {
    const quote: Quote = {
      id: '7',
      workItemId: '456',
      createdByUserId: '789',
      supplierId: '101',
      quoteUnit: QuoteUnit.SQUARE_METER,
      unitPrice: '50.00',
      currency: 'CAD',
      quoteDomain: QuoteDomain.PUBLIC,
      location: {
        id: '8',
        streetNumberAndName: '456 Oak Ave',
        city: 'Vancouver',
        stateOrProvince: 'BC',
        country: 'Canada'
      },
      valid: true,
      createdAt: '2024-01-15T10:00:00Z',
      lastUpdatedAt: '2024-01-15T10:00:00Z'
    };

    expect(quote.id).toBe('7');
    expect(quote.workItemId).toBe('456');
    expect(quote.unitPrice).toBe('50.00');
    expect(quote.currency).toBe('CAD');
    expect(quote.valid).toBe(true);
  });

  test('QuoteDomain enum should have correct values', () => {
    expect(QuoteDomain.PUBLIC).toBe('PUBLIC');
    expect(QuoteDomain.PRIVATE).toBe('PRIVATE');
  });

  test('QuoteUnit enum should have correct values', () => {
    expect(QuoteUnit.SQUARE_METER).toBe('SQUARE_METER');
    expect(QuoteUnit.SQUARE_FOOT).toBe('SQUARE_FOOT');
    expect(QuoteUnit.CUBIC_METER).toBe('CUBIC_METER');
    expect(QuoteUnit.EACH).toBe('EACH');
    expect(QuoteUnit.HOUR).toBe('HOUR');
  });

  test('QuoteUnitDisplay should map enum values to display strings', () => {
    expect(QuoteUnitDisplay[QuoteUnit.SQUARE_METER]).toBe('m²');
    expect(QuoteUnitDisplay[QuoteUnit.SQUARE_FOOT]).toBe('ft²');
    expect(QuoteUnitDisplay[QuoteUnit.CUBIC_METER]).toBe('m³');
    expect(QuoteUnitDisplay[QuoteUnit.EACH]).toBe('each');
    expect(QuoteUnitDisplay[QuoteUnit.HOUR]).toBe('hr');
  });
});

describe('Base Types', () => {
  test('UpdatableEntityDto should have timestamp fields', () => {
    const entity: UpdatableEntityDto = {
      createdAt: '2024-01-15T10:00:00Z',
      lastUpdatedAt: '2024-01-15T10:00:00Z'
    };

    expect(entity.createdAt).toBe('2024-01-15T10:00:00Z');
    expect(entity.lastUpdatedAt).toBe('2024-01-15T10:00:00Z');
  });
});

describe('Integration Tests', () => {
  test('Estimate with nested groups and lines should work correctly', () => {
    const estimateLine: EstimateLine = {
      id: '1001',
      workItemId: '101',
      quantity: 50,
      estimateStrategy: EstimateLineStrategy.AVERAGE,
      multiplier: 1.0,
      computedCost: '5000.00',
      createdAt: '2024-01-15T10:00:00Z',
      lastUpdatedAt: '2024-01-15T10:00:00Z'
    };

    const estimateGroup: EstimateGroup = {
      id: '789',
      workItemId: '101',
      name: 'Foundation',
      description: 'Foundation work items',
      estimateLines: [estimateLine]
    };

    const estimate: Estimate = {
      id: '123',
      projectId: '456',
      overallMultiplier: 1.15,
      groups: [estimateGroup],
      createdAt: '2024-01-15T10:00:00Z',
      lastUpdatedAt: '2024-01-15T10:00:00Z'
    };

    expect(estimate.groups.length).toBe(1);
    expect(estimate.groups[0].estimateLines.length).toBe(1);
    expect(estimate.groups[0].estimateLines[0].computedCost).toBe('5000.00');
  });

  test('All DTO exports should be accessible from index', () => {
    // This test verifies that all DTOs are properly exported from index.ts
    expect(EstimateLineStrategy).toBeDefined();
    expect(WorkItemDomain).toBeDefined();
    expect(QuoteDomain).toBeDefined();
    expect(QuoteUnit).toBeDefined();
    expect(QuoteUnitDisplay).toBeDefined();
  });
});
