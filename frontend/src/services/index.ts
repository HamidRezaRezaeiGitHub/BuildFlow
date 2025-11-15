// Re-export everything from ApiService for convenient imports
export * from './ApiService';
export { apiService as api } from './ApiService';

// Re-export everything from AuthService (using new factory pattern)
export * from './auth/authServiceFactory';
export { authService as auth } from './auth/authServiceFactory';

// Re-export everything from AdminService (using new factory pattern)
export * from './admin/adminServiceFactory';
export { adminService as admin} from './admin/adminServiceFactory';

// Re-export everything from ProjectService
export * from './ProjectService';
export { projectService as project } from './ProjectService';

// Re-export timer service
export * from './TimerService';
export { timerService } from './TimerService';

// Re-export all DTOs
export * from './dtos';

// Re-export API helpers
export * from './apiHelpers';

// Default export for the auth service (most commonly used)
export { authService as default } from './auth/authServiceFactory';
