package dev.hr.rezaei.buildflow.config.security;

import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserMockDataInitializer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnBean(UserMockDataInitializer.class)
@DependsOn("userMockDataInitializer")
public class MockDataInitializer implements ApplicationRunner {

    @Autowired(required = false)
    private UserMockDataInitializer userMockDataInitializer;

    @Override
    public void run(ApplicationArguments args) {
        if (userMockDataInitializer == null) {
            log.info("UserMockDataInitializer bean not available, skipping mock data initialization.");
            return;
        }

        log.info("Starting mock data initialization process...");
        
        try {
            // The UserMockDataInitializer will run automatically via ApplicationRunner
            // but we can access the results here for additional coordination
            Map<String, List<User>> mockUsers = userMockDataInitializer.getMockUsers();
            
            if (mockUsers.isEmpty()) {
                log.info("No mock users were created.");
            } else {
                int totalUsers = mockUsers.values().stream()
                    .mapToInt(List::size)
                    .sum();
                log.info("Mock data initialization completed successfully. Created {} users across {} roles.",
                    totalUsers, mockUsers.size());
                
                // Log summary by role
                mockUsers.forEach((role, users) -> 
                    log.info("  - Role '{}': {} users", role, users.size())
                );
            }
            
        } catch (Exception e) {
            log.error("Error occurred during mock data initialization coordination: {}", e.getMessage(), e);
            // Don't rethrow - this is just a coordinator, the actual initialization should proceed
        }
    }
}