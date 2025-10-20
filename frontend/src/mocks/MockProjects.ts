import type { CreateProjectResponse, ProjectDto, ProjectLocationRequestDto } from '../services/dtos';

/**
 * Mock Projects Database - Canadian Projects
 * Used when running in standalone mode (config.enableMockData = true)
 * 
 * Projects are linked to mock users:
 * - User ID '1' (admin) - Alexandre Dubois
 * - User ID '2' (testuser) - Sarah MacDonald
 */
export const mockProjects: ProjectDto[] = [
    {
        id: '1',
        builderId: '2', // Sarah MacDonald (testuser)
        ownerId: '1', // Alexandre Dubois (admin)
        location: {
            id: '1',
            unitNumber: '',
            streetNumberAndName: '456 Oak Avenue',
            city: 'Vancouver',
            stateOrProvince: 'BC',
            postalOrZipCode: 'V5K 2N1',
            country: 'Canada',
        },
    },
    {
        id: '2',
        builderId: '2', // Sarah MacDonald (testuser)
        ownerId: '2', // Sarah MacDonald (testuser) - acting as both builder and owner
        location: {
            id: '2',
            unitNumber: '302',
            streetNumberAndName: '789 Maple Street',
            city: 'Toronto',
            stateOrProvince: 'ON',
            postalOrZipCode: 'M4B 1B3',
            country: 'Canada',
        },
    },
    {
        id: '3',
        builderId: '1', // Alexandre Dubois (admin)
        ownerId: '2', // Sarah MacDonald (testuser)
        location: {
            id: '3',
            unitNumber: '',
            streetNumberAndName: '123 Pine Road',
            city: 'Calgary',
            stateOrProvince: 'AB',
            postalOrZipCode: 'T2P 1J9',
            country: 'Canada',
        },
    },
    {
        id: '4',
        builderId: '1', // Alexandre Dubois (admin)
        ownerId: '1', // Alexandre Dubois (admin) - acting as both builder and owner
        location: {
            id: '4',
            unitNumber: '5B',
            streetNumberAndName: '987 Cedar Lane',
            city: 'Montreal',
            stateOrProvince: 'QC',
            postalOrZipCode: 'H3A 1A1',
            country: 'Canada',
        },
    },
    {
        id: '5',
        builderId: '2', // Sarah MacDonald (testuser)
        ownerId: '1', // Alexandre Dubois (admin)
        location: {
            id: '5',
            unitNumber: '',
            streetNumberAndName: '555 Birch Boulevard',
            city: 'Ottawa',
            stateOrProvince: 'ON',
            postalOrZipCode: 'K1A 0B1',
            country: 'Canada',
        },
    },
];

/**
 * Find project by ID
 * Returns undefined if project is not found
 */
export function findProjectById(id: string): ProjectDto | undefined {
    return mockProjects.find(p => p.id === id);
}

/**
 * Find projects by builder ID
 * Returns array of projects (empty if none found)
 */
export function findProjectsByBuilderId(builderId: string): ProjectDto[] {
    return mockProjects.filter(p => p.builderId === builderId);
}

/**
 * Find projects by owner ID
 * Returns array of projects (empty if none found)
 */
export function findProjectsByOwnerId(ownerId: string): ProjectDto[] {
    return mockProjects.filter(p => p.ownerId === ownerId);
}

/**
 * Create a new mock project (simulates project creation)
 * Adds the project to the mock database and returns it
 */
export function createMockProject(
    builderId: string,
    ownerId: string,
    locationRequestDto: ProjectLocationRequestDto
): ProjectDto {
    const newProjectId = String(mockProjects.length + 1);
    const newProject: ProjectDto = {
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
    };

    // Add to mock projects array
    mockProjects.push(newProject);

    // Log for development (will only show if console logs are enabled)
    console.log(`[Mock Projects] Created new project with ID: ${newProjectId}`);

    return newProject;
}

/**
 * Generate mock CreateProjectResponse
 */
export function generateMockCreateProjectResponse(project: ProjectDto): CreateProjectResponse {
    return {
        projectDto: project,
    };
}
