import { config } from '../config/environment';
import type { CreateProjectResponse, Project, ProjectLocationRequest } from '../services/dtos';

/**
 * Mock Projects Database - Canadian Projects
 * Used when running in standalone mode (config.enableMockData = true)
 * 
 * Projects are distributed across 4 mock users:
 * - User ID '1' (admin) - Alexandre Dubois
 * - User ID '2' (testuser) - Sarah MacDonald
 * - User ID '3' (builder1) - Michael Chen
 * - User ID '4' (owner1) - Jennifer Martin
 */
export const mockProjects: Project[] = [
    // Admin as builder (5 projects)
    {
        id: '1',
        builderId: '1', // Alexandre Dubois (admin)
        ownerId: '4', // Jennifer Martin (owner1)
        location: {
            id: '1',
            unitNumber: '',
            streetNumberAndName: '456 Oak Avenue',
            city: 'Vancouver',
            stateOrProvince: 'BC',
            postalOrZipCode: 'V5K 2N1',
            country: 'Canada',
        },
        createdAt: '2024-01-15T10:30:00Z',
        lastUpdatedAt: '2024-10-18T14:20:00Z',
    },
    {
        id: '2',
        builderId: '1', // Alexandre Dubois (admin)
        ownerId: '2', // Sarah MacDonald (testuser)
        location: {
            id: '2',
            unitNumber: '302',
            streetNumberAndName: '789 Maple Street',
            city: 'Toronto',
            stateOrProvince: 'ON',
            postalOrZipCode: 'M4B 1B3',
            country: 'Canada',
        },
        createdAt: '2024-02-20T08:15:00Z',
        lastUpdatedAt: '2024-10-19T16:45:00Z',
    },
    {
        id: '3',
        builderId: '1', // Alexandre Dubois (admin)
        ownerId: '3', // Michael Chen (builder1)
        location: {
            id: '3',
            unitNumber: '',
            streetNumberAndName: '123 Pine Road',
            city: 'Calgary',
            stateOrProvince: 'AB',
            postalOrZipCode: 'T2P 1J9',
            country: 'Canada',
        },
        createdAt: '2024-03-10T11:00:00Z',
        lastUpdatedAt: '2024-10-17T09:30:00Z',
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
        createdAt: '2024-04-05T14:20:00Z',
        lastUpdatedAt: '2024-10-20T11:15:00Z',
    },
    {
        id: '5',
        builderId: '1', // Alexandre Dubois (admin)
        ownerId: '4', // Jennifer Martin (owner1)
        location: {
            id: '5',
            unitNumber: '',
            streetNumberAndName: '555 Birch Boulevard',
            city: 'Ottawa',
            stateOrProvince: 'ON',
            postalOrZipCode: 'K1A 0B1',
            country: 'Canada',
        },
        createdAt: '2024-05-12T09:45:00Z',
        lastUpdatedAt: '2024-10-16T13:50:00Z',
    },
    // Testuser as builder (6 projects)
    {
        id: '6',
        builderId: '2', // Sarah MacDonald (testuser)
        ownerId: '1', // Alexandre Dubois (admin)
        location: {
            id: '6',
            unitNumber: '12A',
            streetNumberAndName: '234 Hastings Street',
            city: 'Vancouver',
            stateOrProvince: 'BC',
            postalOrZipCode: 'V6B 1H6',
            country: 'Canada',
        },
        createdAt: '2024-01-25T13:10:00Z',
        lastUpdatedAt: '2024-10-19T10:25:00Z',
    },
    {
        id: '7',
        builderId: '2', // Sarah MacDonald (testuser)
        ownerId: '4', // Jennifer Martin (owner1)
        location: {
            id: '7',
            unitNumber: '',
            streetNumberAndName: '678 Yonge Street',
            city: 'Toronto',
            stateOrProvince: 'ON',
            postalOrZipCode: 'M4Y 2A5',
            country: 'Canada',
        },
        createdAt: '2024-02-18T15:30:00Z',
        lastUpdatedAt: '2024-10-20T08:45:00Z',
    },
    {
        id: '8',
        builderId: '2', // Sarah MacDonald (testuser)
        ownerId: '3', // Michael Chen (builder1)
        location: {
            id: '8',
            unitNumber: '45',
            streetNumberAndName: '910 17th Avenue SW',
            city: 'Calgary',
            stateOrProvince: 'AB',
            postalOrZipCode: 'T2T 0A3',
            country: 'Canada',
        },
        createdAt: '2024-03-22T12:00:00Z',
        lastUpdatedAt: '2024-10-18T17:10:00Z',
    },
    {
        id: '9',
        builderId: '2', // Sarah MacDonald (testuser)
        ownerId: '2', // Sarah MacDonald (testuser) - acting as both builder and owner
        location: {
            id: '9',
            unitNumber: '',
            streetNumberAndName: '345 Rue Notre-Dame',
            city: 'Montreal',
            stateOrProvince: 'QC',
            postalOrZipCode: 'H2Y 1C6',
            country: 'Canada',
        },
        createdAt: '2024-04-14T10:15:00Z',
        lastUpdatedAt: '2024-10-17T14:30:00Z',
    },
    {
        id: '10',
        builderId: '2', // Sarah MacDonald (testuser)
        ownerId: '1', // Alexandre Dubois (admin)
        location: {
            id: '10',
            unitNumber: '8B',
            streetNumberAndName: '567 Rideau Street',
            city: 'Ottawa',
            stateOrProvince: 'ON',
            postalOrZipCode: 'K1N 5Y8',
            country: 'Canada',
        },
        createdAt: '2024-05-03T16:40:00Z',
        lastUpdatedAt: '2024-10-19T12:55:00Z',
    },
    {
        id: '11',
        builderId: '2', // Sarah MacDonald (testuser)
        ownerId: '4', // Jennifer Martin (owner1)
        location: {
            id: '11',
            unitNumber: '',
            streetNumberAndName: '890 Main Street',
            city: 'Vancouver',
            stateOrProvince: 'BC',
            postalOrZipCode: 'V5T 3A8',
            country: 'Canada',
        },
        createdAt: '2024-06-08T11:20:00Z',
        lastUpdatedAt: '2024-10-20T15:40:00Z',
    },
    // Builder1 as builder (5 projects)
    {
        id: '12',
        builderId: '3', // Michael Chen (builder1)
        ownerId: '1', // Alexandre Dubois (admin)
        location: {
            id: '12',
            unitNumber: '23',
            streetNumberAndName: '432 Bloor Street West',
            city: 'Toronto',
            stateOrProvince: 'ON',
            postalOrZipCode: 'M5S 1X5',
            country: 'Canada',
        },
        createdAt: '2024-02-05T09:25:00Z',
        lastUpdatedAt: '2024-10-18T11:40:00Z',
    },
    {
        id: '13',
        builderId: '3', // Michael Chen (builder1)
        ownerId: '2', // Sarah MacDonald (testuser)
        location: {
            id: '13',
            unitNumber: '',
            streetNumberAndName: '765 Macleod Trail',
            city: 'Calgary',
            stateOrProvince: 'AB',
            postalOrZipCode: 'T2G 2M7',
            country: 'Canada',
        },
        createdAt: '2024-03-18T14:35:00Z',
        lastUpdatedAt: '2024-10-19T09:20:00Z',
    },
    {
        id: '14',
        builderId: '3', // Michael Chen (builder1)
        ownerId: '4', // Jennifer Martin (owner1)
        location: {
            id: '14',
            unitNumber: '100',
            streetNumberAndName: '321 Rue Sherbrooke',
            city: 'Montreal',
            stateOrProvince: 'QC',
            postalOrZipCode: 'H2X 1X7',
            country: 'Canada',
        },
        createdAt: '2024-04-22T08:50:00Z',
        lastUpdatedAt: '2024-10-20T13:15:00Z',
    },
    {
        id: '15',
        builderId: '3', // Michael Chen (builder1)
        ownerId: '3', // Michael Chen (builder1) - acting as both builder and owner
        location: {
            id: '15',
            unitNumber: '',
            streetNumberAndName: '654 Elgin Street',
            city: 'Ottawa',
            stateOrProvince: 'ON',
            postalOrZipCode: 'K1P 5K7',
            country: 'Canada',
        },
        createdAt: '2024-05-28T12:05:00Z',
        lastUpdatedAt: '2024-10-17T16:25:00Z',
    },
    {
        id: '16',
        builderId: '3', // Michael Chen (builder1)
        ownerId: '1', // Alexandre Dubois (admin)
        location: {
            id: '16',
            unitNumber: '5',
            streetNumberAndName: '987 Broadway',
            city: 'Vancouver',
            stateOrProvince: 'BC',
            postalOrZipCode: 'V5Z 1K1',
            country: 'Canada',
        },
        createdAt: '2024-06-15T10:30:00Z',
        lastUpdatedAt: '2024-10-19T14:50:00Z',
    },
    // Owner1 as builder (4 projects)
    {
        id: '17',
        builderId: '4', // Jennifer Martin (owner1)
        ownerId: '2', // Sarah MacDonald (testuser)
        location: {
            id: '17',
            unitNumber: '',
            streetNumberAndName: '123 College Street',
            city: 'Toronto',
            stateOrProvince: 'ON',
            postalOrZipCode: 'M5G 1L7',
            country: 'Canada',
        },
        createdAt: '2024-03-08T11:45:00Z',
        lastUpdatedAt: '2024-10-18T10:05:00Z',
    },
    {
        id: '18',
        builderId: '4', // Jennifer Martin (owner1)
        ownerId: '3', // Michael Chen (builder1)
        location: {
            id: '18',
            unitNumber: '42',
            streetNumberAndName: '456 Bow Trail',
            city: 'Calgary',
            stateOrProvince: 'AB',
            postalOrZipCode: 'T3C 2E6',
            country: 'Canada',
        },
        createdAt: '2024-04-12T15:20:00Z',
        lastUpdatedAt: '2024-10-20T12:35:00Z',
    },
    {
        id: '19',
        builderId: '4', // Jennifer Martin (owner1)
        ownerId: '4', // Jennifer Martin (owner1) - acting as both builder and owner
        location: {
            id: '19',
            unitNumber: '',
            streetNumberAndName: '789 Avenue du Mont-Royal',
            city: 'Montreal',
            stateOrProvince: 'QC',
            postalOrZipCode: 'H2J 1W8',
            country: 'Canada',
        },
        createdAt: '2024-05-20T09:10:00Z',
        lastUpdatedAt: '2024-10-19T15:45:00Z',
    },
    {
        id: '20',
        builderId: '4', // Jennifer Martin (owner1)
        ownerId: '1', // Alexandre Dubois (admin)
        location: {
            id: '20',
            unitNumber: '12',
            streetNumberAndName: '234 Laurier Avenue',
            city: 'Ottawa',
            stateOrProvince: 'ON',
            postalOrZipCode: 'K1P 6M7',
            country: 'Canada',
        },
        createdAt: '2024-06-25T13:30:00Z',
        lastUpdatedAt: '2024-10-20T09:55:00Z',
    },
];

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
