import type { AuthResponse, ContactRequest, CreateUserResponse, User, UserAuthentication, UserSummary } from '../services/dtos';
import { Role } from '../services/dtos';

/**
 * Mock Users Database - Canadian Users
 * Used when running in standalone mode (config.enableMockAuth = true)
 */
export const mockUsers: User[] = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@buildflow.com',
        registered: true,
        contact: {
            id: '1',
            firstName: 'Alexandre',
            lastName: 'Dubois',
            labels: ['Administrator'],
            email: 'admin@buildflow.com',
            phone: '+1-604-555-0100',
            address: {
                id: '1',
                streetNumberAndName: '1250 Granville Street',
                city: 'Vancouver',
                stateOrProvince: 'BC',
                postalOrZipCode: 'V6Z 1M9',
                country: 'Canada',
            },
        },
    },
    {
        id: '2',
        username: 'testuser',
        email: 'test@buildflow.com',
        registered: true,
        contact: {
            id: '2',
            firstName: 'Sarah',
            lastName: 'MacDonald',
            labels: ['Builder'],
            email: 'test@buildflow.com',
            phone: '+1-416-555-0200',
            address: {
                id: '2',
                streetNumberAndName: '789 King Street West',
                city: 'Toronto',
                stateOrProvince: 'ON',
                postalOrZipCode: 'M5V 1N1',
                country: 'Canada',
            },
        },
    },
    {
        id: '3',
        username: 'builder1',
        email: 'builder1@buildflow.com',
        registered: true,
        contact: {
            id: '3',
            firstName: 'Michael',
            lastName: 'Chen',
            labels: ['Builder'],
            email: 'builder1@buildflow.com',
            phone: '+1-403-555-0300',
            address: {
                id: '3',
                streetNumberAndName: '456 Centre Street',
                city: 'Calgary',
                stateOrProvince: 'AB',
                postalOrZipCode: 'T2G 1B8',
                country: 'Canada',
            },
        },
    },
    {
        id: '4',
        username: 'owner1',
        email: 'owner1@buildflow.com',
        registered: true,
        contact: {
            id: '4',
            firstName: 'Jennifer',
            lastName: 'Martin',
            labels: ['Owner'],
            email: 'owner1@buildflow.com',
            phone: '+1-514-555-0400',
            address: {
                id: '4',
                streetNumberAndName: '890 Rue Saint-Jacques',
                city: 'Montreal',
                stateOrProvince: 'QC',
                postalOrZipCode: 'H3C 1G1',
                country: 'Canada',
            },
        },
    },
    {
        id: '5',
        username: 'contractor1',
        email: 'contractor1@buildflow.com',
        registered: true,
        contact: {
            id: '5',
            firstName: 'David',
            lastName: 'Thompson',
            labels: ['Builder', 'Subcontractor'],
            email: 'contractor1@buildflow.com',
            phone: '+1-613-555-0500',
            address: {
                id: '5',
                streetNumberAndName: '234 Wellington Street',
                city: 'Ottawa',
                stateOrProvince: 'ON',
                postalOrZipCode: 'K1A 0N8',
                country: 'Canada',
            },
        },
    },
    {
        id: '6',
        username: 'designer1',
        email: 'designer1@buildflow.com',
        registered: true,
        contact: {
            id: '6',
            firstName: 'Emily',
            lastName: 'Rodriguez',
            labels: ['Other'],
            email: 'designer1@buildflow.com',
            phone: '+1-604-555-0600',
            address: {
                id: '6',
                streetNumberAndName: '567 Robson Street',
                city: 'Vancouver',
                stateOrProvince: 'BC',
                postalOrZipCode: 'V6B 2B7',
                country: 'Canada',
            },
        },
    },
    {
        id: '7',
        username: 'supplier1',
        email: 'supplier1@buildflow.com',
        registered: true,
        contact: {
            id: '7',
            firstName: 'Robert',
            lastName: 'Wilson',
            labels: ['Supplier'],
            email: 'supplier1@buildflow.com',
            phone: '+1-416-555-0700',
            address: {
                id: '7',
                streetNumberAndName: '321 Queen Street East',
                city: 'Toronto',
                stateOrProvince: 'ON',
                postalOrZipCode: 'M5A 1S9',
                country: 'Canada',
            },
        },
    },
    {
        id: '8',
        username: 'inspector1',
        email: 'inspector1@buildflow.com',
        registered: true,
        contact: {
            id: '8',
            firstName: 'Patricia',
            lastName: 'Lee',
            labels: ['Other'],
            email: 'inspector1@buildflow.com',
            phone: '+1-403-555-0800',
            address: {
                id: '8',
                streetNumberAndName: '789 8th Avenue SW',
                city: 'Calgary',
                stateOrProvince: 'AB',
                postalOrZipCode: 'T2P 1H5',
                country: 'Canada',
            },
        },
    },
    {
        id: '9',
        username: 'architect1',
        email: 'architect1@buildflow.com',
        registered: true,
        contact: {
            id: '9',
            firstName: 'James',
            lastName: 'Anderson',
            labels: ['Other'],
            email: 'architect1@buildflow.com',
            phone: '+1-514-555-0900',
            address: {
                id: '9',
                streetNumberAndName: '456 Boulevard Saint-Laurent',
                city: 'Montreal',
                stateOrProvince: 'QC',
                postalOrZipCode: 'H2X 2V1',
                country: 'Canada',
            },
        },
    },
    {
        id: '10',
        username: 'lender1',
        email: 'lender1@buildflow.com',
        registered: true,
        contact: {
            id: '10',
            firstName: 'Lisa',
            lastName: 'Tremblay',
            labels: ['Lender'],
            email: 'lender1@buildflow.com',
            phone: '+1-613-555-1000',
            address: {
                id: '10',
                streetNumberAndName: '123 Bank Street',
                city: 'Ottawa',
                stateOrProvince: 'ON',
                postalOrZipCode: 'K1P 5N2',
                country: 'Canada',
            },
        },
    },
    {
        id: '11',
        username: 'manager1',
        email: 'manager1@buildflow.com',
        registered: true,
        contact: {
            id: '11',
            firstName: 'William',
            lastName: 'Brown',
            labels: ['Builder'],
            email: 'manager1@buildflow.com',
            phone: '+1-604-555-1100',
            address: {
                id: '11',
                streetNumberAndName: '890 Hastings Street',
                city: 'Vancouver',
                stateOrProvince: 'BC',
                postalOrZipCode: 'V6C 1E4',
                country: 'Canada',
            },
        },
    },
    {
        id: '12',
        username: 'consultant1',
        email: 'consultant1@buildflow.com',
        registered: true,
        contact: {
            id: '12',
            firstName: 'Amanda',
            lastName: 'Patel',
            labels: ['Other'],
            email: 'consultant1@buildflow.com',
            phone: '+1-416-555-1200',
            address: {
                id: '12',
                streetNumberAndName: '234 Bay Street',
                city: 'Toronto',
                stateOrProvince: 'ON',
                postalOrZipCode: 'M5J 2Z4',
                country: 'Canada',
            },
        },
    },
];

/**
 * Mock User Roles Database - Matching the mockUsers
 * Used when running in standalone mode (config.enableMockAuth = true)
 * Stores role information separately for each user
 */
export const mockUserRoles: Record<string, string> = {
    'admin': Role.ADMIN,
    'testuser': Role.USER,
    'builder1': Role.USER,
    'owner1': Role.USER,
    'contractor1': Role.USER,
    'designer1': Role.USER,
    'supplier1': Role.USER,
    'inspector1': Role.USER,
    'architect1': Role.USER,
    'lender1': Role.USER,
    'manager1': Role.USER,
    'consultant1': Role.USER,
};

/**
 * Mock credentials for testing
 * Passwords meet validation requirements:
 * - At least 8 characters
 * - Contains uppercase, lowercase, digit, and special character (@$!%*?&_)
 * 
 * Note: This object is mutable and gets updated when new users register in mock mode
 */
export const mockCredentials: Record<string, { username: string; password: string }> = {
    admin: { username: 'admin', password: 'BuildFlow2024!' },
    user: { username: 'testuser', password: 'TestUser123&' },
    builder1: { username: 'builder1', password: 'Builder123!' },
    owner1: { username: 'owner1', password: 'Owner123!' },
    contractor1: { username: 'contractor1', password: 'Contractor123!' },
    designer1: { username: 'designer1', password: 'Designer123!' },
    supplier1: { username: 'supplier1', password: 'Supplier123!' },
    inspector1: { username: 'inspector1', password: 'Inspector123!' },
    architect1: { username: 'architect1', password: 'Architect123!' },
    lender1: { username: 'lender1', password: 'Lender123!' },
    manager1: { username: 'manager1', password: 'Manager123!' },
    consultant1: { username: 'consultant1', password: 'Consultant123!' },
};

/**
 * Store new user credentials for mock authentication
 * Called when a new user registers in mock mode
 */
export function storeMockCredentials(username: string, password: string): void {
    // Use username as the key for the credentials
    mockCredentials[username] = { username, password };

    // Log for development (will only show if console logs are enabled)
    console.log(`[Mock Auth] Stored credentials for new user: ${username}`);
}

/**
 * Get all available mock credentials (for development/debugging)
 * Useful for seeing what users can log in during testing
 */
export function getAvailableMockCredentials(): string[] {
    return Object.keys(mockCredentials);
}

/**
 * Reset mock credentials to default state
 * Useful for testing or clearing session data
 */
export function resetMockCredentials(): void {
    // Clear all dynamic credentials, keep only defaults
    const defaultCredentials = {
        admin: { username: 'admin', password: 'BuildFlow2024!' },
        user: { username: 'testuser', password: 'TestUser123&' },
        builder1: { username: 'builder1', password: 'Builder123!' },
        owner1: { username: 'owner1', password: 'Owner123!' },
        contractor1: { username: 'contractor1', password: 'Contractor123!' },
        designer1: { username: 'designer1', password: 'Designer123!' },
        supplier1: { username: 'supplier1', password: 'Supplier123!' },
        inspector1: { username: 'inspector1', password: 'Inspector123!' },
        architect1: { username: 'architect1', password: 'Architect123!' },
        lender1: { username: 'lender1', password: 'Lender123!' },
        manager1: { username: 'manager1', password: 'Manager123!' },
        consultant1: { username: 'consultant1', password: 'Consultant123!' },
    };

    // Clear the object
    Object.keys(mockCredentials).forEach(key => delete mockCredentials[key]);

    // Restore defaults
    Object.assign(mockCredentials, defaultCredentials);

    console.log('[Mock Auth] Reset credentials to defaults');
}

/**
 * Generate a mock JWT token
 */
export function generateMockToken(userId: string, username: string): string {
    // Simple mock token format (not a real JWT)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        sub: username,
        userId,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours from now
    }));
    const signature = btoa('mock-signature');

    return `${header}.${payload}.${signature}`;
}

/**
 * Generate mock AuthResponse
 * Accepts either User or UserSummary
 */
export function generateMockAuthResponse(userOrSummary: User | UserSummary): AuthResponse {
    const token = generateMockToken(userOrSummary.id, userOrSummary.username);
    const expiresInSeconds = 60 * 60 * 24; // 24 hours
    const expiryDate = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    return {
        tokenType: 'Bearer',
        accessToken: token,
        expiryDate,
        expiresInSeconds,
    };
}

/**
 * Generate mock CreateUserResponse
 */
export function generateMockCreateUserResponse(user: User): CreateUserResponse {
    return {
        user: user,
    };
}

/**
 * Find user by username
 */
export function findUserByUsername(username: string): User | undefined {
    return mockUsers.find(u => u.username === username);
}

/**
 * Find user by email
 */
export function findUserByEmail(email: string): User | undefined {
    return mockUsers.find(u => u.email === email);
}

/**
 * Validate mock credentials
 */
export function validateMockCredentials(username: string, password: string): User | null {
    const validCredential = Object.values(mockCredentials).find(
        cred => cred.username === username && cred.password === password
    );

    if (validCredential) {
        return findUserByUsername(username) || null;
    }

    return null;
}

/**
 * Get user role by username
 */
export function getUserRole(username: string): string {
    return mockUserRoles[username] || Role.USER;
}

/**
 * Find user authentication by username
 * Creates UserAuthentication DTO from User and Role data
 * This is used by AdminService for backend API compatibility
 */
export function findUserAuthenticationByUsername(username: string): UserAuthentication | undefined {
    const user = findUserByUsername(username);
    if (!user) return undefined;
    
    return {
        id: user.id,
        username: user.username,
        role: getUserRole(username),
        enabled: true,
        createdAt: '2024-01-15T10:30:00.000Z',
        lastLogin: new Date().toISOString()
    };
}

/**
 * Find user authentication by id
 * Creates UserAuthentication DTO from User and Role data
 * This is used by AdminService for backend API compatibility
 */
export function findUserAuthenticationById(id: string): UserAuthentication | undefined {
    const user = mockUsers.find(u => u.id === id);
    if (!user) return undefined;
    
    return {
        id: user.id,
        username: user.username,
        role: getUserRole(user.username),
        enabled: true,
        createdAt: '2024-01-15T10:30:00.000Z',
        lastLogin: new Date().toISOString()
    };
}

/**
 * Create a new mock user (simulates registration)
 * Uses the actual contact data provided in signUpData
 * Also stores the credentials for future login
 */
export function createMockUser(contactRequestDto: ContactRequest, username: string, password: string): User {
    const newUser: User = {
        id: String(mockUsers.length + 1),
        username,
        email: contactRequestDto.email,
        registered: true,
        contact: {
            id: String(mockUsers.length + 1),
            firstName: contactRequestDto.firstName,
            lastName: contactRequestDto.lastName,
            labels: contactRequestDto.labels,
            email: contactRequestDto.email,
            phone: contactRequestDto.phone || '',
            address: contactRequestDto.addressRequestDto ? {
                id: String(mockUsers.length + 1),
                streetNumberAndName: contactRequestDto.addressRequestDto.streetNumberAndName || '',
                city: contactRequestDto.addressRequestDto.city || '',
                stateOrProvince: contactRequestDto.addressRequestDto.stateOrProvince || '',
                postalOrZipCode: contactRequestDto.addressRequestDto.postalOrZipCode || '',
                country: contactRequestDto.addressRequestDto.country || '',
            } : {
                id: String(mockUsers.length + 1),
                streetNumberAndName: '',
                city: '',
                stateOrProvince: '',
                postalOrZipCode: '',
                country: '',
            },
        },
    };

    // Determine role based on labels
    const role = contactRequestDto.labels.includes('Administrator') ? Role.ADMIN : Role.USER;
    mockUserRoles[username] = role;

    // Store credentials for future login
    storeMockCredentials(username, password);

    // Add to mock arrays
    mockUsers.push(newUser);

    return newUser;
}

/**
 * Validate mock token format
 */
export function isValidMockToken(token: string): boolean {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        const payload = JSON.parse(atob(parts[1]));
        const exp = payload.exp;

        // Check if token is expired
        return exp > Math.floor(Date.now() / 1000);
    } catch {
        return false;
    }
}

/**
 * Get user from mock token
 * Returns UserSummary containing id, username, email, and role
 */
export function getUserFromMockToken(token: string): UserSummary | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = JSON.parse(atob(parts[1]));
        const user = findUserByUsername(payload.sub);
        
        if (!user) return null;
        
        // Return UserSummary instead of full User
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: getUserRole(user.username)
        };
    } catch {
        return null;
    }
}
