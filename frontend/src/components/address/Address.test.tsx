import { AddressData } from '@/services/dtos';
import {
  TORONTO_DEFAULT_ADDRESS,
  createEmptyAddress,
  createTorontoDefaultAddress,
  formatAddress,
  getAddressCompletionPercentage,
  isAddressComplete,
  isAddressEmpty,
  validateStreetNumber,
} from './Address';

describe('createEmptyAddress', () => {
  test('createEmptyAddress_shouldReturnEmptyObject_whenCalled', () => {
    const address = createEmptyAddress();

    expect(address.unitNumber).toBe('');
    expect(address.streetNumber).toBe('');
    expect(address.streetName).toBe('');
    expect(address.city).toBe('');
    expect(address.stateOrProvince).toBe('');
    expect(address.postalOrZipCode).toBe('');
    expect(address.country).toBe('');
  });
});

describe('createTorontoDefaultAddress', () => {
  test('createTorontoDefaultAddress_shouldReturnTorontoDefaults_whenCalled', () => {
    const address = createTorontoDefaultAddress();

    expect(address.streetNumber).toBe('100');
    expect(address.streetName).toBe('Queen Street West');
    expect(address.city).toBe('Toronto');
    expect(address.stateOrProvince).toBe('ON');
    expect(address.postalOrZipCode).toBe('M5H 2N2');
    expect(address.country).toBe('Canada');
    expect(address.unitNumber).toBe('');
  });

  test('createTorontoDefaultAddress_shouldMatchConstant_whenCalled', () => {
    const address = createTorontoDefaultAddress();

    expect(address).toEqual(TORONTO_DEFAULT_ADDRESS);
  });
});

describe('formatAddress', () => {
  test('formatAddress_shouldReturnFullAddress_whenAllFieldsProvided', () => {
    const address: AddressData = {
      unitNumber: '101',
      streetNumber: '123',
      streetName: 'Main Street',
      city: 'Toronto',
      stateOrProvince: 'ON',
      postalOrZipCode: 'M5H 2N2',
      country: 'Canada'
    };

    const formatted = formatAddress(address);

    expect(formatted).toBe('Unit 101, 123 Main Street, Toronto, ON, M5H 2N2, Canada');
  });

  test('formatAddress_shouldSkipEmptyFields_whenSomeFieldsEmpty', () => {
    const address: AddressData = {
      unitNumber: '',
      streetNumber: '123',
      streetName: 'Main Street',
      city: 'Toronto',
      stateOrProvince: '',
      postalOrZipCode: 'M5H 2N2',
      country: 'Canada'
    };

    const formatted = formatAddress(address);

    expect(formatted).toBe('123 Main Street, Toronto, M5H 2N2, Canada');
  });

  test('formatAddress_shouldReturnEmpty_whenAllFieldsEmpty', () => {
    const address = createEmptyAddress();

    const formatted = formatAddress(address);

    expect(formatted).toBe('');
  });

  test('formatAddress_shouldHandleUnitNumber_whenProvided', () => {
    const address: AddressData = {
      unitNumber: '5A',
      streetNumber: '100',
      streetName: 'Queen St',
      city: 'Toronto',
      stateOrProvince: 'ON',
      postalOrZipCode: 'M5H 2N2',
      country: 'Canada'
    };

    const formatted = formatAddress(address);

    expect(formatted).toContain('Unit 5A');
  });

  test('formatAddress_shouldHandleStreetOnly_whenOnlyStreetNameProvided', () => {
    const address: AddressData = {
      unitNumber: '',
      streetNumber: '',
      streetName: 'Main Street',
      city: 'Toronto',
      stateOrProvince: 'ON',
      postalOrZipCode: 'M5H 2N2',
      country: 'Canada'
    };

    const formatted = formatAddress(address);

    expect(formatted).toBe('Main Street, Toronto, ON, M5H 2N2, Canada');
  });
});

describe('isAddressEmpty', () => {
  test('isAddressEmpty_shouldReturnTrue_whenAllFieldsEmpty', () => {
    const address = createEmptyAddress();

    const result = isAddressEmpty(address);

    expect(result).toBe(true);
  });

  test('isAddressEmpty_shouldReturnFalse_whenAnyFieldFilled', () => {
    const address: AddressData = {
      ...createEmptyAddress(),
      city: 'Toronto'
    };

    const result = isAddressEmpty(address);

    expect(result).toBe(false);
  });

  test('isAddressEmpty_shouldReturnTrue_whenFieldsContainOnlyWhitespace', () => {
    const address: AddressData = {
      unitNumber: '  ',
      streetNumber: '\t',
      streetName: '\n',
      city: ' ',
      stateOrProvince: '',
      postalOrZipCode: '   ',
      country: ''
    };

    const result = isAddressEmpty(address);

    expect(result).toBe(true);
  });
});

describe('isAddressComplete', () => {
  test('isAddressComplete_shouldReturnTrue_whenRequiredFieldsFilled', () => {
    const address: AddressData = {
      unitNumber: '', // Optional
      streetNumber: '123',
      streetName: 'Main Street',
      city: 'Toronto',
      stateOrProvince: 'ON',
      postalOrZipCode: '', // Optional according to the function
      country: 'Canada'
    };

    const result = isAddressComplete(address);

    expect(result).toBe(true);
  });

  test('isAddressComplete_shouldReturnFalse_whenRequiredFieldMissing', () => {
    const address: AddressData = {
      unitNumber: '',
      streetNumber: '',
      streetName: 'Main Street',
      city: 'Toronto',
      stateOrProvince: 'ON',
      postalOrZipCode: 'M5H 2N2',
      country: 'Canada'
    };

    const result = isAddressComplete(address);

    expect(result).toBe(false);
  });

  test('isAddressComplete_shouldReturnFalse_whenCityMissing', () => {
    const address: AddressData = {
      unitNumber: '',
      streetNumber: '123',
      streetName: 'Main Street',
      city: '',
      stateOrProvince: 'ON',
      postalOrZipCode: 'M5H 2N2',
      country: 'Canada'
    };

    const result = isAddressComplete(address);

    expect(result).toBe(false);
  });

  test('isAddressComplete_shouldHandleWhitespaceFields_whenFieldsOnlyWhitespace', () => {
    const address: AddressData = {
      unitNumber: '',
      streetNumber: '  ',
      streetName: 'Main Street',
      city: 'Toronto',
      stateOrProvince: 'ON',
      postalOrZipCode: 'M5H 2N2',
      country: 'Canada'
    };

    const result = isAddressComplete(address);

    expect(result).toBe(false);
  });
});

describe('getAddressCompletionPercentage', () => {
  test('getAddressCompletionPercentage_shouldReturn100_whenAllFieldsFilled', () => {
    const address: AddressData = {
      unitNumber: '101',
      streetNumber: '123',
      streetName: 'Main Street',
      city: 'Toronto',
      stateOrProvince: 'ON',
      postalOrZipCode: 'M5H 2N2',
      country: 'Canada'
    };

    const percentage = getAddressCompletionPercentage(address);

    expect(percentage).toBe(100);
  });

  test('getAddressCompletionPercentage_shouldReturn0_whenAllFieldsEmpty', () => {
    const address = createEmptyAddress();

    const percentage = getAddressCompletionPercentage(address);

    expect(percentage).toBe(0);
  });

  test('getAddressCompletionPercentage_shouldReturnCorrectPercentage_whenSomeFieldsFilled', () => {
    const address: AddressData = {
      unitNumber: '',
      streetNumber: '123',
      streetName: 'Main Street',
      city: 'Toronto',
      stateOrProvince: '', // 4 out of 7 fields filled
      postalOrZipCode: 'M5H 2N2',
      country: ''
    };

    const percentage = getAddressCompletionPercentage(address);

    expect(percentage).toBe(57); // 4/7 = 0.571... rounded to 57
  });

  test('getAddressCompletionPercentage_shouldIgnoreWhitespace_whenFieldsContainWhitespace', () => {
    const address: AddressData = {
      unitNumber: '  ', // Should not count as filled
      streetNumber: '123',
      streetName: 'Main Street',
      city: 'Toronto',
      stateOrProvince: 'ON',
      postalOrZipCode: 'M5H 2N2',
      country: 'Canada'
    };

    const percentage = getAddressCompletionPercentage(address);

    expect(percentage).toBe(86); // 6/7 = 0.857... rounded to 86
  });

  test('getAddressCompletionPercentage_shouldReturnRoundedPercentage_whenResultNotWhole', () => {
    const address: AddressData = {
      unitNumber: '',
      streetNumber: '123',
      streetName: '',
      city: '',
      stateOrProvince: '',
      postalOrZipCode: '',
      country: ''
    };

    const percentage = getAddressCompletionPercentage(address);

    expect(percentage).toBe(14); // 1/7 = 0.142... rounded to 14
  });
});

describe('validateStreetNumber', () => {
  test('validateStreetNumber_shouldReturnValid_whenEmpty', () => {
    const result = validateStreetNumber('');

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('validateStreetNumber_shouldReturnValid_whenNumbersOnly', () => {
    const result = validateStreetNumber('123');

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('validateStreetNumber_shouldReturnInvalid_whenContainsLetters', () => {
    const result = validateStreetNumber('123A');

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Street number must contain only numbers');
  });

  test('validateStreetNumber_shouldReturnInvalid_whenExceedsMaxLength', () => {
    const longNumber = '1'.repeat(21);
    const result = validateStreetNumber(longNumber);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Street number must not exceed 20 characters');
  });
});