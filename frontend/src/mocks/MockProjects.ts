import mockProjectsData from '../../../mock-data/Projects.json';
import { config } from '../config/environment';
import type { CreateProjectResponse, Project, ProjectLocationRequest } from '../services';

/**
 * Mock Projects Database - Canadian Projects
 * Loaded from /mock-data/Projects.json
 * Used when running in standalone mode (config.enableMockData = true)
 * 
 * Projects are distributed across 4 mock users:
 * - User ID '1' (admin) - Alexandre Dubois
 * - User ID '2' (testuser) - Sarah MacDonald
 * - User ID '3' (builder1) - Michael Chen
 * - User ID '4' (owner1) - Jennifer Martin
 */
export const mockProjects: Project[] = mockProjectsData as Project[];

/**
 * Find project by ID
 * Returns undefined if project is not found
 */
export function findProjectById(id: string): Project | undefined {
    return mockProjects.find(p => p.id === id);
}

/**
 * Find projects by user ID where user has any role
 * Returns array of projects (empty if none found)
 * 
 * This is the preferred method for finding all projects associated with a user,
 * regardless of their role. Use this instead of role-specific methods when you
 * want to see all projects a user is involved in.
 * 
 * @example
 * // Get all projects for user '1' (both BUILDER and OWNER roles)
 * const allUserProjects = findProjectsByUserId('1');
 */
export function findProjectsByUserId(userId: string): Project[] {
    return mockProjects.filter(p => p.userId === userId);
}

/**
 * Find projects by builder ID (legacy - finds projects where user is BUILDER)
 * Returns array of projects (empty if none found)
 */
export function findProjectsByBuilderId(builderId: string): Project[] {
    return mockProjects.filter(p => p.userId === builderId && p.role === 'BUILDER');
}

/**
 * Find projects by owner ID (legacy - finds projects where user is OWNER)
 * Returns array of projects (empty if none found)
 */
export function findProjectsByOwnerId(ownerId: string): Project[] {
    return mockProjects.filter(p => p.userId === ownerId && p.role === 'OWNER');
}

/**
 * Create a new mock project (simulates project creation)
 * Adds the project to the mock database and returns it
 * Matches backend ProjectController.createProject behavior
 * 
 * @param userId - ID of the user creating the project
 * @param role - Role of the user in the project (BUILDER or OWNER)
 * @param location - Project location details
 */
export function createMockProject(
    userId: string,
    role: string,
    location: ProjectLocationRequest
): Project {
    const newProjectId = String(mockProjects.length + 1);
    const now = new Date().toISOString();
    const newProject: Project = {
        id: newProjectId,
        userId,
        role,
        location: {
            id: newProjectId,
            unitNumber: location.unitNumber || '',
            streetNumberAndName: location.streetNumberAndName,
            city: location.city,
            stateOrProvince: location.stateOrProvince,
            postalOrZipCode: location.postalOrZipCode || '',
            country: location.country,
        },
        createdAt: now,
        lastUpdatedAt: now,
    };

    // Add to mock projects array
    mockProjects.push(newProject);

    // Log for development (will only show if console logs are enabled)
    if (config.enableConsoleLogs) {
        console.log(`[Mock Projects] Created new project with ID: ${newProjectId}`);
    }

    return newProject;
}

/**
 * Generate mock CreateProjectResponse
 */
export function generateMockCreateProjectResponse(project: Project): CreateProjectResponse {
    return {
        project: project,
    };
}
