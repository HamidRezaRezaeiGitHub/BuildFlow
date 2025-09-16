package dev.hr.rezaei.buildflow.user;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Map;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.users.mock")
public class UserMockDataProperties {
    
    private boolean enabled;
    private Map<String, MockUserProps> roles;
    
    @Setter
    @Getter
    public static class MockUserProps {
        private int count;
    }
}