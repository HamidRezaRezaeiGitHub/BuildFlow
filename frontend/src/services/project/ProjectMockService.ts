import { config } from '@/config/environment';
import {
    createMockProject,
    findProjectById,
    findProjectsByUserId,
    generateMockCreateProjectResponse,
} from '@/mocks/MockProjects';
import {
    CreateProjectRequest,
    CreateProjectResponse,
    Project,
    PagedResponse,
    PaginationParams
} from '../dtos';
import { IProjectService } from './IProjectService';

/**
 * Mock ProjectService implementation
 * Uses in-memory mock data instead of making HTTP calls
 * Used when config.enableMockData is true (standalone mode)
 * 
 * This implementation simulates:
 * - Network delays (300-500ms)
 * - Pagination logic
 * - Data validation
 * 
 * All methods work without requiring a real backend connection
 */
export class ProjectMockService implements IProjectService {
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
        const page = params?.page || ProjectMockService.DEFAULT_PAGE;
        const size = params?.size || ProjectMockService.DEFAULT_SIZE;
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
     * Create a new project (mock implementation)
     * Simulates project creation with 500ms delay
     * 
     * @param request - Project creation request (userId, role, location)
     * @param _token - JWT authentication token (ignored in mock mode)
     * @returns Promise<CreateProjectResponse> - Created project response
     */
    async createProject(request: CreateProjectRequest, _token: string): Promise<CreateProjectResponse> {
        if (config.enableConsoleLogs) {
            console.log('[ProjectMockService] Creating mock project');
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                const { userId, role, location } = request;
                const newProject = createMockProject(userId, role, location, []);
                resolve(generateMockCreateProjectResponse(newProject));
            }, 500); // Simulate network delay
        });
    }

    /**
     * Get all projects for a specific user ID (mock implementation)
     * Simulates paginated project retrieval with 300ms delay
     * 
     * @param userId - ID of the user whose projects to retrieve
     * @param _token - JWT authentication token (ignored in mock mode)
     * @param params - Optional pagination parameters (page, size, orderBy, direction)
     * @returns Promise<PagedResponse<Project>> - Paginated response with projects and metadata
     */
    async getProjectsByUserId(
        userId: string,
        _token: string,
        params?: PaginationParams
    ): Promise<PagedResponse<Project>> {
        if (config.enableConsoleLogs) {
            console.log('[ProjectMockService] Getting mock projects for user:', userId);
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                const allProjects = findProjectsByUserId(userId);
                resolve(this.simulatePagination(allProjects, params));
            }, 300); // Simulate network delay
        });
    }

    /**
     * Get a single project by ID (mock implementation)
     * Simulates project retrieval with 300ms delay
     * 
     * @param projectId - ID of the project to retrieve
     * @param _token - JWT authentication token (ignored in mock mode)
     * @returns Promise<Project> - The requested project
     * @throws Error if project not found
     */
    async getProjectById(projectId: string, _token: string): Promise<Project> {
        if (config.enableConsoleLogs) {
            console.log('[ProjectMockService] Getting mock project by ID:', projectId);
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
}
