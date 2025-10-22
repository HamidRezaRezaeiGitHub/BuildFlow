package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.AbstractControllerIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
public class UserControllerIntegrationTest extends AbstractControllerIntegrationTest {

    @Test
    void createUser_shouldReturnCreated_whenAdminUser() throws Exception {
        User admin = registerAdmin();
        String token = login(admin);
        
        mockMvc.perform(post("/api/v1/users")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.100." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateBuilderRequest)))
                // .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.user.id").exists())
                .andExpect(jsonPath("$.user.username").value(testCreateBuilderRequest.getUsername()))
                .andExpect(jsonPath("$.user.email").value(testCreateBuilderRequest.getContactRequestDto().getEmail()));
    }

    @Test
    void createUser_shouldReturnForbidden_whenUserLacksAdminAuthority() throws Exception {
        User user = registerBuilder();  // Regular USER role
        String token = login(user);
        
        mockMvc.perform(post("/api/v1/users")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.101." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateBuilderRequest)))
                // .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void createUser_shouldReturnForbidden_whenViewerUser() throws Exception {
        User viewer = registerViewer();
        String token = login(viewer);
        
        mockMvc.perform(post("/api/v1/users")
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.102." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateBuilderRequest)))
                // .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void createUser_shouldReturnUnauthorized_whenNoJwtProvided() throws Exception {
        mockMvc.perform(post("/api/v1/users")
                        .header("X-Forwarded-For", "192.168.103." + testCounter)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateBuilderRequest)))
                // .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getUserByUsername_shouldReturnOk_whenAdminUser() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        User targetUser = registerBuilder();
        
        mockMvc.perform(get("/api/v1/users/{username}", targetUser.getUsername())
                        .header("Authorization", "Bearer " + adminToken)
                        .header("X-Forwarded-For", "192.168.104." + testCounter))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username").value(targetUser.getUsername()))
                .andExpect(jsonPath("$.email").value(targetUser.getEmail()));
    }

    @Test
    void getUserByUsername_shouldReturnForbidden_whenUserLacksAdminAuthority() throws Exception {
        User user = registerBuilder();  // Regular USER role
        String token = login(user);
        User targetUser = registerBuilder();
        
        mockMvc.perform(get("/api/v1/users/{username}", targetUser.getUsername())
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.105." + testCounter))
                // .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void getUserByUsername_shouldReturnForbidden_whenViewerUser() throws Exception {
        User viewer = registerViewer();
        String token = login(viewer);
        User targetUser = registerBuilder();
        
        mockMvc.perform(get("/api/v1/users/{username}", targetUser.getUsername())
                        .header("Authorization", "Bearer " + token)
                        .header("X-Forwarded-For", "192.168.106." + testCounter))
                // .andDo(print())
                .andExpect(status().isForbidden());
    }

    @Test
    void getUserByUsername_shouldReturnUnauthorized_whenNoJwt() throws Exception {
        User targetUser = registerBuilder();
        
        mockMvc.perform(get("/api/v1/users/{username}", targetUser.getUsername())
                        .header("X-Forwarded-For", "192.168.107." + testCounter))
                // .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getUserByUsername_shouldReturnNotFound_whenUserDoesNotExist() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        
        mockMvc.perform(get("/api/v1/users/{username}", "nonexistent.user@example.com")
                        .header("Authorization", "Bearer " + adminToken)
                        .header("X-Forwarded-For", "192.168.108." + testCounter))
                // .andDo(print())
                .andExpect(status().isNotFound());
    }

    @Test
    void getAllUsers_shouldReturnOk_whenAdminUser() throws Exception {
        User admin = registerAdmin();
        String adminToken = login(admin);
        
        mockMvc.perform(get("/api/v1/users")
                        .header("Authorization", "Bearer " + adminToken)
                        .header("X-Forwarded-For", "192.168.109." + testCounter))
                // .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1)) // Admin user should be present
                .andExpect(jsonPath("$[0].id").exists())
                .andExpect(jsonPath("$[0].username").value(admin.getUsername()));
    }

    @Test
    void getAllUsers_shouldReturnUnauthorized_whenNoToken() throws Exception {
        mockMvc.perform(get("/api/v1/users")
                        .header("X-Forwarded-For", "192.168.110." + testCounter))
                // .andDo(print())
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getAllUsers_shouldReturnForbidden_whenRegularUser() throws Exception {
        @SuppressWarnings("unused")
        User admin = registerAdmin();
        User user = registerBuilder();
        String userToken = login(user);
        
        mockMvc.perform(get("/api/v1/users")
                        .header("Authorization", "Bearer " + userToken)
                        .header("X-Forwarded-For", "192.168.111." + testCounter))
                // .andDo(print())
                .andExpect(status().isForbidden());
    }
}