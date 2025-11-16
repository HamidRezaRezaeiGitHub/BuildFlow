import { apiService } from '../ApiService';
import {
    CreateProjectRequest,
    CreateProjectResponse,
    Project,
    PagedResponse,
    PaginationParams,
    buildPaginationQuery,
    extractPaginationMetadata
} from '..';
import { IProjectService } from './IProjectService';

/**
 * Real ProjectService implementation
 * Makes actual HTTP calls to the backend API
 * Used when config.enableMockData is false (integrated mode)
 * 
 * Backend API Endpoints (baseUrl already includes /api prefix):
 * - POST /v1/projects - Create a new project
 * - GET /v1/projects/user/{userId} - Get all projects for a user (paginated)
 * - GET /v1/projects/{projectId} - Get a single project by ID
 * 
 * All methods require authentication (token must be provided as parameter)
 */
export class ProjectService implements IProjectService {
    /**
     * Create a new project
     * Requires CREATE_PROJECT authority
     * 
     * Backend: POST /api/v1/projects
     * 
     * @param request - Project creation request (userId, role, location)
     * @param token - JWT authentication token
     * @returns Promise<CreateProjectResponse> - Created project response
     */
    async createProject(request: CreateProjectRequest, token: string): Promise<CreateProjectResponse> {
        return apiService.create<CreateProjectResponse>('/v1/projects', request, token);
    }

    /**
     * Get all projects for a specific user ID (paginated)
     * Requires VIEW_PROJECT authority
     * 
     * Backend: GET /api/v1/projects/user/{userId}
     * 
     * @param userId - ID of the user whose projects to retrieve
     * @param token - JWT authentication token
     * @param params - Optional pagination parameters (page, size, orderBy, direction)
     * @returns Promise<PagedResponse<Project>> - Paginated response with projects and metadata
     */
    async getProjectsByUserId(
        userId: string,
        token: string,
        params?: PaginationParams
    ): Promise<PagedResponse<Project>> {
        const endpoint = `/v1/projects/user/${encodeURIComponent(userId)}${buildPaginationQuery(params)}`;

        const { data, headers } = await apiService.requestWithMetadata<Project[]>(
            endpoint,
            { method: 'GET' },
            token
        );

        return {
            content: data,
            pagination: extractPaginationMetadata(headers)
        };
    }

    /**
     * Get a single project by ID
     * Requires VIEW_PROJECT authority
     * 
     * Backend: GET /api/v1/projects/{projectId}
     * 
     * @param projectId - ID of the project to retrieve
     * @param token - JWT authentication token
     * @returns Promise<Project> - The requested project
     * @throws Error if project not found
     */
    async getProjectById(projectId: string, token: string): Promise<Project> {
        return apiService.get<Project>(`/v1/projects/${encodeURIComponent(projectId)}`, token);
    }
}
