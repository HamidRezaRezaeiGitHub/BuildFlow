import {
    createMockProject,
    findProjectById,
    findProjectsByBuilderId,
    findProjectsByOwnerId,
    generateMockCreateProjectResponse,
    mockProjects,
} from './MockProjects';
import type { ProjectDto, ProjectLocationRequestDto } from '../services/dtos';

describe('MockProjects', () => {
    // Store the original mockProjects array before each test
    let originalProjects: ProjectDto[];

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
                expect(project).toHaveProperty('builderId');
                expect(project).toHaveProperty('ownerId');
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

        test('MockProjects_shouldHaveValidBuilderAndOwnerIds_forAllProjects', () => {
            mockProjects.forEach(project => {
                expect(project.builderId).toBeTruthy();
                expect(project.ownerId).toBeTruthy();
                expect(typeof project.builderId).toBe('string');
                expect(typeof project.ownerId).toBe('string');
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
                expect(project.builderId).toBe('1');
            });
        });

        test('MockProjects_shouldReturnEmptyArray_whenNoProjectsFound', () => {
            const projects = findProjectsByBuilderId('999');
            expect(projects).toEqual([]);
        });

        test('MockProjects_shouldFindMultipleProjects_forBuilder', () => {
            const builder1Projects = findProjectsByBuilderId('1');
            const builder2Projects = findProjectsByBuilderId('2');
            const builder3Projects = findProjectsByBuilderId('3');
            const builder4Projects = findProjectsByBuilderId('4');
            
            expect(builder1Projects.length).toBeGreaterThan(0);
            expect(builder2Projects.length).toBeGreaterThan(0);
            expect(builder3Projects.length).toBeGreaterThan(0);
            expect(builder4Projects.length).toBeGreaterThan(0);
            
            // Verify all projects are accounted for
            const totalProjects = builder1Projects.length + builder2Projects.length + 
                                 builder3Projects.length + builder4Projects.length;
            expect(totalProjects).toBe(mockProjects.length);
        });
    });

    describe('findProjectsByOwnerId', () => {
        test('MockProjects_shouldFindProjects_whenValidOwnerIdProvided', () => {
            const projects = findProjectsByOwnerId('1');
            expect(projects.length).toBeGreaterThan(0);
            projects.forEach(project => {
                expect(project.ownerId).toBe('1');
            });
        });

        test('MockProjects_shouldReturnEmptyArray_whenNoProjectsFound', () => {
            const projects = findProjectsByOwnerId('999');
            expect(projects).toEqual([]);
        });

        test('MockProjects_shouldFindMultipleProjects_forOwner', () => {
            const owner1Projects = findProjectsByOwnerId('1');
            const owner2Projects = findProjectsByOwnerId('2');
            const owner3Projects = findProjectsByOwnerId('3');
            const owner4Projects = findProjectsByOwnerId('4');
            
            expect(owner1Projects.length).toBeGreaterThan(0);
            expect(owner2Projects.length).toBeGreaterThan(0);
            expect(owner3Projects.length).toBeGreaterThan(0);
            expect(owner4Projects.length).toBeGreaterThan(0);
            
            // Verify all projects are accounted for
            const totalProjects = owner1Projects.length + owner2Projects.length + 
                                 owner3Projects.length + owner4Projects.length;
            expect(totalProjects).toBe(mockProjects.length);
        });
    });

    describe('createMockProject', () => {
        test('MockProjects_shouldCreateNewProject_whenValidDataProvided', () => {
            const initialLength = mockProjects.length;
            const locationRequest: ProjectLocationRequestDto = {
                unitNumber: '101',
                streetNumberAndName: '123 Test Street',
                city: 'TestCity',
                stateOrProvince: 'BC',
                postalOrZipCode: 'T1T 1T1',
                country: 'Canada',
            };

            const newProject = createMockProject('1', '2', locationRequest);

            expect(newProject).toBeDefined();
            expect(newProject.id).toBe(String(initialLength + 1));
            expect(newProject.builderId).toBe('1');
            expect(newProject.ownerId).toBe('2');
            expect(newProject.location.streetNumberAndName).toBe('123 Test Street');
            expect(newProject.location.city).toBe('TestCity');
            expect(mockProjects.length).toBe(initialLength + 1);
        });

        test('MockProjects_shouldHandleOptionalFields_whenCreatingProject', () => {
            const locationRequest: ProjectLocationRequestDto = {
                streetNumberAndName: '456 Another Street',
                city: 'AnotherCity',
                stateOrProvince: 'ON',
                country: 'Canada',
            };

            const newProject = createMockProject('2', '1', locationRequest);

            expect(newProject.location.unitNumber).toBe('');
            expect(newProject.location.postalOrZipCode).toBe('');
        });

        test('MockProjects_shouldIncrementId_whenMultipleProjectsCreated', () => {
            const initialLength = mockProjects.length;
            const locationRequest: ProjectLocationRequestDto = {
                streetNumberAndName: 'Sequential Street',
                city: 'SequentialCity',
                stateOrProvince: 'AB',
                country: 'Canada',
            };

            const project1 = createMockProject('1', '1', locationRequest);
            const project2 = createMockProject('2', '2', locationRequest);

            expect(project1.id).toBe(String(initialLength + 1));
            expect(project2.id).toBe(String(initialLength + 2));
            expect(mockProjects.length).toBe(initialLength + 2);
        });
    });

    describe('generateMockCreateProjectResponse', () => {
        test('MockProjects_shouldGenerateResponse_whenProjectProvided', () => {
            const project = mockProjects[0];
            const response = generateMockCreateProjectResponse(project);

            expect(response).toHaveProperty('projectDto');
            expect(response.projectDto).toEqual(project);
        });

        test('MockProjects_shouldGenerateResponse_forNewlyCreatedProject', () => {
            const locationRequest: ProjectLocationRequestDto = {
                streetNumberAndName: 'Response Test Street',
                city: 'ResponseCity',
                stateOrProvince: 'QC',
                country: 'Canada',
            };

            const newProject = createMockProject('1', '2', locationRequest);
            const response = generateMockCreateProjectResponse(newProject);

            expect(response.projectDto.id).toBe(newProject.id);
            expect(response.projectDto.location.streetNumberAndName).toBe('Response Test Street');
        });
    });

    describe('Data integrity', () => {
        test('MockProjects_shouldMaintainDataIntegrity_afterMultipleOperations', () => {
            const initialCount = mockProjects.length;
            
            // Create a project
            const locationRequest: ProjectLocationRequestDto = {
                streetNumberAndName: 'Integrity Test Street',
                city: 'IntegrityCity',
                stateOrProvince: 'BC',
                country: 'Canada',
            };
            createMockProject('1', '1', locationRequest);

            // Find by builder
            const builderProjects = findProjectsByBuilderId('1');
            
            // Find by owner
            const ownerProjects = findProjectsByOwnerId('1');

            // Verify counts
            expect(mockProjects.length).toBe(initialCount + 1);
            expect(builderProjects.length).toBeGreaterThan(0);
            expect(ownerProjects.length).toBeGreaterThan(0);
        });

        test('MockProjects_shouldLinkToMockUsers_correctly', () => {
            // Mock users have IDs '1', '2', '3', and '4'
            const validUserIds = ['1', '2', '3', '4'];
            
            mockProjects.forEach(project => {
                expect(validUserIds).toContain(project.builderId);
                expect(validUserIds).toContain(project.ownerId);
            });
        });
    });
});
