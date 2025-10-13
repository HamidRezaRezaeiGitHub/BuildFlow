import type { ContactRequest, User } from '../services/dtos';
import {
  createMockUser,
  findUserAuthenticationById,
  findUserAuthenticationByUsername,
  findUserByEmail,
  findUserByUsername,
  generateMockAuthResponse,
  generateMockCreateUserResponse,
  generateMockToken,
  getAvailableMockCredentials,
  getUserFromMockToken,
  isValidMockToken,
  mockCredentials,
  mockUsers,
  resetMockCredentials,
  storeMockCredentials,
  validateMockCredentials,
} from './authMocks';

describe('authMocks', () => {
  // Store original data to restore after each test
  let originalMockUsers: User[];
  let originalMockCredentials: Record<string, { username: string; password: string }>;

  beforeEach(() => {
    // Create deep copies to restore original state
    originalMockUsers = JSON.parse(JSON.stringify(mockUsers));
    originalMockCredentials = JSON.parse(JSON.stringify(mockCredentials));
  });

  afterEach(() => {
    // Restore original state
    mockUsers.length = 0;
    mockUsers.push(...originalMockUsers);

    Object.keys(mockCredentials).forEach(key => delete mockCredentials[key]);
    Object.assign(mockCredentials, originalMockCredentials);
  });

  describe('Static Data Integrity', () => {
    test('mockUsers should contain expected default users', () => {
      expect(mockUsers).toHaveLength(2);

      const adminUser = mockUsers.find(u => u.username === 'admin');
      expect(adminUser).toBeDefined();
      expect(adminUser?.id).toBe('1');
      expect(adminUser?.email).toBe('admin@buildflow.com');
      expect(adminUser?.contactDto.labels).toContain('Administrator');
      expect(adminUser?.contactDto.firstName).toBe('Alexandre');
      expect(adminUser?.contactDto.lastName).toBe('Dubois');
      expect(adminUser?.contactDto.addressDto.city).toBe('Vancouver');
      expect(adminUser?.contactDto.addressDto.country).toBe('Canada');

      const testUser = mockUsers.find(u => u.username === 'testuser');
      expect(testUser).toBeDefined();
      expect(testUser?.id).toBe('2');
      expect(testUser?.email).toBe('test@buildflow.com');
      expect(testUser?.contactDto.labels).toContain('Builder');
      expect(testUser?.contactDto.firstName).toBe('Sarah');
      expect(testUser?.contactDto.lastName).toBe('MacDonald');
      expect(testUser?.contactDto.addressDto.city).toBe('Toronto');
      expect(testUser?.contactDto.addressDto.country).toBe('Canada');
    });

    test('findUserAuthenticationByUsername should return correct auth data', () => {
      const adminAuth = findUserAuthenticationByUsername('admin');
      expect(adminAuth).toBeDefined();
      expect(adminAuth?.id).toBe('1');
      expect(adminAuth?.username).toBe('admin');
      expect(adminAuth?.role).toBe('ADMIN');
      expect(adminAuth?.enabled).toBe(true);

      const userAuth = findUserAuthenticationByUsername('testuser');
      expect(userAuth).toBeDefined();
      expect(userAuth?.id).toBe('2');
      expect(userAuth?.username).toBe('testuser');
      expect(userAuth?.role).toBe('USER');
      expect(userAuth?.enabled).toBe(true);
    });

    test('mockCredentials should contain default credentials', () => {
      expect(mockCredentials).toHaveProperty('admin');
      expect(mockCredentials).toHaveProperty('user');
      expect(mockCredentials.admin).toEqual({ username: 'admin', password: 'BuildFlow2024!' });
      expect(mockCredentials.user).toEqual({ username: 'testuser', password: 'TestUser123&' });
    });

    test('users and authentications should have matching usernames', () => {
      mockUsers.forEach(user => {
        const auth = findUserAuthenticationByUsername(user.username);
        expect(auth).toBeDefined();
        expect(auth?.username).toBe(user.username);
      });
    });
  });

  describe('storeMockCredentials', () => {
    test('should store new credentials correctly', () => {
      const username = 'newuser';
      const password = 'NewPassword123!';

      storeMockCredentials(username, password);

      expect(mockCredentials[username]).toBeDefined();
      expect(mockCredentials[username]).toEqual({ username, password });
    });

    test('should overwrite existing credentials', () => {
      const username = 'admin';
      const newPassword = 'NewAdminPass123!';

      storeMockCredentials(username, newPassword);

      expect(mockCredentials[username].password).toBe(newPassword);
      expect(mockCredentials[username].username).toBe(username);
    });

    test('should handle special characters in credentials', () => {
      const username = 'user@domain.com';
      const password = 'P@$$w0rd!@#$%';

      storeMockCredentials(username, password);

      expect(mockCredentials[username]).toEqual({ username, password });
    });
  });

  describe('getAvailableMockCredentials', () => {
    test('should return all credential keys', () => {
      const keys = getAvailableMockCredentials();
      expect(keys).toContain('admin');
      expect(keys).toContain('user');
      expect(keys).toHaveLength(2);
    });

    test('should return updated keys after adding credentials', () => {
      storeMockCredentials('newuser', 'password123');
      const keys = getAvailableMockCredentials();
      expect(keys).toContain('admin');
      expect(keys).toContain('user');
      expect(keys).toContain('newuser');
      expect(keys).toHaveLength(3);
    });
  });

  describe('resetMockCredentials', () => {
    test('should reset to default credentials', () => {
      // Add some extra credentials
      storeMockCredentials('extra1', 'pass1');
      storeMockCredentials('extra2', 'pass2');
      expect(Object.keys(mockCredentials)).toHaveLength(4);

      // Reset
      resetMockCredentials();

      // Should only have defaults
      expect(Object.keys(mockCredentials)).toHaveLength(2);
      expect(mockCredentials).toHaveProperty('admin');
      expect(mockCredentials).toHaveProperty('user');
      expect(mockCredentials.admin).toEqual({ username: 'admin', password: 'BuildFlow2024!' });
      expect(mockCredentials.user).toEqual({ username: 'testuser', password: 'TestUser123&' });
    });

    test('should overwrite modified default credentials', () => {
      // Modify default credentials
      storeMockCredentials('admin', 'modifiedPassword');
      expect(mockCredentials.admin.password).toBe('modifiedPassword');

      // Reset
      resetMockCredentials();

      // Should be back to original
      expect(mockCredentials.admin.password).toBe('BuildFlow2024!');
    });
  });

  describe('generateMockToken', () => {
    test('should generate valid JWT format token', () => {
      const token = generateMockToken('123', 'testuser');
      const parts = token.split('.');

      expect(parts).toHaveLength(3); // header.payload.signature
      expect(() => JSON.parse(atob(parts[0]))).not.toThrow(); // Valid base64 JSON header
      expect(() => JSON.parse(atob(parts[1]))).not.toThrow(); // Valid base64 JSON payload
    });

    test('should include correct payload data', () => {
      const userId = '123';
      const username = 'testuser';
      const token = generateMockToken(userId, username);
      const payload = JSON.parse(atob(token.split('.')[1]));

      expect(payload.sub).toBe(username);
      expect(payload.userId).toBe(userId);
      expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    test('should generate different tokens for different inputs', () => {
      const token1 = generateMockToken('123', 'user1');
      const token2 = generateMockToken('456', 'user2');

      expect(token1).not.toBe(token2);
    });
  });

  describe('generateMockAuthResponse', () => {
    test('should generate valid auth response', () => {
      const user = mockUsers[0];
      const response = generateMockAuthResponse(user);

      expect(response.tokenType).toBe('Bearer');
      expect(response.accessToken).toBeDefined();
      expect(response.expiryDate).toBeDefined();
      expect(response.expiresInSeconds).toBe(60 * 60 * 24); // 24 hours

      // Verify token format
      const parts = response.accessToken.split('.');
      expect(parts).toHaveLength(3);
    });

    test('should include user info in token', () => {
      const user = mockUsers[0];
      const response = generateMockAuthResponse(user);
      const payload = JSON.parse(atob(response.accessToken.split('.')[1]));

      expect(payload.sub).toBe(user.username);
      expect(payload.userId).toBe(user.id);
    });
  });

  describe('generateMockCreateUserResponse', () => {
    test('should wrap user in CreateUserResponse format', () => {
      const user = mockUsers[0];
      const response = generateMockCreateUserResponse(user);

      expect(response.userDto).toBe(user);
    });
  });

  describe('findUserByUsername', () => {
    test('should find existing user', () => {
      const user = findUserByUsername('admin');
      expect(user).toBeDefined();
      expect(user?.username).toBe('admin');
      expect(user?.id).toBe('1');
    });

    test('should return undefined for non-existent user', () => {
      const user = findUserByUsername('nonexistent');
      expect(user).toBeUndefined();
    });

    test('should be case sensitive', () => {
      const user = findUserByUsername('ADMIN');
      expect(user).toBeUndefined();
    });

    test('should handle empty string', () => {
      const user = findUserByUsername('');
      expect(user).toBeUndefined();
    });
  });

  describe('findUserByEmail', () => {
    test('should find existing user by email', () => {
      const user = findUserByEmail('admin@buildflow.com');
      expect(user).toBeDefined();
      expect(user?.email).toBe('admin@buildflow.com');
      expect(user?.username).toBe('admin');
    });

    test('should return undefined for non-existent email', () => {
      const user = findUserByEmail('nonexistent@example.com');
      expect(user).toBeUndefined();
    });

    test('should be case sensitive', () => {
      const user = findUserByEmail('ADMIN@BUILDFLOW.COM');
      expect(user).toBeUndefined();
    });
  });

  describe('findUserAuthenticationByUsername', () => {
    test('should find existing authentication', () => {
      const auth = findUserAuthenticationByUsername('admin');
      expect(auth).toBeDefined();
      expect(auth?.username).toBe('admin');
      expect(auth?.role).toBe('ADMIN');
    });

    test('should return undefined for non-existent user', () => {
      const auth = findUserAuthenticationByUsername('nonexistent');
      expect(auth).toBeUndefined();
    });
  });

  describe('findUserAuthenticationById', () => {
    test('should find existing authentication by id', () => {
      const auth = findUserAuthenticationById('1');
      expect(auth).toBeDefined();
      expect(auth?.id).toBe('1');
      expect(auth?.username).toBe('admin');
    });

    test('should return undefined for non-existent id', () => {
      const auth = findUserAuthenticationById('999');
      expect(auth).toBeUndefined();
    });
  });

  describe('validateMockCredentials', () => {
    test('should validate correct credentials', () => {
      const user = validateMockCredentials('admin', 'BuildFlow2024!');
      expect(user).toBeDefined();
      expect(user?.username).toBe('admin');
    });

    test('should reject incorrect password', () => {
      const user = validateMockCredentials('admin', 'wrongpassword');
      expect(user).toBeNull();
    });

    test('should reject non-existent username', () => {
      const user = validateMockCredentials('nonexistent', 'anypassword');
      expect(user).toBeNull();
    });

    test('should validate testuser credentials', () => {
      const user = validateMockCredentials('testuser', 'TestUser123&');
      expect(user).toBeDefined();
      expect(user?.username).toBe('testuser');
    });

    test('should handle empty credentials', () => {
      expect(validateMockCredentials('', '')).toBeNull();
      expect(validateMockCredentials('admin', '')).toBeNull();
      expect(validateMockCredentials('', 'BuildFlow2024!')).toBeNull();
    });

    test('should validate dynamically added credentials', () => {
      storeMockCredentials('newuser', 'NewPass123!');
      // Add user to mockUsers for validation to work
      mockUsers.push({
        id: '3',
        username: 'newuser',
        email: 'new@example.com',
        registered: true,
        contactDto: {
          id: '3',
          firstName: 'New',
          lastName: 'User',
          labels: ['User'],
          email: 'new@example.com',
          phone: '',
          addressDto: {
            id: '3',
            unitNumber: '',
            streetNumberAndName: '',
            city: '',
            stateOrProvince: '',
            postalOrZipCode: '',
            country: '',
          },
        },
      });

      const user = validateMockCredentials('newuser', 'NewPass123!');
      expect(user).toBeDefined();
      expect(user?.username).toBe('newuser');
    });
  });

  describe('createMockUser', () => {
    test('should create user with complete contact data', () => {
      const contactRequest: ContactRequest = {
        firstName: 'John',
        lastName: 'Doe',
        labels: ['Builder'],
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        addressRequestDto: {
          streetNumberAndName: '123 Main Street',
          city: 'Toronto',
          stateOrProvince: 'ON',
          postalOrZipCode: 'M1M 1M1',
          country: 'Canada',
        },
      };

      const initialUserCount = mockUsers.length;
      const newUser = createMockUser(contactRequest, 'johndoe', 'Password123!');

      expect(newUser.username).toBe('johndoe');
      expect(newUser.email).toBe('john.doe@example.com');
      expect(newUser.contactDto.firstName).toBe('John');
      expect(newUser.contactDto.lastName).toBe('Doe');
      expect(newUser.contactDto.labels).toEqual(['Builder']);
      expect(newUser.contactDto.phone).toBe('+1-555-0123');
      expect(newUser.contactDto.addressDto.streetNumberAndName).toBe('123 Main Street');

      // Verify user was added to arrays
      expect(mockUsers).toHaveLength(initialUserCount + 1);

      // Verify authentication object can be retrieved
      const auth = findUserAuthenticationByUsername('johndoe');
      expect(auth).toBeDefined();
      expect(auth?.role).toBe('USER');
      expect(auth?.enabled).toBe(true);

      // Verify credentials were stored
      expect(mockCredentials['johndoe']).toEqual({ username: 'johndoe', password: 'Password123!' });
    });

    test('should create admin user when Administrator label is present', () => {
      const contactRequest: ContactRequest = {
        firstName: 'Admin',
        lastName: 'User',
        labels: ['Administrator', 'Manager'],
        email: 'admin.user@example.com',
      };

      const newUser = createMockUser(contactRequest, 'adminuser', 'AdminPass123!');

      expect(newUser.contactDto.labels).toContain('Administrator');

      const auth = findUserAuthenticationByUsername('adminuser');
      expect(auth?.role).toBe('ADMIN');
    });

    test('should handle missing address data', () => {
      const contactRequest: ContactRequest = {
        firstName: 'Jane',
        lastName: 'Smith',
        labels: ['Supplier'],
        email: 'jane.smith@example.com',
      };

      const newUser = createMockUser(contactRequest, 'janesmith', 'Password123!');

      expect(newUser.contactDto.addressDto).toBeDefined();
      expect(newUser.contactDto.addressDto.streetNumberAndName).toBe('');
      expect(newUser.contactDto.addressDto.city).toBe('');
    });

    test('should handle missing optional fields', () => {
      const contactRequest: ContactRequest = {
        firstName: 'Min',
        lastName: 'User',
        labels: ['User'],
        email: 'min@example.com',
        // No phone or address
      };

      const newUser = createMockUser(contactRequest, 'minuser', 'Password123!');

      expect(newUser.contactDto.phone).toBe('');
      expect(newUser.contactDto.addressDto).toBeDefined();
    });

    test('should generate sequential IDs', () => {
      const initialCount = mockUsers.length;
      const expectedUserId = String(initialCount + 1);

      const contactRequest: ContactRequest = {
        firstName: 'Test',
        lastName: 'Sequential',
        labels: ['User'],
        email: 'sequential@example.com',
      };

      const newUser = createMockUser(contactRequest, 'sequential', 'Pass123!');

      expect(newUser.id).toBe(expectedUserId);
      expect(newUser.contactDto.id).toBe(expectedUserId);

      const auth = findUserAuthenticationByUsername('sequential');
      expect(auth?.id).toBe(expectedUserId); // Auth ID should match user ID
    });
  });

  describe('isValidMockToken', () => {
    test('should validate properly formatted token', () => {
      const token = generateMockToken('123', 'testuser');
      expect(isValidMockToken(token)).toBe(true);
    });

    test('should reject malformed tokens', () => {
      expect(isValidMockToken('invalid')).toBe(false);
      expect(isValidMockToken('too.few')).toBe(false);
      expect(isValidMockToken('too.many.parts.here')).toBe(false);
      expect(isValidMockToken('')).toBe(false);
    });

    test('should reject expired token', () => {
      // Create token with past expiration
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: 'testuser',
        userId: '123',
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      }));
      const signature = btoa('mock-signature');
      const expiredToken = `${header}.${payload}.${signature}`;

      expect(isValidMockToken(expiredToken)).toBe(false);
    });

    test('should accept valid future token', () => {
      // Create token with future expiration
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: 'testuser',
        userId: '123',
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      }));
      const signature = btoa('mock-signature');
      const validToken = `${header}.${payload}.${signature}`;

      expect(isValidMockToken(validToken)).toBe(true);
    });

    test('should handle invalid JSON in payload', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const invalidPayload = btoa('invalid-json{');
      const signature = btoa('mock-signature');
      const invalidToken = `${header}.${invalidPayload}.${signature}`;

      expect(isValidMockToken(invalidToken)).toBe(false);
    });
  });

  describe('getUserFromMockToken', () => {
    test('should extract user from valid token', () => {
      const token = generateMockToken('1', 'admin');
      const user = getUserFromMockToken(token);

      expect(user).toBeDefined();
      expect(user?.username).toBe('admin');
      expect(user?.id).toBe('1');
    });

    test('should return null for invalid token format', () => {
      expect(getUserFromMockToken('invalid')).toBeNull();
      expect(getUserFromMockToken('too.few')).toBeNull();
      expect(getUserFromMockToken('')).toBeNull();
    });

    test('should return null for non-existent user', () => {
      const token = generateMockToken('999', 'nonexistent');
      const user = getUserFromMockToken(token);

      expect(user).toBeNull();
    });

    test('should handle malformed payload', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const invalidPayload = btoa('invalid-json{');
      const signature = btoa('mock-signature');
      const invalidToken = `${header}.${invalidPayload}.${signature}`;

      expect(getUserFromMockToken(invalidToken)).toBeNull();
    });
  });

  describe('Integration Tests', () => {
    test('complete user registration and login flow', () => {
      const contactRequest: ContactRequest = {
        firstName: 'Integration',
        lastName: 'Test',
        labels: ['Builder'],
        email: 'integration@example.com',
        phone: '+1-555-9999',
      };

      // Register user
      const newUser = createMockUser(contactRequest, 'integration', 'IntegrationTest123!');
      expect(newUser).toBeDefined();

      // Verify credentials were stored
      const storedCreds = mockCredentials['integration'];
      expect(storedCreds).toEqual({ username: 'integration', password: 'IntegrationTest123!' });

      // Validate credentials (login simulation)
      const validatedUser = validateMockCredentials('integration', 'IntegrationTest123!');
      expect(validatedUser).toBeDefined();
      expect(validatedUser?.id).toBe(newUser.id);

      // Generate auth response
      const authResponse = generateMockAuthResponse(validatedUser!);
      expect(authResponse.accessToken).toBeDefined();

      // Extract user from token
      const tokenUser = getUserFromMockToken(authResponse.accessToken);
      expect(tokenUser?.username).toBe('integration');

      // Verify authentication object exists
      const auth = findUserAuthenticationByUsername('integration');
      expect(auth).toBeDefined();
      expect(auth?.role).toBe('USER');
      expect(auth?.enabled).toBe(true);
    });

    test('admin user creation and authentication flow', () => {
      const adminContactRequest: ContactRequest = {
        firstName: 'Super',
        lastName: 'Admin',
        labels: ['Administrator', 'Manager'],
        email: 'superadmin@example.com',
      };

      // Create admin user
      createMockUser(adminContactRequest, 'superadmin', 'SuperAdmin123!');

      // Verify admin role assignment
      const adminAuth = findUserAuthenticationByUsername('superadmin');
      expect(adminAuth?.role).toBe('ADMIN');

      // Login as admin
      const validatedAdmin = validateMockCredentials('superadmin', 'SuperAdmin123!');
      expect(validatedAdmin).toBeDefined();

      // Generate token and verify admin context
      const adminAuthResponse = generateMockAuthResponse(validatedAdmin!);
      const tokenAdmin = getUserFromMockToken(adminAuthResponse.accessToken);
      expect(tokenAdmin?.role).toBe('ADMIN');
      expect(tokenAdmin?.username).toBe('superadmin');
    });

    test('credential management across multiple operations', () => {
      const originalKeyCount = Object.keys(mockCredentials).length;

      // Add multiple users
      createMockUser({ firstName: 'User1', lastName: 'Test', labels: ['User'], email: 'user1@test.com' }, 'user1', 'Pass1!');
      createMockUser({ firstName: 'User2', lastName: 'Test', labels: ['User'], email: 'user2@test.com' }, 'user2', 'Pass2!');

      expect(Object.keys(mockCredentials)).toHaveLength(originalKeyCount + 2);

      // Verify all can authenticate
      expect(validateMockCredentials('user1', 'Pass1!')).toBeDefined();
      expect(validateMockCredentials('user2', 'Pass2!')).toBeDefined();

      // Reset credentials
      resetMockCredentials();
      expect(Object.keys(mockCredentials)).toHaveLength(2); // Back to defaults

      // Original users should still be able to authenticate with defaults
      expect(validateMockCredentials('admin', 'BuildFlow2024!')).toBeDefined();
      expect(validateMockCredentials('testuser', 'TestUser123&')).toBeDefined();

      // New users should no longer authenticate
      expect(validateMockCredentials('user1', 'Pass1!')).toBeNull();
      expect(validateMockCredentials('user2', 'Pass2!')).toBeNull();
    });
  });
});