import type { AuthResponse, CreateUserResponse, User } from '../services/dtos';

/**
 * Mock Users Database
 * Used when running in standalone mode (config.enableMockAuth = true)
 */
export const mockUsers: User[] = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@buildflow.com',
        registered: true,
        contactDto: {
            id: '1',
            firstName: 'Admin',
            lastName: 'User',
            labels: ['Administrator'],
            email: 'admin@buildflow.com',
            phone: '+1-555-0100',
            addressDto: {
                id: '1',
                streetNumber: '123',
                streetName: 'Admin St',
                city: 'San Francisco',
                stateOrProvince: 'CA',
                postalOrZipCode: '94102',
                country: 'USA',
            },
        },
    },
    {
        id: '2',
        username: 'testuser',
        email: 'test@buildflow.com',
        registered: true,
        contactDto: {
            id: '2',
            firstName: 'Test',
            lastName: 'User',
            labels: ['Builder'],
            email: 'test@buildflow.com',
            phone: '+1-555-0200',
            addressDto: {
                id: '2',
                streetNumber: '456',
                streetName: 'Test Ave',
                city: 'Los Angeles',
                stateOrProvince: 'CA',
                postalOrZipCode: '90001',
                country: 'USA',
            },
        },
    },
];

/**
 * Mock credentials for testing
 * Password for all mock users: 'password123'
 */
export const mockCredentials = {
    admin: { username: 'admin', password: 'password123' },
    user: { username: 'testuser', password: 'password123' },
};

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
 */
export function generateMockAuthResponse(user: User): AuthResponse {
    const token = generateMockToken(user.id, user.username);
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
        userDto: user,
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
 * Create a new mock user (simulates registration)
 */
export function createMockUser(
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    phone?: string
): User {
    const newUser: User = {
        id: String(mockUsers.length + 1),
        username,
        email,
        registered: true,
        contactDto: {
            id: String(mockUsers.length + 1),
            firstName,
            lastName,
            labels: ['Builder'],
            email,
            phone: phone || '',
            addressDto: {
                id: String(mockUsers.length + 1),
                streetName: 'Main St',
                city: 'Unknown',
                stateOrProvince: 'CA',
                country: 'USA',
            },
        },
    };

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
 */
export function getUserFromMockToken(token: string): User | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = JSON.parse(atob(parts[1]));
        return findUserByUsername(payload.sub) || null;
    } catch {
        return null;
    }
}
