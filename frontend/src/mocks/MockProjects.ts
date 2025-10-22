import mockProjectsData from '../../../mock-data/Projects.json';
import { config } from '../config/environment';
import type { CreateProjectResponse, Project, ProjectLocationRequest } from '../services/dtos';

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
 * Find projects by builder ID
 * Returns array of projects (empty if none found)
 */
export function findProjectsByBuilderId(builderId: string): Project[] {
    return mockProjects.filter(p => p.builderId === builderId);
}

/**
 * Find projects by owner ID
 * Returns array of projects (empty if none found)
 */
export function findProjectsByOwnerId(ownerId: string): Project[] {
    return mockProjects.filter(p => p.ownerId === ownerId);
}

/**
 * Create a new mock project (simulates project creation)
 * Adds the project to the mock database and returns it
 */
export function createMockProject(
    builderId: string,
    ownerId: string,
    locationRequestDto: ProjectLocationRequest
): Project {
    const newProjectId = String(mockProjects.length + 1);
    const now = new Date().toISOString();
    const newProject: Project = {
        id: newProjectId,
        builderId,
        ownerId,
        location: {
            id: newProjectId,
            unitNumber: locationRequestDto.unitNumber || '',
            streetNumberAndName: locationRequestDto.streetNumberAndName,
            city: locationRequestDto.city,
            stateOrProvince: locationRequestDto.stateOrProvince,
            postalOrZipCode: locationRequestDto.postalOrZipCode || '',
            country: locationRequestDto.country,
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
