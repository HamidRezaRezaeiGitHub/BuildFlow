/**
 * Tests for general utility functions
 * 
 * Tests the cn utility function for combining class names
 */

import { cn } from '@/lib/utils';

describe('cn', () => {
  test('cn_shouldCombineClasses_whenMultipleClassesProvided', () => {
    const result = cn('class1', 'class2', 'class3');
    
    expect(result).toBe('class1 class2 class3');
  });

  test('cn_shouldHandleConditionalClasses_whenConditionsProvided', () => {
    const result = cn(
      'base-class',
      true && 'conditional-true',
      false && 'conditional-false',
      'always-included'
    );
    
    expect(result).toContain('base-class');
    expect(result).toContain('conditional-true');
    expect(result).toContain('always-included');
    expect(result).not.toContain('conditional-false');
  });

  test('cn_shouldMergeTailwindClasses_whenConflictingClasses', () => {
    const result = cn('px-4', 'px-6'); // px-6 should override px-4
    
    expect(result).toContain('px-6');
    expect(result).not.toContain('px-4');
  });

  test('cn_shouldHandleEmptyString_whenEmptyProvided', () => {
    const result = cn('', 'class1', '', 'class2');
    
    expect(result).toBe('class1 class2');
  });

  test('cn_shouldHandleUndefinedAndNull_whenFalsyValuesProvided', () => {
    const result = cn('class1', undefined, null, 'class2');
    
    expect(result).toBe('class1 class2');
  });

  test('cn_shouldHandleObjectFormat_whenObjectProvided', () => {
    const result = cn({
      'class1': true,
      'class2': false,
      'class3': true
    });
    
    expect(result).toContain('class1');
    expect(result).toContain('class3');
    expect(result).not.toContain('class2');
  });

  test('cn_shouldHandleArrayFormat_whenArrayProvided', () => {
    const result = cn(['class1', 'class2'], 'class3');
    
    expect(result).toContain('class1');
    expect(result).toContain('class2');
    expect(result).toContain('class3');
  });

  test('cn_shouldHandleMixedFormats_whenDifferentFormatsProvided', () => {
    const result = cn(
      'base',
      ['array1', 'array2'],
      { 'object1': true, 'object2': false },
      true && 'conditional',
      'string'
    );
    
    expect(result).toContain('base');
    expect(result).toContain('array1');
    expect(result).toContain('array2');
    expect(result).toContain('object1');
    expect(result).toContain('conditional');
    expect(result).toContain('string');
    expect(result).not.toContain('object2');
  });

  test('cn_shouldHandleTailwindVariants_whenVariantClassesProvided', () => {
    // Test some common Tailwind class conflicts
    const result = cn(
      'bg-blue-500',
      'hover:bg-blue-600',
      'bg-red-500' // This should override bg-blue-500
    );
    
    expect(result).toContain('bg-red-500');
    expect(result).toContain('hover:bg-blue-600');
    expect(result).not.toContain('bg-blue-500');
  });

  test('cn_shouldReturnEmptyString_whenNoValidClassesProvided', () => {
    const result = cn('', null, undefined, false);
    
    expect(result).toBe('');
  });
});