/**
 * Project module exports
 */

export type {
  ProjectRole,
  ProjectParticipant,
  CreateProjectParticipantRequest,
  ProjectLocationRequest,
  CreateProjectRequest,
  Project,
  ProjectLocation,
  CreateProjectResponse
} from './ProjectDtos';

export type { IProjectService } from './IProjectService';
export { projectService } from './projectServiceFactory';
