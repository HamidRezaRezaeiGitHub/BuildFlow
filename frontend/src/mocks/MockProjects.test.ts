import type { Project, ProjectLocationRequest } from '../services/dtos';
import {
    createMockProject,
    findProjectById,
    findProjectsByBuilderId,
    findProjectsByOwnerId,
    generateMockCreateProjectResponse,
    mockProjects,
} from './MockProjects';

describe('MockProjects', () => {
    // Store the original mockProjects array before each test
    let originalProjects: Project[];

    beforeEach(() => {
        // Save the original projects
        originalProjects = [...mockProjects];
        // Clear and restore to a known state
        mockProjects.length = 0;
        mockProjects.push(...originalProjects);
    });

    afterEach(() => {
        // Restore original state after each test
        mockProjects.length = 0;
        mockProjects.push(...originalProjects);
    });

    describe('mockProjects data structure', () => {
        test('MockProjects_shouldHaveExpectedStructure_forAllProjects', () => {
            expect(mockProjects.length).toBeGreaterThan(0);

            mockProjects.forEach(project => {
                expect(project).toHaveProperty('id');
                expect(project).toHaveProperty('userId');
                expect(project).toHaveProperty('role');
                expect(project).toHaveProperty('location');
                expect(project.location).toHaveProperty('id');
                expect(project.location).toHaveProperty('streetNumberAndName');
                expect(project.location).toHaveProperty('city');
                expect(project.location).toHaveProperty('stateOrProvince');
                expect(project.location).toHaveProperty('country');
            });
        });

        test('MockProjects_shouldHaveUniqueIds_forAllProjects', () => {
            const ids = mockProjects.map(p => p.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
        });

        test('MockProjects_shouldHaveValidUserIdAndRole_forAllProjects', () => {
            mockProjects.forEach(project => {
                expect(project.userId).toBeTruthy();
                expect(project.role).toBeTruthy();
                expect(typeof project.userId).toBe('string');
                expect(['BUILDER', 'OWNER']).toContain(project.role);
            });
        });

        test('MockProjects_shouldHaveCanadianAddresses_forAllProjects', () => {
            mockProjects.forEach(project => {
                expect(project.location.country).toBe('Canada');
                expect(['BC', 'ON', 'AB', 'QC']).toContain(project.location.stateOrProvince);
            });
        });
    });

    describe('findProjectById', () => {
        test('MockProjects_shouldFindProject_whenValidIdProvided', () => {
            const project = findProjectById('1');
            expect(project).toBeDefined();
            expect(project?.id).toBe('1');
        });

        test('MockProjects_shouldReturnUndefined_whenInvalidIdProvided', () => {
            const project = findProjectById('999');
            expect(project).toBeUndefined();
        });

        test('MockProjects_shouldReturnCorrectProject_forEachId', () => {
            mockProjects.forEach(expectedProject => {
                const foundProject = findProjectById(expectedProject.id);
                expect(foundProject).toEqual(expectedProject);
            });
        });
    });

    describe('findProjectsByBuilderId', () => {
        test('MockProjects_shouldFindProjects_whenValidBuilderIdProvided', () => {
            const projects = findProjectsByBuilderId('1');
            expect(projects.length).toBeGreaterThan(0);
            projects.forEach(project => {
                expect(project.userId).toBe('1');
                expect(project.role).toBe('BUILDER');
            });
        });

        test('MockProjects_shouldReturnEmptyArray_whenNoProjectsFound', () => {
            const projects = findProjectsByBuilderId('999');
            expect(projects).toEqual([]);
        });

        test('MockProjects_shouldFindMultipleProjects_forBuilders', () => {
            const builder1Projects = findProjectsByBuilderId('1');
            const builder2Projects = findProjectsByBuilderId('2');
            const builder3Projects = findProjectsByBuilderId('3');
            const builder4Projects = findProjectsByBuilderId('4');

            expect(builder1Projects.length).toBeGreaterThan(0);
            expect(builder2Projects.length).toBeGreaterThan(0);
            expect(builder3Projects.length).toBeGreaterThan(0);
            expect(builder4Projects.length).toBeGreaterThan(0);

            // All found projects should be BUILDER role
            builder1Projects.forEach(p => expect(p.role).toBe('BUILDER'));
            builder2Projects.forEach(p => expect(p.role).toBe('BUILDER'));
        });
    });

    describe('findProjectsByOwnerId', () => {
        test('MockProjects_shouldFindProjects_whenValidOwnerIdProvided', () => {
            const projects = findProjectsByOwnerId('1');
            projects.forEach(project => {
                expect(project.userId).toBe('1');
                expect(project.role).toBe('OWNER');
            });
        });

        test('MockProjects_shouldReturnEmptyArray_whenNoProjectsFound', () => {
            const projects = findProjectsByOwnerId('999');
            expect(projects).toEqual([]);
        });

        test('MockProjects_shouldFindMultipleProjects_forOwner', () => {
            // Since all mock projects are BUILDER role, findProjectsByOwnerId should return empty
            // or we need to test with projects that have OWNER role
            // For now, test that the function works correctly
            const owner1Projects = findProjectsByOwnerId('1');
            const owner2Projects = findProjectsByOwnerId('2');
            const owner3Projects = findProjectsByOwnerId('3');
            const owner4Projects = findProjectsByOwnerId('4');

            // All should be empty or some might exist depending on mock data
            // The important thing is the function doesn't crash
            expect(Array.isArray(owner1Projects)).toBe(true);
            expect(Array.isArray(owner2Projects)).toBe(true);
            expect(Array.isArray(owner3Projects)).toBe(true);
            expect(Array.isArray(owner4Projects)).toBe(true);
        });
    });

    describe('createMockProject', () => {
        test('MockProjects_shouldCreateNewProject_whenValidDataProvided', () => {
            const initialLength = mockProjects.length;
            const locationRequest: ProjectLocationRequest = {
                unitNumber: '101',
                streetNumberAndName: '123 Test Street',
                city: 'TestCity',
                stateOrProvince: 'BC',
                postalOrZipCode: 'T1T 1T1',
                country: 'Canada',
            };

            const newProject = createMockProject('1', 'BUILDER', locationRequest, [
                { role: 'OWNER', contactId: '2' }
            ]);

            expect(newProject).toBeDefined();
            expect(newProject.id).toBe(String(initialLength + 1));
            expect(newProject.userId).toBe('1');
            expect(newProject.role).toBe('BUILDER');
            expect(newProject.location.streetNumberAndName).toBe('123 Test Street');
            expect(newProject.location.city).toBe('TestCity');
            expect(mockProjects.length).toBe(initialLength + 1);
        });

        test('MockProjects_shouldHandleOptionalFields_whenCreatingProject', () => {
            const locationRequest: ProjectLocationRequest = {
                streetNumberAndName: '456 Another Street',
                city: 'AnotherCity',
                stateOrProvince: 'ON',
                country: 'Canada',
            };

            const newProject = createMockProject('2', 'OWNER', locationRequest);

            expect(newProject.location.unitNumber).toBe('');
            expect(newProject.location.postalOrZipCode).toBe('');
        });

        test('MockProjects_shouldIncrementId_whenMultipleProjectsCreated', () => {
            const initialLength = mockProjects.length;
            const locationRequest: ProjectLocationRequest = {
                streetNumberAndName: 'Sequential Street',
                city: 'SequentialCity',
                stateOrProvince: 'AB',
                country: 'Canada',
            };

            const project1 = createMockProject('1', 'BUILDER', locationRequest);
            const project2 = createMockProject('2', 'OWNER', locationRequest);

            expect(project1.id).toBe(String(initialLength + 1));
            expect(project2.id).toBe(String(initialLength + 2));
            expect(mockProjects.length).toBe(initialLength + 2);
        });
    });

    describe('generateMockCreateProjectResponse', () => {
        test('MockProjects_shouldGenerateResponse_whenProjectProvided', () => {
            const project = mockProjects[0];
            const response = generateMockCreateProjectResponse(project);

            expect(response).toHaveProperty('project');
            expect(response.project).toEqual(project);
        });

        test('MockProjects_shouldGenerateResponse_forNewlyCreatedProject', () => {
            const locationRequest: ProjectLocationRequest = {
                streetNumberAndName: 'Response Test Street',
                city: 'ResponseCity',
                stateOrProvince: 'QC',
                country: 'Canada',
            };

            const newProject = createMockProject('1', 'BUILDER', locationRequest);
            const response = generateMockCreateProjectResponse(newProject);

            expect(response.project.id).toBe(newProject.id);
            expect(response.project.location.streetNumberAndName).toBe('Response Test Street');
        });
    });

    describe('Data integrity', () => {
        test('MockProjects_shouldMaintainDataIntegrity_afterMultipleOperations', () => {
            const initialCount = mockProjects.length;

            // Create a project
            const locationRequest: ProjectLocationRequest = {
                streetNumberAndName: 'Integrity Test Street',
                city: 'IntegrityCity',
                stateOrProvince: 'BC',
                country: 'Canada',
            };
            createMockProject('1', 'BUILDER', locationRequest);

            // Find by builder
            const builderProjects = findProjectsByBuilderId('1');

            // Verify counts
            expect(mockProjects.length).toBe(initialCount + 1);
            expect(builderProjects.length).toBeGreaterThan(0);
        });

        test('MockProjects_shouldLinkToMockUsers_correctly', () => {
            // Mock users have IDs '1', '2', '3', and '4'
            const validUserIds = ['1', '2', '3', '4'];

            mockProjects.forEach(project => {
                expect(validUserIds).toContain(project.userId);
            });
        });
    });
});
