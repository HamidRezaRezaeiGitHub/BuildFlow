/**
 * Contact-related DTOs matching backend structure
 * These DTOs correspond to the backend contact management API
 */

import { BaseAddress } from '../address/AddressDtos';

/**
 * Contact label options derived from ContactLabel enum
 * Ordered by priority: Builder, Owner, Lender, Supplier, Subcontractor, Other, Administrator
 */
export const contactLabelOptions = [
    'Builder',
    'Owner',
    'Lender',
    'Supplier',
    'Subcontractor',
    'Other',
    'Administrator'
] as const;

/**
 * Contact address DTO for API responses
 * Extends BaseAddress and adds ID field
 * Matches backend ContactAddressDto structure
 */
export interface ContactAddress extends BaseAddress {
    /** Unique identifier for the contact address */
    id: string;
}

/**
 * Contact address request DTO for creation (no ID)
 * Extends BaseAddress without ID field
 * Matches backend ContactAddressRequestDto structure
 */
export interface ContactAddressRequest extends BaseAddress {
    // No ID field - this is for creation requests only
}

/**
 * Contact information DTO
 * Matches backend ContactDto structure
 * Note: Backend serializes addressDto as "address" in JSON
 */
export interface Contact {
    /** Unique identifier for the contact */
    id: string;

    /** First name of the contact */
    firstName: string;

    /** Last name of the contact */
    lastName: string;

    /** List of labels/tags associated with the contact */
    labels: string[];

    /** Email address of the contact */
    email: string;

    /** Phone number of the contact */
    phone?: string;

    /** Address information for the contact */
    address: ContactAddress;
}

/**
 * Contact request DTO for creation/updates
 * Similar to Contact but uses ContactAddressRequest for address
 * Matches backend ContactRequestDto structure
 */
export interface ContactRequest {
    /** First name of the contact */
    firstName: string;

    /** Last name of the contact */
    lastName: string;

    /** List of labels/tags associated with the contact */
    labels: string[];

    /** Email address of the contact */
    email: string;

    /** Phone number of the contact */
    phone?: string;

    /** Address information for the contact */
    address?: ContactAddressRequest;
}
