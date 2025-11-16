/**
 * User-related DTOs matching backend structure
 * These DTOs correspond to the backend user management API
 */

import { Contact, ContactRequest } from '../contact/ContactDtos';

/**
 * User information DTO
 * Matches backend UserDto structure
 * Note: Backend serializes contactDto as "contact" in JSON
 */
export interface User {
    /** Unique identifier for the user */
    id: string;

    /** Username for authentication */
    username: string;

    email: string;

    registered: boolean;

    /** Complete contact information for the user */
    contact: Contact;
}

/**
 * User request DTO for creation/updates
 * Similar to User but uses ContactRequest for contact info
 */
export interface UserRequest {
    /** Username for authentication */
    username: string;

    /** Flag indicating if the user is registered */
    registered: boolean;

    /** Complete contact information for the user */
    contactDto: ContactRequest;
}

/**
 * User authentication DTO for admin access
 * Matches backend UserAuthenticationDto structure
 * Contains authentication-related information without sensitive data
 */
export interface UserAuthentication {
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
    user: User;
    userAuthentication: UserAuthentication;
}
