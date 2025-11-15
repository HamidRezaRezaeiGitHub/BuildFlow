import { config } from '@/config/environment';
import {
    CreateProjectRequest,
    CreateProjectResponse,
    Project,
    PagedResponse,
    PaginationParams
} from '../dtos';
import { IProjectService } from './IProjectService';
import { ProjectMockService } from './ProjectMockService';
import { ProjectService } from './ProjectService';

/**
 * Factory function to create the appropriate ProjectService implementation
 * Returns mock service in standalone mode, real service in integrated mode
 * 
 * @returns IProjectService implementation based on config.enableMockData
 */
function createProjectService(): IProjectService {
    if (config.enableMockData) {
        if (config.enableConsoleLogs) {
            console.log('[ProjectServiceFactory] Using ProjectMockService (standalone mode)');
        }
        return new ProjectMockService();
    }

    if (config.enableConsoleLogs) {
        console.log('[ProjectServiceFactory] Using ProjectService (integrated mode)');
    }
    return new ProjectService();
}

/**
 * Service wrapper that integrates with AuthContext
 * Automatically provides authentication token from context
 * Consumers don't need to handle token management
 * 
 * Usage:
 * ```typescript
 * const { getToken } = useAuth();
 * const projectService = new ProjectServiceWithAuth(getToken);
 * 
 * // Token is automatically injected
 * const response = await projectService.createProject(request);
 * ```
 */
export class ProjectServiceWithAuth {
    private projectService: IProjectService;
    private getToken: () => string | null;

    constructor(getToken: () => string | null) {
        this.projectService = createProjectService();
        this.getToken = getToken;
    }

    /**
     * Ensures a valid token is available
     * @throws Error if no token is available
     * @returns Valid authentication token
     */
    private ensureToken(): string {
        const token = this.getToken();
        if (!token) {
            throw new Error('Authentication token required for project operations');
        }
        return token;
    }

    /**
     * Create a new project
     * Automatically injects authentication token
     * 
     * @param request - Project creation request (userId, role, location)
     * @returns Promise<CreateProjectResponse> - Created project response
     */
    async createProject(request: CreateProjectRequest): Promise<CreateProjectResponse> {
        return this.projectService.createProject(request, this.ensureToken());
    }

    /**
     * Get all projects for a specific user ID (paginated)
     * Automatically injects authentication token
     * 
     * @param userId - ID of the user whose projects to retrieve
     * @param params - Optional pagination parameters
     * @returns Promise<PagedResponse<Project>> - Paginated response with projects and metadata
     */
    async getProjectsByUserId(userId: string, params?: PaginationParams): Promise<PagedResponse<Project>> {
        return this.projectService.getProjectsByUserId(userId, this.ensureToken(), params);
    }

    /**
     * Get a single project by ID
     * Automatically injects authentication token
     * 
     * @param projectId - ID of the project to retrieve
     * @returns Promise<Project> - The requested project
     * @throws Error if project not found
     */
    async getProjectById(projectId: string): Promise<Project> {
        return this.projectService.getProjectById(projectId, this.ensureToken());
    }
}

/**
 * Singleton instance of the raw service (without auth wrapper)
 * Use this when you have the token available directly
 * For component usage, prefer ProjectServiceWithAuth
 */
export const projectService = createProjectService();

/**
 * Default export for convenience
 */
export default ProjectServiceWithAuth;
