import {
    CreateProjectRequest,
    CreateProjectResponse,
    Project,
    PagedResponse,
    PaginationParams
} from '..';

/**
 * Interface for Project Service operations
 * Defines the contract for both real API and mock implementations
 * 
 * Backend API Endpoints:
 * - POST /api/v1/projects - Create a new project
 * - GET /api/v1/projects/user/{userId} - Get all projects for a user (paginated)
 * 
 * All methods require authentication (token must be provided as parameter)
 */
export interface IProjectService {
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
    createProject(request: CreateProjectRequest, token: string): Promise<CreateProjectResponse>;

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
    getProjectsByUserId(
        userId: string,
        token: string,
        params?: PaginationParams
    ): Promise<PagedResponse<Project>>;

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
    getProjectById(projectId: string, token: string): Promise<Project>;
}
