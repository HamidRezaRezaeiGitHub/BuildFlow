import { config } from '@/config/environment';
import {
    createMockProject,
    findProjectById,
    findProjectsByBuilderId,
    findProjectsByOwnerId,
    generateMockCreateProjectResponse,
} from '@/mocks/MockProjects';
import { apiService } from './ApiService';
import { 
    CreateProjectRequest, 
    CreateProjectResponse, 
    Project,
    PagedResponse,
    PaginationParams,
    buildPaginationQuery,
    extractPaginationMetadata
} from './dtos';

/**
 * ProjectService class that handles all project-related API operations
 * Uses the generic ApiService for HTTP communications while focusing on project business logic
 * 
 * Environment-aware: Uses mock data when config.enableMockData is true (standalone mode)
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
     * Default pagination values
     */
    private static readonly DEFAULT_PAGE = 0;
    private static readonly DEFAULT_SIZE = 25;

    /**
     * Simulates pagination for mock data
     * @param allProjects - Complete list of projects to paginate
     * @param params - Optional pagination parameters
     * @returns Paginated response with metadata
     */
    private simulatePagination(allProjects: Project[], params?: PaginationParams): PagedResponse<Project> {
        const page = params?.page || ProjectService.DEFAULT_PAGE;
        const size = params?.size || ProjectService.DEFAULT_SIZE;
        const start = page * size;
        const end = start + size;
        const paginatedProjects = allProjects.slice(start, end);
        
        const totalElements = allProjects.length;
        const totalPages = Math.ceil(totalElements / size);
        
        return {
            content: paginatedProjects,
            pagination: {
                page,
                size,
                totalElements,
                totalPages,
                hasNext: page < totalPages - 1,
                hasPrevious: page > 0,
                isFirst: page === 0,
                isLast: page >= totalPages - 1 || totalPages === 0,
            }
        };
    }

    /**
     * Create a new project
     * Requires CREATE_PROJECT authority
     * Environment-aware: Uses mock data when config.enableMockData is true
     * 
     * @param request - Project creation request data
     * @param token - JWT authentication token (ignored in mock mode)
     * @returns Promise<CreateProjectResponse> - Created project response with project details
     */
    async createProject(request: CreateProjectRequest, token: string): Promise<CreateProjectResponse> {
        // Use mock project creation in standalone mode
        if (config.enableMockData) {
            if (config.enableConsoleLogs) {
                console.log('[ProjectService] Using mock project creation');
            }

            return new Promise((resolve) => {
                setTimeout(() => {
                    const { userId, isBuilder, locationRequestDto } = request;
                    
                    // Determine builderId and ownerId based on isBuilder flag
                    const builderId = isBuilder ? userId : '1'; // Default to admin as builder
                    const ownerId = isBuilder ? '1' : userId; // Default to admin as owner
                    
                    const newProject = createMockProject(builderId, ownerId, locationRequestDto);
                    resolve(generateMockCreateProjectResponse(newProject));
                }, 500); // Simulate network delay
            });
        }

        // Real API call in integrated mode
        return apiService.create<CreateProjectResponse>('/api/v1/projects', request, token);
    }

    /**
     * Get all projects for a specific builder (legacy method - no pagination)
     * Requires VIEW_PROJECT authority
     * 
     * @deprecated Use getProjectsByBuilderIdPaginated for pagination support
     * @param builderId - ID of the builder whose projects to retrieve
     * @param token - JWT authentication token
     * @returns Promise<Project[]> - Array of projects assigned to the builder
     */
    async getProjectsByBuilderId(builderId: string, token: string): Promise<Project[]> {
        // Call paginated version and return just the content
        const pagedResponse = await this.getProjectsByBuilderIdPaginated(builderId, token);
        return pagedResponse.content;
    }

    /**
     * Get paginated projects for a specific builder
     * Requires VIEW_PROJECT authority
     * Environment-aware: Uses mock data when config.enableMockData is true
     * 
     * @param builderId - ID of the builder whose projects to retrieve
     * @param token - JWT authentication token (ignored in mock mode)
     * @param params - Optional pagination parameters (page, size, orderBy, direction)
     * @returns Promise<PagedResponse<Project>> - Paginated response with projects and metadata
     */
    async getProjectsByBuilderIdPaginated(
        builderId: string, 
        token: string,
        params?: PaginationParams
    ): Promise<PagedResponse<Project>> {
        // Use mock data in standalone mode
        if (config.enableMockData) {
            if (config.enableConsoleLogs) {
                console.log('[ProjectService] Getting mock projects for builder:', builderId);
            }

            return new Promise((resolve) => {
                setTimeout(() => {
                    const allProjects = findProjectsByBuilderId(builderId);
                    resolve(this.simulatePagination(allProjects, params));
                }, 300); // Simulate network delay
            });
        }

        // Real API call in integrated mode
        const endpoint = `/api/v1/projects/builder/${encodeURIComponent(builderId)}${buildPaginationQuery(params)}`;
        
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
     * Get all projects for a specific owner (legacy method - no pagination)
     * Requires VIEW_PROJECT authority
     * 
     * @deprecated Use getProjectsByOwnerIdPaginated for pagination support
     * @param ownerId - ID of the owner whose projects to retrieve
     * @param token - JWT authentication token
     * @returns Promise<Project[]> - Array of projects owned by the property owner
     */
    async getProjectsByOwnerId(ownerId: string, token: string): Promise<Project[]> {
        // Call paginated version and return just the content
        const pagedResponse = await this.getProjectsByOwnerIdPaginated(ownerId, token);
        return pagedResponse.content;
    }

    /**
     * Get paginated projects for a specific owner
     * Requires VIEW_PROJECT authority
     * Environment-aware: Uses mock data when config.enableMockData is true
     * 
     * @param ownerId - ID of the owner whose projects to retrieve
     * @param token - JWT authentication token (ignored in mock mode)
     * @param params - Optional pagination parameters (page, size, orderBy, direction)
     * @returns Promise<PagedResponse<Project>> - Paginated response with projects and metadata
     */
    async getProjectsByOwnerIdPaginated(
        ownerId: string, 
        token: string,
        params?: PaginationParams
    ): Promise<PagedResponse<Project>> {
        // Use mock data in standalone mode
        if (config.enableMockData) {
            if (config.enableConsoleLogs) {
                console.log('[ProjectService] Getting mock projects for owner:', ownerId);
            }

            return new Promise((resolve) => {
                setTimeout(() => {
                    const allProjects = findProjectsByOwnerId(ownerId);
                    resolve(this.simulatePagination(allProjects, params));
                }, 300); // Simulate network delay
            });
        }

        // Real API call in integrated mode
        const endpoint = `/api/v1/projects/owner/${encodeURIComponent(ownerId)}${buildPaginationQuery(params)}`;
        
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
     * Environment-aware: Uses mock data when config.enableMockData is true
     * 
     * @param projectId - ID of the project to retrieve
     * @param token - JWT authentication token (ignored in mock mode)
     * @returns Promise<Project> - The requested project
     * @throws Error if project not found
     */
    async getProjectById(projectId: string, token: string): Promise<Project> {
        // Use mock data in standalone mode
        if (config.enableMockData) {
            if (config.enableConsoleLogs) {
                console.log('[ProjectService] Getting mock project by ID:', projectId);
            }

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const project = findProjectById(projectId);
                    
                    if (!project) {
                        reject(new Error(`Project with ID ${projectId} not found`));
                        return;
                    }
                    
                    resolve(project);
                }, 300); // Simulate network delay
            });
        }

        // Real API call in integrated mode
        return apiService.get<Project>(`/api/v1/projects/${encodeURIComponent(projectId)}`, token);
    }

    /**
     * Get combined projects where user is either builder OR owner (server-side filtering and pagination)
     * Calls the backend combined endpoint which handles de-duplication, filtering, and sorting on the server
     * 
     * @param userId - ID of the user whose projects to retrieve
     * @param token - JWT authentication token (ignored in mock mode)
     * @param scope - 'builder', 'owner', or 'both' (default: both)
     * @param createdAfter - Optional ISO-8601 date string for created after filter
     * @param createdBefore - Optional ISO-8601 date string for created before filter
     * @param params - Optional pagination parameters (page, size, orderBy, direction)
     * @returns Promise<PagedResponse<Project>> - Server-side paginated response with filtered, de-duplicated, and sorted projects
     */
    async getCombinedProjectsPaginated(
        userId: string,
        token: string,
        scope: 'builder' | 'owner' | 'both' = 'both',
        createdAfter?: string,
        createdBefore?: string,
        params?: PaginationParams
    ): Promise<PagedResponse<Project>> {
        // Use mock data in standalone mode
        if (config.enableMockData) {
            if (config.enableConsoleLogs) {
                console.log('[ProjectService] Using mock combined projects for user:', userId, 'scope:', scope);
            }

            return new Promise((resolve) => {
                setTimeout(() => {
                    // Get projects based on scope
                    let allProjects: Project[] = [];
                    if (scope === 'builder') {
                        allProjects = findProjectsByBuilderId(userId);
                    } else if (scope === 'owner') {
                        allProjects = findProjectsByOwnerId(userId);
                    } else {
                        // Combine and de-duplicate
                        const builderProjects = findProjectsByBuilderId(userId);
                        const ownerProjects = findProjectsByOwnerId(userId);
                        const projectMap = new Map<string, Project>();
                        builderProjects.forEach(p => projectMap.set(p.id, p));
                        ownerProjects.forEach(p => projectMap.set(p.id, p));
                        allProjects = Array.from(projectMap.values());
                    }
                    
                    // Apply date filters
                    if (createdAfter) {
                        const afterDate = new Date(createdAfter);
                        allProjects = allProjects.filter(p => new Date(p.createdAt) >= afterDate);
                    }
                    if (createdBefore) {
                        const beforeDate = new Date(createdBefore);
                        allProjects = allProjects.filter(p => new Date(p.createdAt) <= beforeDate);
                    }
                    
                    // Sort by lastUpdatedAt DESC
                    allProjects.sort((a, b) => {
                        const dateA = new Date(a.lastUpdatedAt).getTime();
                        const dateB = new Date(b.lastUpdatedAt).getTime();
                        return dateB - dateA;
                    });
                    
                    resolve(this.simulatePagination(allProjects, params));
                }, 300); // Simulate network delay
            });
        }

        // Real API call in integrated mode
        let queryParams = buildPaginationQuery(params);
        
        // Add filter parameters
        const filterParams = new URLSearchParams();
        if (scope) {
            filterParams.append('scope', scope);
        }
        if (createdAfter) {
            filterParams.append('createdFrom', createdAfter);
        }
        if (createdBefore) {
            filterParams.append('createdTo', createdBefore);
        }
        
        const filterQuery = filterParams.toString();
        if (filterQuery) {
            queryParams = queryParams ? `${queryParams}&${filterQuery}` : `?${filterQuery}`;
        }
        
        const endpoint = `/api/v1/projects/combined/${encodeURIComponent(userId)}${queryParams}`;
        
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

    async getProjectById(projectId: string): Promise<Project> {
        return this.projectService.getProjectById(projectId, this.ensureToken());
    }

    async getProjectsByBuilderId(builderId: string): Promise<Project[]> {
        return this.projectService.getProjectsByBuilderId(builderId, this.ensureToken());
    }

    async getProjectsByBuilderIdPaginated(
        builderId: string,
        params?: PaginationParams
    ): Promise<PagedResponse<Project>> {
        return this.projectService.getProjectsByBuilderIdPaginated(builderId, this.ensureToken(), params);
    }

    async getProjectsByOwnerId(ownerId: string): Promise<Project[]> {
        return this.projectService.getProjectsByOwnerId(ownerId, this.ensureToken());
    }

    async getProjectsByOwnerIdPaginated(
        ownerId: string,
        params?: PaginationParams
    ): Promise<PagedResponse<Project>> {
        return this.projectService.getProjectsByOwnerIdPaginated(ownerId, this.ensureToken(), params);
    }

    async getCombinedProjectsPaginated(
        userId: string,
        scope: 'builder' | 'owner' | 'both' = 'both',
        createdAfter?: string,
        createdBefore?: string,
        params?: PaginationParams
    ): Promise<PagedResponse<Project>> {
        return this.projectService.getCombinedProjectsPaginated(
            userId, 
            this.ensureToken(), 
            scope, 
            createdAfter, 
            createdBefore, 
            params
        );
    }
}

// Create and export a singleton instance of the raw service
export const projectService = new ProjectService();

// Also export the class for testing or custom instances
export default ProjectService;
