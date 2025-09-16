package dev.hr.rezaei.buildflow.config.security;

import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserMockDataInitializer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@ConditionalOnBean(UserMockDataInitializer.class)
@DependsOn("userMockDataInitializer")
public class MockDataInitializer {

    private final UserMockDataInitializer userMockDataInitializer;

    public MockDataInitializer(UserMockDataInitializer userMockDataInitializer) {
        this.userMockDataInitializer = userMockDataInitializer;
        initializeMockDataCoordination();
    }

    private void initializeMockDataCoordination() {
        log.info("Starting mock data initialization coordination...");
        
        try {
            // At this point, UserMockDataInitializer has already run because
            // it's a constructor dependency, so we can safely access the results
            Map<String, List<User>> mockUsers = userMockDataInitializer.getMockUsers();
            
            if (mockUsers.isEmpty()) {
                log.info("No mock users were created.");
            } else {
                int totalUsers = mockUsers.values().stream()
                    .mapToInt(List::size)
                    .sum();
                log.info("Mock data coordination completed successfully. Found {} users across {} roles.",
                    totalUsers, mockUsers.size());
                
                // Log summary by role
                mockUsers.forEach((role, users) -> 
                    log.info("  - Role '{}': {} users", role, users.size())
                );
            }
            
        } catch (Exception e) {
            log.error("Error occurred during mock data coordination: {}", e.getMessage(), e);
            // Don't rethrow - this is just a coordinator, the actual initialization should proceed
        }
    }
}