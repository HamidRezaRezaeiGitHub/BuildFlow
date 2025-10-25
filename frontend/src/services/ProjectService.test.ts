import { apiService } from './ApiService';
import { projectService, ProjectServiceWithAuth } from './ProjectService';
import { CreateProjectRequest, CreateProjectResponse, Project } from './dtos';

// Mock the config module to disable mock data in tests
jest.mock('@/config/environment', () => ({
    config: {
        enableMockData: false,
        enableConsoleLogs: false,
        isDevelopment: true,
    },
}));

// Mock the ApiService
jest.mock('./ApiService', () => ({
    apiService: {
        create: jest.fn(),
        get: jest.fn(),
        requestWithMetadata: jest.fn(),
    },
}));

describe('ProjectService', () => {
    const mockToken = 'mock-jwt-token';
    const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
    const mockProjectId = '987e6543-e21b-12d3-a456-426614174999';

    const mockCreateRequest: CreateProjectRequest = {
        userId: mockUserId,
        role: 'BUILDER',
        locationRequestDto: {
            unitNumber: '101',
            streetNumberAndName: '123 Main St',
            city: 'Springfield',
            stateOrProvince: 'IL',
            postalOrZipCode: '62701',
            country: 'USA',
        },
        participants: [],
    };

    const mockProject: Project = {
        id: mockProjectId,
        userId: mockUserId,
        role: 'BUILDER',
        participants: [],
        location: {
            id: 'location-id',
            unitNumber: '101',
            streetNumberAndName: '123 Main St',
            city: 'Springfield',
            stateOrProvince: 'IL',
            postalOrZipCode: '62701',
            country: 'USA',
        },
        createdAt: '2024-01-15T10:30:00Z',
        lastUpdatedAt: '2024-10-18T14:20:00Z',
    };

    const mockCreateResponse: CreateProjectResponse = {
        project: mockProject,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createProject', () => {
        test('ProjectService_shouldCreateProject_whenValidRequestProvided', async () => {
            (apiService.create as jest.Mock).mockResolvedValue(mockCreateResponse);

            const result = await projectService.createProject(mockCreateRequest, mockToken);

            expect(apiService.create).toHaveBeenCalledWith(
                '/api/v1/projects',
                mockCreateRequest,
                mockToken
            );
            expect(result).toEqual(mockCreateResponse);
        });

        test('ProjectService_shouldThrowError_whenApiServiceFails', async () => {
            const errorMessage = 'Failed to create project';
            (apiService.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(
                projectService.createProject(mockCreateRequest, mockToken)
            ).rejects.toThrow(errorMessage);

            expect(apiService.create).toHaveBeenCalledWith(
                '/api/v1/projects',
                mockCreateRequest,
                mockToken
            );
        });
    });

    describe('getProjectsByBuilderId', () => {
        test('ProjectService_shouldGetProjects_whenValidBuilderIdProvided', async () => {
            const mockProjects: Project[] = [mockProject];
            const mockHeaders = new Headers({
                'X-Page': '0',
                'X-Size': '25',
                'X-Total-Count': '1',
                'X-Total-Pages': '1'
            });
            (apiService.requestWithMetadata as jest.Mock).mockResolvedValue({
                data: mockProjects,
                headers: mockHeaders,
                status: 200,
                statusText: 'OK'
            });

            const result = await projectService.getProjectsByBuilderId(mockUserId, mockToken);

            expect(apiService.requestWithMetadata).toHaveBeenCalledWith(
                `/api/v1/projects/builder/${mockUserId}`,
                { method: 'GET' },
                mockToken
            );
            expect(result).toEqual(mockProjects);
        });

        test('ProjectService_shouldEncodeSpecialCharacters_inBuilderId', async () => {
            const builderIdWithSpecialChars = 'builder@123';
            const mockProjects: Project[] = [mockProject];
            const mockHeaders = new Headers({
                'X-Page': '0',
                'X-Size': '25',
                'X-Total-Count': '1',
                'X-Total-Pages': '1'
            });
            (apiService.requestWithMetadata as jest.Mock).mockResolvedValue({
                data: mockProjects,
                headers: mockHeaders,
                status: 200,
                statusText: 'OK'
            });

            await projectService.getProjectsByBuilderId(builderIdWithSpecialChars, mockToken);

            expect(apiService.requestWithMetadata).toHaveBeenCalledWith(
                `/api/v1/projects/builder/${encodeURIComponent(builderIdWithSpecialChars)}`,
                { method: 'GET' },
                mockToken
            );
        });
    });

    describe('getProjectsByOwnerId', () => {
        test('ProjectService_shouldGetProjects_whenValidOwnerIdProvided', async () => {
            const mockOwnerId = 'owner-id-123';
            const mockProjects: Project[] = [mockProject];
            const mockHeaders = new Headers({
                'X-Page': '0',
                'X-Size': '25',
                'X-Total-Count': '1',
                'X-Total-Pages': '1'
            });
            (apiService.requestWithMetadata as jest.Mock).mockResolvedValue({
                data: mockProjects,
                headers: mockHeaders,
                status: 200,
                statusText: 'OK'
            });

            const result = await projectService.getProjectsByOwnerId(mockOwnerId, mockToken);

            expect(apiService.requestWithMetadata).toHaveBeenCalledWith(
                `/api/v1/projects/owner/${mockOwnerId}`,
                { method: 'GET' },
                mockToken
            );
            expect(result).toEqual(mockProjects);
        });

        test('ProjectService_shouldEncodeSpecialCharacters_inOwnerId', async () => {
            const ownerIdWithSpecialChars = 'owner/456';
            const mockProjects: Project[] = [mockProject];
            const mockHeaders = new Headers({
                'X-Page': '0',
                'X-Size': '25',
                'X-Total-Count': '1',
                'X-Total-Pages': '1'
            });
            (apiService.requestWithMetadata as jest.Mock).mockResolvedValue({
                data: mockProjects,
                headers: mockHeaders,
                status: 200,
                statusText: 'OK'
            });

            await projectService.getProjectsByOwnerId(ownerIdWithSpecialChars, mockToken);

            expect(apiService.requestWithMetadata).toHaveBeenCalledWith(
                `/api/v1/projects/owner/${encodeURIComponent(ownerIdWithSpecialChars)}`,
                { method: 'GET' },
                mockToken
            );
        });
    });

    describe('ProjectServiceWithAuth', () => {
        let getToken: jest.Mock;
        let serviceWithAuth: ProjectServiceWithAuth;

        beforeEach(() => {
            getToken = jest.fn();
            serviceWithAuth = new ProjectServiceWithAuth(getToken);
        });

        test('ProjectServiceWithAuth_shouldUseTokenFromContext_whenCreatingProject', async () => {
            getToken.mockReturnValue(mockToken);
            (apiService.create as jest.Mock).mockResolvedValue(mockCreateResponse);

            const result = await serviceWithAuth.createProject(mockCreateRequest);

            expect(getToken).toHaveBeenCalled();
            expect(apiService.create).toHaveBeenCalledWith(
                '/api/v1/projects',
                mockCreateRequest,
                mockToken
            );
            expect(result).toEqual(mockCreateResponse);
        });

        test('ProjectServiceWithAuth_shouldThrowError_whenTokenNotAvailable', async () => {
            getToken.mockReturnValue(null);

            await expect(
                serviceWithAuth.createProject(mockCreateRequest)
            ).rejects.toThrow('Authentication token required for project operations');

            expect(apiService.create).not.toHaveBeenCalled();
        });

        test('ProjectServiceWithAuth_shouldUseTokenFromContext_whenGettingProjectsByBuilderId', async () => {
            getToken.mockReturnValue(mockToken);
            const mockProjects: Project[] = [mockProject];
            const mockHeaders = new Headers({
                'X-Page': '0',
                'X-Size': '25',
                'X-Total-Count': '1',
                'X-Total-Pages': '1'
            });
            (apiService.requestWithMetadata as jest.Mock).mockResolvedValue({
                data: mockProjects,
                headers: mockHeaders,
                status: 200,
                statusText: 'OK'
            });

            const result = await serviceWithAuth.getProjectsByBuilderId(mockUserId);

            expect(getToken).toHaveBeenCalled();
            expect(apiService.requestWithMetadata).toHaveBeenCalledWith(
                `/api/v1/projects/builder/${mockUserId}`,
                { method: 'GET' },
                mockToken
            );
            expect(result).toEqual(mockProjects);
        });

        test('ProjectServiceWithAuth_shouldUseTokenFromContext_whenGettingProjectsByOwnerId', async () => {
            getToken.mockReturnValue(mockToken);
            const mockProjects: Project[] = [mockProject];
            const mockHeaders = new Headers({
                'X-Page': '0',
                'X-Size': '25',
                'X-Total-Count': '1',
                'X-Total-Pages': '1'
            });
            (apiService.requestWithMetadata as jest.Mock).mockResolvedValue({
                data: mockProjects,
                headers: mockHeaders,
                status: 200,
                statusText: 'OK'
            });

            const result = await serviceWithAuth.getProjectsByOwnerId('owner-id');

            expect(getToken).toHaveBeenCalled();
            expect(apiService.requestWithMetadata).toHaveBeenCalledWith(
                '/api/v1/projects/owner/owner-id',
                { method: 'GET' },
                mockToken
            );
            expect(result).toEqual(mockProjects);
        });
    });

    describe('getProjectsByBuilderIdPaginated', () => {
        test('ProjectService_shouldGetPaginatedProjects_withDefaultParams', async () => {
            const mockProjects: Project[] = [mockProject];
            const mockHeaders = new Headers({
                'X-Page': '0',
                'X-Size': '25',
                'X-Total-Count': '1',
                'X-Total-Pages': '1'
            });
            (apiService.requestWithMetadata as jest.Mock).mockResolvedValue({
                data: mockProjects,
                headers: mockHeaders,
                status: 200,
                statusText: 'OK'
            });

            const result = await projectService.getProjectsByBuilderIdPaginated(mockUserId, mockToken);

            expect(apiService.requestWithMetadata).toHaveBeenCalledWith(
                `/api/v1/projects/builder/${mockUserId}`,
                { method: 'GET' },
                mockToken
            );
            expect(result.content).toEqual(mockProjects);
            expect(result.pagination).toEqual({
                page: 0,
                size: 25,
                totalElements: 1,
                totalPages: 1,
                hasNext: false,
                hasPrevious: false,
                isFirst: true,
                isLast: true
            });
        });

        test('ProjectService_shouldGetPaginatedProjects_withCustomParams', async () => {
            const mockProjects: Project[] = [mockProject];
            const mockHeaders = new Headers({
                'X-Page': '1',
                'X-Size': '10',
                'X-Total-Count': '50',
                'X-Total-Pages': '5'
            });
            (apiService.requestWithMetadata as jest.Mock).mockResolvedValue({
                data: mockProjects,
                headers: mockHeaders,
                status: 200,
                statusText: 'OK'
            });

            const paginationParams = {
                page: 1,
                size: 10,
                orderBy: 'createdAt',
                direction: 'ASC' as const
            };

            const result = await projectService.getProjectsByBuilderIdPaginated(
                mockUserId,
                mockToken,
                paginationParams
            );

            expect(apiService.requestWithMetadata).toHaveBeenCalledWith(
                `/api/v1/projects/builder/${mockUserId}?page=1&size=10&orderBy=createdAt&direction=ASC`,
                { method: 'GET' },
                mockToken
            );
            expect(result.content).toEqual(mockProjects);
            expect(result.pagination).toEqual({
                page: 1,
                size: 10,
                totalElements: 50,
                totalPages: 5,
                hasNext: true,
                hasPrevious: true,
                isFirst: false,
                isLast: false
            });
        });
    });

    describe('getProjectsByOwnerIdPaginated', () => {
        test('ProjectService_shouldGetPaginatedProjects_withDefaultParams', async () => {
            const mockOwnerId = 'owner-id-123';
            const mockProjects: Project[] = [mockProject];
            const mockHeaders = new Headers({
                'X-Page': '0',
                'X-Size': '25',
                'X-Total-Count': '1',
                'X-Total-Pages': '1'
            });
            (apiService.requestWithMetadata as jest.Mock).mockResolvedValue({
                data: mockProjects,
                headers: mockHeaders,
                status: 200,
                statusText: 'OK'
            });

            const result = await projectService.getProjectsByOwnerIdPaginated(mockOwnerId, mockToken);

            expect(apiService.requestWithMetadata).toHaveBeenCalledWith(
                `/api/v1/projects/owner/${mockOwnerId}`,
                { method: 'GET' },
                mockToken
            );
            expect(result.content).toEqual(mockProjects);
            expect(result.pagination).toEqual({
                page: 0,
                size: 25,
                totalElements: 1,
                totalPages: 1,
                hasNext: false,
                hasPrevious: false,
                isFirst: true,
                isLast: true
            });
        });

        test('ProjectService_shouldGetPaginatedProjects_withCustomParams', async () => {
            const mockOwnerId = 'owner-id-123';
            const mockProjects: Project[] = [mockProject];
            const mockHeaders = new Headers({
                'X-Page': '2',
                'X-Size': '15',
                'X-Total-Count': '100',
                'X-Total-Pages': '7'
            });
            (apiService.requestWithMetadata as jest.Mock).mockResolvedValue({
                data: mockProjects,
                headers: mockHeaders,
                status: 200,
                statusText: 'OK'
            });

            const paginationParams = {
                page: 2,
                size: 15,
                orderBy: 'lastUpdatedAt',
                direction: 'DESC' as const
            };

            const result = await projectService.getProjectsByOwnerIdPaginated(
                mockOwnerId,
                mockToken,
                paginationParams
            );

            expect(apiService.requestWithMetadata).toHaveBeenCalledWith(
                `/api/v1/projects/owner/${mockOwnerId}?page=2&size=15&orderBy=lastUpdatedAt&direction=DESC`,
                { method: 'GET' },
                mockToken
            );
            expect(result.content).toEqual(mockProjects);
            expect(result.pagination).toEqual({
                page: 2,
                size: 15,
                totalElements: 100,
                totalPages: 7,
                hasNext: true,
                hasPrevious: true,
                isFirst: false,
                isLast: false
            });
        });
    });
});
