package dev.hr.rezaei.buildflow.config.mvc;

import dev.hr.rezaei.buildflow.project.Project;
import dev.hr.rezaei.buildflow.project.ProjectLocation;
import dev.hr.rezaei.buildflow.project.ProjectRepository;
import dev.hr.rezaei.buildflow.project.ProjectRole;
import dev.hr.rezaei.buildflow.user.Contact;
import dev.hr.rezaei.buildflow.user.ContactAddress;
import dev.hr.rezaei.buildflow.user.ContactRepository;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.ActiveProfiles;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for UpdatableEntitySpecification using Project entity.
 * Tests date filtering with real JPA repository queries.
 */
@DataJpaTest
@ActiveProfiles("test")
class UpdatableEntitySpecificationTest {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRepository contactRepository;

    private User testUser;
    private Instant baseTime;
    private Project oldProject;
    private Project mediumProject;
    private Project recentProject;

    @BeforeEach
    void setUp() {
        // Clean up database
        projectRepository.deleteAll();
        userRepository.deleteAll();
        contactRepository.deleteAll();

        // Create test contact
        ContactAddress contactAddress = ContactAddress.builder()
                .streetNumberAndName("123 Test Street")
                .city("TestCity")
                .stateOrProvince("TS")
                .postalOrZipCode("12345")
                .country("TestCountry")
                .build();

        Contact contact = Contact.builder()
                .firstName("Test")
                .lastName("User")
                .email("test@example.com")
                .address(contactAddress)
                .build();
        contact = contactRepository.save(contact);

        // Create test user
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .contact(contact)
                .build();
        testUser = userRepository.save(testUser);

        // Create timestamps with clear differences
        baseTime = Instant.now().truncatedTo(ChronoUnit.SECONDS);
        Instant oldTime = baseTime.minus(30, ChronoUnit.DAYS);
        Instant mediumTime = baseTime.minus(15, ChronoUnit.DAYS);
        Instant recentTime = baseTime.minus(5, ChronoUnit.DAYS);

        // Create projects with different creation and update times
        oldProject = createProject("Old Project", oldTime, oldTime);
        mediumProject = createProject("Medium Project", mediumTime, mediumTime.plus(2, ChronoUnit.DAYS));
        recentProject = createProject("Recent Project", recentTime, baseTime.minus(1, ChronoUnit.DAYS));
    }

    private Project createProject(String name, Instant createdAt, Instant lastUpdatedAt) {
        ProjectLocation location = ProjectLocation.builder()
                .streetNumberAndName(name + " Street")
                .city("TestCity")
                .stateOrProvince("TS")
                .postalOrZipCode("12345")
                .country("TestCountry")
                .build();

        Project project = Project.builder()
                .user(testUser)
                .role(ProjectRole.BUILDER)
                .location(location)
                .createdAt(createdAt)
                .lastUpdatedAt(lastUpdatedAt)
                .build();

        return projectRepository.save(project);
    }

    // ============================================
    // Empty/Null Filter Tests
    // ============================================

    @Test
    void withDateFilter_withNullFilter_shouldReturnAllProjects() {
        Specification<Project> spec = UpdatableEntitySpecification.withDateFilter(null);
        Page<Project> results = projectRepository.findAll(spec, Pageable.unpaged());

        assertThat(results.getContent()).hasSize(3);
    }

    @Test
    void withDateFilter_withEmptyFilter_shouldReturnAllProjects() {
        DateFilter emptyFilter = DateFilter.empty();
        Specification<Project> spec = UpdatableEntitySpecification.withDateFilter(emptyFilter);
        Page<Project> results = projectRepository.findAll(spec, Pageable.unpaged());

        assertThat(results.getContent()).hasSize(3);
    }

    // ============================================
    // createdAfter Filter Tests
    // ============================================

    @Test
    void withDateFilter_withCreatedAfter_shouldFilterCorrectly() {
        Instant threshold = baseTime.minus(20, ChronoUnit.DAYS);
        DateFilter filter = DateFilter.builder()
                .createdAfter(threshold)
                .build();

        Specification<Project> spec = UpdatableEntitySpecification.withDateFilter(filter);
        List<Project> results = projectRepository.findAll(spec);

        assertThat(results).hasSize(2);
        assertThat(results).extracting(Project::getCreatedAt)
                .allMatch(createdAt -> !createdAt.isBefore(threshold));
    }

    // ============================================
    // createdBefore Filter Tests
    // ============================================

    @Test
    void withDateFilter_withCreatedBefore_shouldFilterCorrectly() {
        Instant threshold = baseTime.minus(10, ChronoUnit.DAYS);
        DateFilter filter = DateFilter.builder()
                .createdBefore(threshold)
                .build();

        Specification<Project> spec = UpdatableEntitySpecification.withDateFilter(filter);
        List<Project> results = projectRepository.findAll(spec);

        assertThat(results).hasSize(2);
        assertThat(results).extracting(Project::getCreatedAt)
                .allMatch(createdAt -> !createdAt.isAfter(threshold));
    }

    // ============================================
    // updatedAfter Filter Tests
    // ============================================

    @Test
    void withDateFilter_withUpdatedAfter_shouldFilterCorrectly() {
        Instant threshold = baseTime.minus(10, ChronoUnit.DAYS);
        DateFilter filter = DateFilter.builder()
                .updatedAfter(threshold)
                .build();

        Specification<Project> spec = UpdatableEntitySpecification.withDateFilter(filter);
        List<Project> results = projectRepository.findAll(spec);

        // Only recentProject has lastUpdatedAt after threshold (baseTime - 1 day > baseTime - 10 days)
        // mediumProject lastUpdatedAt is baseTime - 13 days, which is before threshold
        assertThat(results).hasSize(1);
        assertThat(results).extracting(Project::getLastUpdatedAt)
                .allMatch(updatedAt -> !updatedAt.isBefore(threshold));
    }

    // ============================================
    // updatedBefore Filter Tests
    // ============================================

    @Test
    void withDateFilter_withUpdatedBefore_shouldFilterCorrectly() {
        Instant threshold = baseTime.minus(20, ChronoUnit.DAYS);
        DateFilter filter = DateFilter.builder()
                .updatedBefore(threshold)
                .build();

        Specification<Project> spec = UpdatableEntitySpecification.withDateFilter(filter);
        List<Project> results = projectRepository.findAll(spec);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getId()).isEqualTo(oldProject.getId());
    }

    // ============================================
    // Combined Filter Tests
    // ============================================

    @Test
    void withDateFilter_withCreatedAfterAndBefore_shouldFilterRange() {
        Instant after = baseTime.minus(25, ChronoUnit.DAYS);
        Instant before = baseTime.minus(10, ChronoUnit.DAYS);
        DateFilter filter = DateFilter.builder()
                .createdAfter(after)
                .createdBefore(before)
                .build();

        Specification<Project> spec = UpdatableEntitySpecification.withDateFilter(filter);
        List<Project> results = projectRepository.findAll(spec);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getId()).isEqualTo(mediumProject.getId());
    }

    @Test
    void withDateFilter_withAllFilters_shouldApplyAll() {
        Instant createdAfter = baseTime.minus(20, ChronoUnit.DAYS);
        Instant createdBefore = baseTime.minus(10, ChronoUnit.DAYS);
        Instant updatedAfter = baseTime.minus(20, ChronoUnit.DAYS);
        Instant updatedBefore = baseTime.minus(10, ChronoUnit.DAYS);

        DateFilter filter = DateFilter.builder()
                .createdAfter(createdAfter)
                .createdBefore(createdBefore)
                .updatedAfter(updatedAfter)
                .updatedBefore(updatedBefore)
                .build();

        Specification<Project> spec = UpdatableEntitySpecification.withDateFilter(filter);
        List<Project> results = projectRepository.findAll(spec);

        // Should only get medium project (created in range, updated in range)
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getId()).isEqualTo(mediumProject.getId());
    }

    // ============================================
    // Pagination Integration Tests
    // ============================================

    @Test
    void withDateFilter_withPagination_shouldWork() {
        Instant threshold = baseTime.minus(20, ChronoUnit.DAYS);
        DateFilter filter = DateFilter.builder()
                .createdAfter(threshold)
                .build();

        Specification<Project> spec = UpdatableEntitySpecification.withDateFilter(filter);
        Pageable pageable = PageRequest.of(0, 1);
        Page<Project> page = projectRepository.findAll(spec, pageable);

        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getTotalElements()).isEqualTo(2);
        assertThat(page.getTotalPages()).isEqualTo(2);
    }

    // ============================================
    // Composition Tests (withDateFilterAnd)
    // ============================================

    @Test
    void withDateFilterAnd_shouldCombineSpecifications() {
        DateFilter dateFilter = DateFilter.builder()
                .createdAfter(baseTime.minus(20, ChronoUnit.DAYS))
                .build();

        Specification<Project> userSpec = (root, query, cb) ->
                cb.equal(root.get("user").get("id"), testUser.getId());

        Specification<Project> combinedSpec = UpdatableEntitySpecification.withDateFilterAnd(
                dateFilter, userSpec
        );

        List<Project> results = projectRepository.findAll(combinedSpec);

        assertThat(results).hasSize(2);
        assertThat(results).extracting(p -> p.getUser().getId())
                .allMatch(id -> id.equals(testUser.getId()));
    }

    // ============================================
    // Edge Cases
    // ============================================

    @Test
    void withDateFilter_withExactMatch_shouldInclude() {
        Instant exactTime = mediumProject.getCreatedAt();
        DateFilter filter = DateFilter.builder()
                .createdAfter(exactTime)
                .createdBefore(exactTime)
                .build();

        Specification<Project> spec = UpdatableEntitySpecification.withDateFilter(filter);
        List<Project> results = projectRepository.findAll(spec);

        // Should include the exact match (>= and <=)
        assertThat(results).hasSize(1);
        assertThat(results.get(0).getId()).isEqualTo(mediumProject.getId());
    }

    @Test
    void withDateFilter_withNoMatches_shouldReturnEmpty() {
        Instant futureTime = baseTime.plus(10, ChronoUnit.DAYS);
        DateFilter filter = DateFilter.builder()
                .createdAfter(futureTime)
                .build();

        Specification<Project> spec = UpdatableEntitySpecification.withDateFilter(filter);
        List<Project> results = projectRepository.findAll(spec);

        assertThat(results).isEmpty();
    }
}
