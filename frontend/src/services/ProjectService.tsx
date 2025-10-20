import { apiService } from './ApiService';
import { CreateProjectRequest, CreateProjectResponse, ProjectDto } from './dtos';

/**
 * ProjectService class that handles all project-related API operations
 * Uses the generic ApiService for HTTP communications while focusing on project business logic
 * 
 * This service provides functions for project endpoints including:
 * - Creating new projects
 * - Retrieving projects by builder ID
 * - Retrieving projects by owner ID
 * 
 * All methods require authentication (token must be provided as parameter)
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
     * Get all projects for a specific builder
     * Requires VIEW_PROJECT authority
     * 
     * @param builderId - ID of the builder whose projects to retrieve
     * @param token - JWT authentication token
     * @returns Promise<ProjectDto[]> - Array of projects assigned to the builder
     */
    async getProjectsByBuilderId(builderId: string, token: string): Promise<ProjectDto[]> {
        return apiService.get<ProjectDto[]>(`/api/v1/projects/builder/${encodeURIComponent(builderId)}`, token);
    }

    /**
     * Get all projects for a specific owner
     * Requires VIEW_PROJECT authority
     * 
     * @param ownerId - ID of the owner whose projects to retrieve
     * @param token - JWT authentication token
     * @returns Promise<ProjectDto[]> - Array of projects owned by the property owner
     */
    async getProjectsByOwnerId(ownerId: string, token: string): Promise<ProjectDto[]> {
        return apiService.get<ProjectDto[]>(`/api/v1/projects/owner/${encodeURIComponent(ownerId)}`, token);
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

    async getProjectsByOwnerId(ownerId: string): Promise<ProjectDto[]> {
        return this.projectService.getProjectsByOwnerId(ownerId, this.ensureToken());
    }
}

// Create and export a singleton instance of the raw service
export const projectService = new ProjectService();

// Also export the class for testing or custom instances
export default ProjectService;
