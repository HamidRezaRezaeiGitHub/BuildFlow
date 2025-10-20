import { apiService } from './ApiService';
import { 
    CreateProjectRequest, 
    CreateProjectResponse, 
    ProjectDto,
    PagedResponse,
    PaginationParams,
    buildPaginationQuery,
    extractPaginationMetadata
} from './dtos';

/**
 * ProjectService class that handles all project-related API operations
 * Uses the generic ApiService for HTTP communications while focusing on project business logic
 * 
 * This service provides functions for project endpoints including:
 * - Creating new projects
 * - Retrieving projects by builder ID (with pagination support)
 * - Retrieving projects by owner ID (with pagination support)
 * 
 * All methods require authentication (token must be provided as parameter)
 * 
 * Pagination Support:
 * - Methods support optional pagination parameters (page, size, orderBy, direction)
 * - Default pagination: page 0, size 25, orderBy lastUpdatedAt DESC
 * - Response includes pagination metadata from backend headers
 */
class ProjectService {

    /**
     * Create a new project
     * Requires CREATE_PROJECT authority
     * 
     * @param request - Project creation request data
     * @param token - JWT authentication token
     * @returns Promise<CreateProjectResponse> - Created project response with project details
     */
    async createProject(request: CreateProjectRequest, token: string): Promise<CreateProjectResponse> {
        return apiService.create<CreateProjectResponse>('/api/v1/projects', request, token);
    }

    /**
     * Get all projects for a specific builder (legacy method - no pagination)
     * Requires VIEW_PROJECT authority
     * 
     * @deprecated Use getProjectsByBuilderIdPaginated for pagination support
     * @param builderId - ID of the builder whose projects to retrieve
     * @param token - JWT authentication token
     * @returns Promise<ProjectDto[]> - Array of projects assigned to the builder
     */
    async getProjectsByBuilderId(builderId: string, token: string): Promise<ProjectDto[]> {
        // Call paginated version and return just the content
        const pagedResponse = await this.getProjectsByBuilderIdPaginated(builderId, token);
        return pagedResponse.content;
    }

    /**
     * Get paginated projects for a specific builder
     * Requires VIEW_PROJECT authority
     * 
     * @param builderId - ID of the builder whose projects to retrieve
     * @param token - JWT authentication token
     * @param params - Optional pagination parameters (page, size, orderBy, direction)
     * @returns Promise<PagedResponse<ProjectDto>> - Paginated response with projects and metadata
     */
    async getProjectsByBuilderIdPaginated(
        builderId: string, 
        token: string,
        params?: PaginationParams
    ): Promise<PagedResponse<ProjectDto>> {
        const endpoint = `/api/v1/projects/builder/${encodeURIComponent(builderId)}${buildPaginationQuery(params)}`;
        
        const { data, headers } = await apiService.requestWithMetadata<ProjectDto[]>(
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
     * Get all projects for a specific owner (legacy method - no pagination)
     * Requires VIEW_PROJECT authority
     * 
     * @deprecated Use getProjectsByOwnerIdPaginated for pagination support
     * @param ownerId - ID of the owner whose projects to retrieve
     * @param token - JWT authentication token
     * @returns Promise<ProjectDto[]> - Array of projects owned by the property owner
     */
    async getProjectsByOwnerId(ownerId: string, token: string): Promise<ProjectDto[]> {
        // Call paginated version and return just the content
        const pagedResponse = await this.getProjectsByOwnerIdPaginated(ownerId, token);
        return pagedResponse.content;
    }

    /**
     * Get paginated projects for a specific owner
     * Requires VIEW_PROJECT authority
     * 
     * @param ownerId - ID of the owner whose projects to retrieve
     * @param token - JWT authentication token
     * @param params - Optional pagination parameters (page, size, orderBy, direction)
     * @returns Promise<PagedResponse<ProjectDto>> - Paginated response with projects and metadata
     */
    async getProjectsByOwnerIdPaginated(
        ownerId: string, 
        token: string,
        params?: PaginationParams
    ): Promise<PagedResponse<ProjectDto>> {
        const endpoint = `/api/v1/projects/owner/${encodeURIComponent(ownerId)}${buildPaginationQuery(params)}`;
        
        const { data, headers } = await apiService.requestWithMetadata<ProjectDto[]>(
            endpoint,
            { method: 'GET' },
            token
        );
        
        return {
            content: data,
            pagination: extractPaginationMetadata(headers)
        };
    }
}

/**
 * Service wrapper that integrates with AuthContext
 * This wrapper automatically provides the authentication token from context
 * Consumers don't need to handle token management
 */
export class ProjectServiceWithAuth {
    private projectService: ProjectService;
    private getToken: () => string | null;

    constructor(getToken: () => string | null) {
        this.projectService = new ProjectService();
        this.getToken = getToken;
    }

    private ensureToken(): string {
        const token = this.getToken();
        if (!token) {
            throw new Error('Authentication token required for project operations');
        }
        return token;
    }

    async createProject(request: CreateProjectRequest): Promise<CreateProjectResponse> {
        return this.projectService.createProject(request, this.ensureToken());
    }

    async getProjectsByBuilderId(builderId: string): Promise<ProjectDto[]> {
        return this.projectService.getProjectsByBuilderId(builderId, this.ensureToken());
    }

    async getProjectsByBuilderIdPaginated(
        builderId: string,
        params?: PaginationParams
    ): Promise<PagedResponse<ProjectDto>> {
        return this.projectService.getProjectsByBuilderIdPaginated(builderId, this.ensureToken(), params);
    }

    async getProjectsByOwnerId(ownerId: string): Promise<ProjectDto[]> {
        return this.projectService.getProjectsByOwnerId(ownerId, this.ensureToken());
    }

    async getProjectsByOwnerIdPaginated(
        ownerId: string,
        params?: PaginationParams
    ): Promise<PagedResponse<ProjectDto>> {
        return this.projectService.getProjectsByOwnerIdPaginated(ownerId, this.ensureToken(), params);
    }
}

// Create and export a singleton instance of the raw service
export const projectService = new ProjectService();

// Also export the class for testing or custom instances
export default ProjectService;
