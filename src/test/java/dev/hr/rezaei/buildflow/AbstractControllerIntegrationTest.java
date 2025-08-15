package dev.hr.rezaei.buildflow;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hr.rezaei.buildflow.estimate.EstimateGroupRepository;
import dev.hr.rezaei.buildflow.estimate.EstimateLineRepository;
import dev.hr.rezaei.buildflow.estimate.EstimateRepository;
import dev.hr.rezaei.buildflow.project.ProjectLocationRepository;
import dev.hr.rezaei.buildflow.project.ProjectRepository;
import dev.hr.rezaei.buildflow.quote.QuoteLocationRepository;
import dev.hr.rezaei.buildflow.quote.QuoteRepository;
import dev.hr.rezaei.buildflow.user.ContactAddressRepository;
import dev.hr.rezaei.buildflow.user.ContactRepository;
import dev.hr.rezaei.buildflow.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = "spring.security.enabled=false")
public class AbstractControllerIntegrationTest extends AbstractDtoTest {
    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    // Repositories
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


    @BeforeEach
    void setUp() {
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
}
