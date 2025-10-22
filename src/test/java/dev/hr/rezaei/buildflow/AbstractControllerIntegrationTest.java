package dev.hr.rezaei.buildflow;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hr.rezaei.buildflow.config.security.AuthServiceConsumer;
import dev.hr.rezaei.buildflow.config.security.Role;
import dev.hr.rezaei.buildflow.config.security.UserAuthentication;
import dev.hr.rezaei.buildflow.config.security.UserAuthenticationRepository;
import dev.hr.rezaei.buildflow.config.security.dto.JwtAuthenticationResponse;
import dev.hr.rezaei.buildflow.config.security.dto.LoginRequest;
import dev.hr.rezaei.buildflow.config.security.dto.SignUpRequest;
import dev.hr.rezaei.buildflow.estimate.EstimateGroupRepository;
import dev.hr.rezaei.buildflow.estimate.EstimateLineRepository;
import dev.hr.rezaei.buildflow.estimate.EstimateRepository;
import dev.hr.rezaei.buildflow.project.ProjectDto;
import dev.hr.rezaei.buildflow.project.ProjectLocationRepository;
import dev.hr.rezaei.buildflow.project.ProjectRepository;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectRequest;
import dev.hr.rezaei.buildflow.project.dto.CreateProjectResponse;
import dev.hr.rezaei.buildflow.project.dto.ProjectLocationRequestDto;
import dev.hr.rezaei.buildflow.quote.QuoteLocationRepository;
import dev.hr.rezaei.buildflow.quote.QuoteRepository;
import dev.hr.rezaei.buildflow.user.*;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.security.enabled=true",
        "app.jwt.secret=testSecretKeyThatIsLongEnoughForHS512AlgorithmToWorkProperly123456789",
        "app.jwt.expiration-ms=86400000"
})
@Slf4j
public abstract class AbstractControllerIntegrationTest extends AbstractDtoTest implements AuthServiceConsumer {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected UserService userService;

    // Repositories
    @Autowired
    protected UserAuthenticationRepository userAuthenticationRepository;

    @Autowired
    private EstimateRepository estimateRepository;

    @Autowired
    private EstimateGroupRepository estimateGroupRepository;

    @Autowired
    private EstimateLineRepository estimateLineRepository;

    @Autowired
    private QuoteRepository quoteRepository;

    @Autowired
    private QuoteLocationRepository quoteLocationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectLocationRepository projectLocationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ContactAddressRepository contactAddressRepository;

    private final Random random = new Random();

    protected int testCounter = 0;
    private final Map<User, SignUpRequest> registeredUsersSignUpRequests = new HashMap<>();

    @BeforeEach
    void setUp() {
        clearDatabase();
        registeredUsersSignUpRequests.clear();
        testCounter++;
    }

    @AfterEach
    void clearDatabase() {
        userAuthenticationRepository.deleteAll();
        estimateRepository.deleteAll();
        estimateGroupRepository.deleteAll();
        estimateLineRepository.deleteAll();
        quoteRepository.deleteAll();
        quoteLocationRepository.deleteAll();
        projectRepository.deleteAll();
        projectLocationRepository.deleteAll();
        userRepository.deleteAll();
        contactRepository.deleteAll();
        contactAddressRepository.deleteAll();
        registeredUsersSignUpRequests.clear();
    }

    protected User registerAdmin() throws Exception {
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String username = "Admin" + signUpRequest.getUsername();
        signUpRequest.setUsername(username);
        String clientIp = "193.168.21." + (100 + random.nextInt(10000));
        registerUser(mockMvc, objectMapper, signUpRequest, clientIp);

        Optional<User> optionalUser = userService.findByUsername(username);
        assertTrue(optionalUser.isPresent());
        User user = optionalUser.get();
        user.getContact().getLabels().add(ContactLabel.ADMINISTRATOR);
        user = userService.update(user);
        log.debug("Admin user registered: {}", user);

        // set role to ADMIN in the repository
        var userAuthOpt = userAuthenticationRepository.findByUsername(username);
        assertTrue(userAuthOpt.isPresent());
        var userAuth = userAuthOpt.get();
        userAuth.setRole(Role.ADMIN);
        userAuth = userAuthenticationRepository.save(userAuth);
        assertEquals(Role.ADMIN, userAuthenticationRepository.findByUsername(username).get().getRole());
        log.debug("Admin user role set to ADMIN in repository: {}", userAuth);

        registeredUsersSignUpRequests.put(user, signUpRequest);

        return user;
    }

    protected String login(User user) throws Exception {
        SignUpRequest signUpRequest = registeredUsersSignUpRequests.get(user);
        if (signUpRequest == null) {
            throw new IllegalStateException("User not registered via this utility class: " + user.getUsername());
        }
        String username = signUpRequest.getUsername();
        String password = signUpRequest.getPassword();
        String clientIp = "193.168.22." + (100 + random.nextInt(10000));
        // login
        LoginRequest loginRequest = LoginRequest.builder()
                .username(username)
                .password(password)
                .build();
        JwtAuthenticationResponse jwtAuthenticationResponse = login(mockMvc, objectMapper, loginRequest, clientIp);
        return jwtAuthenticationResponse.getAccessToken();
    }

    protected User registerBuilder() throws Exception {
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String username = "Builder" + signUpRequest.getUsername();
        signUpRequest.setUsername(username);
        String clientIp = "193.168.23." + (100 + random.nextInt(10000));
        registerUser(mockMvc, objectMapper, signUpRequest, clientIp);

        Optional<User> optionalUser = userService.findByUsername(username);
        assertTrue(optionalUser.isPresent());
        User user = optionalUser.get();
        user.getContact().getLabels().add(ContactLabel.BUILDER);
        user = userService.update(user);
        log.debug("Builder user registered: {}", user);

        // set role to USER in the repository
        var userAuthOpt = userAuthenticationRepository.findByUsername(username);
        assertTrue(userAuthOpt.isPresent());
        var userAuth = userAuthOpt.get();
        userAuth.setRole(Role.USER);
        userAuth = userAuthenticationRepository.save(userAuth);
        assertEquals(Role.USER, userAuthenticationRepository.findByUsername(username).get().getRole());
        log.debug("User role set to USER in repository: {}", userAuth);

        registeredUsersSignUpRequests.put(user, signUpRequest);

        return user;
    }

    protected User registerOwner() throws Exception {
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String username = "Owner" + signUpRequest.getUsername();
        signUpRequest.setUsername(username);
        String clientIp = "193.168.25." + (100 + random.nextInt(10000));
        registerUser(mockMvc, objectMapper, signUpRequest, clientIp);

        Optional<User> optionalUser = userService.findByUsername(username);
        assertTrue(optionalUser.isPresent());
        User user = optionalUser.get();
        user.getContact().getLabels().add(ContactLabel.OWNER);
        user = userService.update(user);
        log.debug("Owner user registered: {}", user);

        // set role to USER in the repository
        var userAuthOpt = userAuthenticationRepository.findByUsername(username);
        assertTrue(userAuthOpt.isPresent());
        var userAuth = userAuthOpt.get();
        userAuth.setRole(Role.USER);
        userAuth = userAuthenticationRepository.save(userAuth);
        assertEquals(Role.USER, userAuthenticationRepository.findByUsername(username).get().getRole());
        log.debug("Owner user role set to USER in repository: {}", userAuth);

        registeredUsersSignUpRequests.put(user, signUpRequest);

        return user;
    }

    protected User registerViewer() throws Exception {
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String username = signUpRequest.getUsername();
        String clientIp = "193.168.27." + (100 + random.nextInt(10000));
        registerUser(mockMvc, objectMapper, signUpRequest, clientIp);

        Optional<User> optionalUser = userService.findByUsername(username);
        assertTrue(optionalUser.isPresent());
        User user = optionalUser.get();
        user = userService.update(user);
        log.debug("Viewer user registered: {}", user);

        // set role to VIEWER in the repository
        var userAuthOpt = userAuthenticationRepository.findByUsername(username);
        assertTrue(userAuthOpt.isPresent());
        UserAuthentication userAuth = userAuthOpt.get();
        userAuth.setRole(Role.VIEWER);
        userAuth = userAuthenticationRepository.save(userAuth);
        assertEquals(Role.VIEWER, userAuthenticationRepository.findByUsername(username).get().getRole());
        log.debug("Viewer user role set to VIEWER in repository: {}", userAuth);

        registeredUsersSignUpRequests.put(user, signUpRequest);

        return user;
    }

    protected ProjectDto createProject(String token, UUID userId, boolean isBuilder, ProjectLocationRequestDto locationRequestDto) throws Exception {
        CreateProjectRequest projectRequest = CreateProjectRequest.builder()
                .userId(userId)
                .isBuilder(isBuilder)
                .locationRequestDto(locationRequestDto)
                .build();
        String role = isBuilder ? "builder" : "owner";

        ResultActions result = mockMvc.perform(post("/api/v1/projects")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.project.id").exists())
                .andExpect(jsonPath("$.project." + role + "Id").value(userId.toString()));
        String responseContent = result.andReturn().getResponse().getContentAsString();
        CreateProjectResponse responseDto = objectMapper.readValue(responseContent, CreateProjectResponse.class);
        return responseDto.getProjectDto();
    }

}
