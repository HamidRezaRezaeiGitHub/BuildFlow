// Re-export everything from ApiService for convenient imports
export * from './ApiService';
export { apiService as api } from './ApiService';

// Re-export everything from AuthService (using new factory pattern)
export * from './auth/authServiceFactory';
export { authService as auth } from './auth/authServiceFactory';

// Re-export everything from AdminService (using new factory pattern)
export * from './admin/adminServiceFactory';
export { adminService as admin} from './admin/adminServiceFactory';

// Re-export everything from ProjectService (using new factory pattern)
export * from './project/projectServiceFactory';
export { projectService as project } from './project/projectServiceFactory';

// Re-export timer service
export * from './TimerService';
export { timerService } from './TimerService';

// Re-export all DTOs from their respective modules
export * from './address';
export * from './contact';
export * from './user';
export * from './auth';
export * from './project';
export * from './estimate';
export * from './workitem';
export * from './quote';

// Re-export shared/infrastructure DTOs
export * from './MvcDtos';
export * from './PaginationDtos';
export * from './DateFilterDtos';
export * from './QueryParametersBuilder';

// Type aliases for MVC DTOs
export type { ErrorResponse as ApiErrorResponse } from './MvcDtos';
export type { MessageResponse as ApiMessageResponse } from './MvcDtos';

// Re-export API helpers
export * from './apiHelpers';

// Default export for the auth service (most commonly used)
export { authService as default } from './auth/authServiceFactory';
