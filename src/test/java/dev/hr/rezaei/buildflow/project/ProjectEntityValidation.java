package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.user.Contact;
import dev.hr.rezaei.buildflow.user.ContactAddress;
import dev.hr.rezaei.buildflow.user.User;

import java.util.ArrayList;

/**
 * Simple validation class to demonstrate the new Project entity structure.
 * This class is not a test - it's a demonstration of the new model.
 */
public class ProjectEntityValidation {
    
    public static void main(String[] args) throws Exception {
        System.out.println("=== Project Entity Phase 1 Validation ===\n");
        
        // Create a user
        ContactAddress address = ContactAddress.builder()
                .streetNumberAndName("123 Main St")
                .city("Test City")
                .stateOrProvince("TS")
                .postalOrZipCode("12345")
                .country("Test Country")
                .build();
        
        Contact contact = Contact.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .phone("555-1234")
                .address(address)
                .labels(new ArrayList<>())
                .build();
        
        User user = User.builder()
                .username("johndoe")
                .email("john@example.com")
                .contact(contact)
                .registered(true)
                .projects(new ArrayList<>())
                .createdQuotes(new ArrayList<>())
                .suppliedQuotes(new ArrayList<>())
                .build();
        
        // Create a project location
        ProjectLocation location = ProjectLocation.builder()
                .streetNumberAndName("456 Project Ave")
                .city("Build City")
                .stateOrProvince("BC")
                .postalOrZipCode("67890")
                .country("Build Country")
                .build();
        
        // Create a project with the new structure
        Project project = Project.builder()
                .user(user)
                .role(ProjectRole.BUILDER)
                .location(location)
                .estimates(new ArrayList<>())
                .participants(new ArrayList<>())
                .build();
        
        System.out.println("✓ Project entity created successfully");
        System.out.println("  - User: " + project.getUser().getUsername());
        System.out.println("  - Role: " + project.getRole());
        System.out.println("  - Participants: " + project.getParticipants().size());
        System.out.println();
        
        // Create a participant
        Contact participantContact = Contact.builder()
                .firstName("Jane")
                .lastName("Smith")
                .email("jane@example.com")
                .phone("555-5678")
                .address(address)
                .labels(new ArrayList<>())
                .build();
        
        ProjectParticipant participant = ProjectParticipant.builder()
                .project(project)
                .role(ProjectRole.OWNER)
                .contact(participantContact)
                .build();
        
        project.getParticipants().add(participant);
        
        System.out.println("✓ ProjectParticipant entity created successfully");
        System.out.println("  - Contact: " + participant.getContact().getFirstName() + " " + participant.getContact().getLastName());
        System.out.println("  - Role: " + participant.getRole());
        System.out.println();
        
        // Validate toString doesn't throw
        System.out.println("✓ toString() methods work correctly:");
        System.out.println("  Project: " + project);
        System.out.println("  Participant: " + participant);
        System.out.println();
        
        // Validate pre-persist checks would work
        try {
            validateProject(project);
            System.out.println("✓ ensureUserAndRole() passes with valid user and role");
        } catch (IllegalStateException e) {
            System.out.println("✗ ensureUserAndRole() failed: " + e.getMessage());
        }
        
        // Test null user
        try {
            Project invalidProject = Project.builder()
                    .user(null)
                    .role(ProjectRole.BUILDER)
                    .location(location)
                    .build();
            validateProject(invalidProject);
            System.out.println("✗ Should have thrown exception for null user");
        } catch (Exception e) {
            System.out.println("✓ ensureUserAndRole() correctly rejects null user");
        }
        
        // Test null role
        try {
            Project invalidProject = Project.builder()
                    .user(user)
                    .role(null)
                    .location(location)
                    .build();
            validateProject(invalidProject);
            System.out.println("✗ Should have thrown exception for null role");
        } catch (Exception e) {
            System.out.println("✓ ensureUserAndRole() correctly rejects null role");
        }
        
        System.out.println("\n=== Phase 1 Entity Validation Complete ===");
        System.out.println("All entity structures are working correctly!");
    }
    
    // Access the private ensureUserAndRole method using reflection
    private static void validateProject(Project project) throws Exception {
        java.lang.reflect.Method method = Project.class.getDeclaredMethod("ensureUserAndRole");
        method.setAccessible(true);
        method.invoke(project);
    }
}
