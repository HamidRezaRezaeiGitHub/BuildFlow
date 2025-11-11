import { BaseAddressDto } from "./AddressDtos";

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
 * Extends BaseAddressDto and adds ID field
 * Matches backend ContactAddressDto structure
 */
export interface ContactAddressDto extends BaseAddressDto {
    /** Unique identifier for the contact address */
    id: string;
}

/**
 * Contact address request DTO for creation (no ID)
 * Extends BaseAddressDto without ID field
 * Matches backend ContactAddressRequestDto structure
 */
export interface ContactAddressRequestDto extends BaseAddressDto {
    // No ID field - this is for creation requests only
}

/**
 * Contact information DTO
 * Matches backend ContactDto structure
 * Note: Backend serializes addressDto as "address" in JSON
 */
export interface ContactDto {
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
    address: ContactAddressDto;
}

/**
 * Contact request DTO for creation/updates
 * Similar to ContactDto but uses ContactAddressRequestDto for address
 * Matches backend ContactRequestDto structure
 */
export interface ContactRequestDto {
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
    address?: ContactAddressRequestDto;
}

/**
 * User information DTO
 * Matches backend UserDto structure
 * Note: Backend serializes contactDto as "contact" in JSON
 */
export interface UserDto {
    /** Unique identifier for the user */
    id: string;

    /** Username for authentication */
    username: string;

    email: string;

    registered: boolean;

    /** Complete contact information for the user */
    contact: ContactDto;
}

/**
 * User request DTO for creation/updates
 * Similar to UserDto but uses ContactRequestDto for contact info
 */
export interface UserRequestDto {
    /** Username for authentication */
    username: string;

    /** Flag indicating if the user is registered */
    registered: boolean;

    /** Complete contact information for the user */
    contactDto: ContactRequestDto;
}

/**
 * User authentication DTO for admin access
 * Matches backend UserAuthenticationDto structure
 * Contains authentication-related information without sensitive data
 */
export interface UserAuthenticationDto {
    /** Unique identifier of the user authentication */
    id: string;

    /** Username */
    username: string;

    /** User role (ADMIN, USER, PREMIUM_USER, VIEWER) */
    role: string;

    /** Whether the user account is enabled */
    enabled: boolean;

    /** Timestamp when the user was created */
    createdAt: string;

    /** Timestamp of the user's last login */
    lastLogin?: string;
}

export interface UserDetails {
    username: string;
    user: UserDto;
    userAuthentication: UserAuthenticationDto;
}