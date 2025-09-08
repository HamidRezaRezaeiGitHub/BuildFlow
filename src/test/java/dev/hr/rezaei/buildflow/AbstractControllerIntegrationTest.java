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
import dev.hr.rezaei.buildflow.project.ProjectLocationRepository;
import dev.hr.rezaei.buildflow.project.ProjectRepository;
import dev.hr.rezaei.buildflow.quote.QuoteLocationRepository;
import dev.hr.rezaei.buildflow.quote.QuoteRepository;
import dev.hr.rezaei.buildflow.user.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

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

    protected int testCounter = 0;

    @BeforeEach
    void setUp() {
        clearDatabase();
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
    }

    @AllArgsConstructor
    @Getter
    @Setter
    protected static class UserToken {
        public User user;
        public String token;
    }

    protected UserToken getAdmin() throws Exception {
        // register
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String username = signUpRequest.getUsername();
        String password = signUpRequest.getPassword();
        registerUser(mockMvc, objectMapper, signUpRequest, "192.168.21." + testCounter);
        Optional<User> optionalUser = userService.findByUsername(username);
        assertTrue(optionalUser.isPresent());
        User user = optionalUser.get();
        user.getContact().getLabels().add(ContactLabel.ADMINISTRATOR);
        userService.update(user);
        log.debug("Admin user registered: {}", user);

        // set role to ADMIN in the repository
        var userAuthOpt = userAuthenticationRepository.findByUsername(username);
        assertTrue(userAuthOpt.isPresent());
        UserAuthentication userAuth = userAuthOpt.get();
        userAuth.setRole(Role.ADMIN);
        userAuthenticationRepository.save(userAuth);
        assertEquals(Role.ADMIN, userAuthenticationRepository.findByUsername(username).get().getRole());
        log.debug("Admin user role set to ADMIN in repository: {}", userAuth);

        // login
        LoginRequest loginRequest = LoginRequest.builder()
                .username(username)
                .password(password)
                .build();
        JwtAuthenticationResponse jwtAuthenticationResponse = login(mockMvc, objectMapper, loginRequest, "192.168.22." + testCounter);
        String token = jwtAuthenticationResponse.getAccessToken();
        return new UserToken(user, token);
    }

    protected UserToken getBuilder() throws Exception {
        // register
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String username = signUpRequest.getUsername();
        String password = signUpRequest.getPassword();
        registerUser(mockMvc, objectMapper, signUpRequest, "192.168.23." + testCounter);
        Optional<User> optionalUser = userService.findByUsername(username);
        assertTrue(optionalUser.isPresent());
        User user = optionalUser.get();
        user.getContact().getLabels().add(ContactLabel.BUILDER);
        user = userService.update(user);
        log.debug("User registered: {}", user);

        // set role to USER in the repository
        var userAuthOpt = userAuthenticationRepository.findByUsername(username);
        assertTrue(userAuthOpt.isPresent());
        var userAuth = userAuthOpt.get();
        userAuth.setRole(Role.USER);
        userAuth = userAuthenticationRepository.save(userAuth);
        assertEquals(Role.USER, userAuthenticationRepository.findByUsername(username).get().getRole());
        log.debug("User role set to USER in repository: {}", userAuth);

        // login
        LoginRequest loginRequest = LoginRequest.builder()
                .username(username)
                .password(password)
                .build();
        JwtAuthenticationResponse jwtAuthenticationResponse = login(mockMvc, objectMapper, loginRequest, "192.168.24." + testCounter);
        String token = jwtAuthenticationResponse.getAccessToken();
        return new UserToken(user, token);
    }

    protected UserToken getOwner() throws Exception {
        // register
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String username = signUpRequest.getUsername();
        String password = signUpRequest.getPassword();
        registerUser(mockMvc, objectMapper, signUpRequest, "192.168.25." + testCounter);
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

        // login
        LoginRequest loginRequest = LoginRequest.builder()
                .username(username)
                .password(password)
                .build();
        JwtAuthenticationResponse jwtAuthenticationResponse = login(mockMvc, objectMapper, loginRequest, "192.168.26." + testCounter);
        String token = jwtAuthenticationResponse.getAccessToken();
        return new UserToken(user, token);
    }

    protected UserToken getViewer() throws Exception {
        // register
        SignUpRequest signUpRequest = createValidRandomSignUpRequest();
        String username = signUpRequest.getUsername();
        String password = signUpRequest.getPassword();
        registerUser(mockMvc, objectMapper, signUpRequest, "192.168.27." + testCounter);
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

        // login
        LoginRequest loginRequest = LoginRequest.builder()
                .username(username)
                .password(password)
                .build();
        JwtAuthenticationResponse jwtAuthenticationResponse = login(mockMvc, objectMapper, loginRequest, "192.168.28." + testCounter);
        String token = jwtAuthenticationResponse.getAccessToken();
        return new UserToken(user, token);
    }

}
