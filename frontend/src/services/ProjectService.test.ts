import { apiService } from './ApiService';
import { projectService, ProjectServiceWithAuth } from './ProjectService';
import { CreateProjectRequest, CreateProjectResponse, ProjectDto } from './dtos';

// Mock the ApiService
jest.mock('./ApiService', () => ({
    apiService: {
        create: jest.fn(),
        get: jest.fn(),
    },
}));

describe('ProjectService', () => {
    const mockToken = 'mock-jwt-token';
    const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
    const mockProjectId = '987e6543-e21b-12d3-a456-426614174999';

    const mockCreateRequest: CreateProjectRequest = {
        userId: mockUserId,
        isBuilder: true,
        locationRequestDto: {
            unitNumber: '101',
            streetNumberAndName: '123 Main St',
            city: 'Springfield',
            stateOrProvince: 'IL',
            postalOrZipCode: '62701',
            country: 'USA',
        },
    };

    const mockProjectDto: ProjectDto = {
        id: mockProjectId,
        builderId: mockUserId,
        ownerId: 'owner-id',
        location: {
            id: 'location-id',
            unitNumber: '101',
            streetNumberAndName: '123 Main St',
            city: 'Springfield',
            stateOrProvince: 'IL',
            postalOrZipCode: '62701',
            country: 'USA',
        },
    };

    const mockCreateResponse: CreateProjectResponse = {
        projectDto: mockProjectDto,
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
            const mockProjects: ProjectDto[] = [mockProjectDto];
            (apiService.get as jest.Mock).mockResolvedValue(mockProjects);

            const result = await projectService.getProjectsByBuilderId(mockUserId, mockToken);

            expect(apiService.get).toHaveBeenCalledWith(
                `/api/v1/projects/builder/${mockUserId}`,
                mockToken
            );
            expect(result).toEqual(mockProjects);
        });

        test('ProjectService_shouldEncodeSpecialCharacters_inBuilderId', async () => {
            const builderIdWithSpecialChars = 'builder@123';
            const mockProjects: ProjectDto[] = [mockProjectDto];
            (apiService.get as jest.Mock).mockResolvedValue(mockProjects);

            await projectService.getProjectsByBuilderId(builderIdWithSpecialChars, mockToken);

            expect(apiService.get).toHaveBeenCalledWith(
                `/api/v1/projects/builder/${encodeURIComponent(builderIdWithSpecialChars)}`,
                mockToken
            );
        });
    });

    describe('getProjectsByOwnerId', () => {
        test('ProjectService_shouldGetProjects_whenValidOwnerIdProvided', async () => {
            const mockOwnerId = 'owner-id-123';
            const mockProjects: ProjectDto[] = [mockProjectDto];
            (apiService.get as jest.Mock).mockResolvedValue(mockProjects);

            const result = await projectService.getProjectsByOwnerId(mockOwnerId, mockToken);

            expect(apiService.get).toHaveBeenCalledWith(
                `/api/v1/projects/owner/${mockOwnerId}`,
                mockToken
            );
            expect(result).toEqual(mockProjects);
        });

        test('ProjectService_shouldEncodeSpecialCharacters_inOwnerId', async () => {
            const ownerIdWithSpecialChars = 'owner/456';
            const mockProjects: ProjectDto[] = [mockProjectDto];
            (apiService.get as jest.Mock).mockResolvedValue(mockProjects);

            await projectService.getProjectsByOwnerId(ownerIdWithSpecialChars, mockToken);

            expect(apiService.get).toHaveBeenCalledWith(
                `/api/v1/projects/owner/${encodeURIComponent(ownerIdWithSpecialChars)}`,
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
            const mockProjects: ProjectDto[] = [mockProjectDto];
            (apiService.get as jest.Mock).mockResolvedValue(mockProjects);

            const result = await serviceWithAuth.getProjectsByBuilderId(mockUserId);

            expect(getToken).toHaveBeenCalled();
            expect(apiService.get).toHaveBeenCalledWith(
                `/api/v1/projects/builder/${mockUserId}`,
                mockToken
            );
            expect(result).toEqual(mockProjects);
        });

        test('ProjectServiceWithAuth_shouldUseTokenFromContext_whenGettingProjectsByOwnerId', async () => {
            getToken.mockReturnValue(mockToken);
            const mockProjects: ProjectDto[] = [mockProjectDto];
            (apiService.get as jest.Mock).mockResolvedValue(mockProjects);

            const result = await serviceWithAuth.getProjectsByOwnerId('owner-id');

            expect(getToken).toHaveBeenCalled();
            expect(apiService.get).toHaveBeenCalledWith(
                '/api/v1/projects/owner/owner-id',
                mockToken
            );
            expect(result).toEqual(mockProjects);
        });
    });
});
