package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.user.UserServiceConsumerTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ProjectRepositoryPaginationTest extends AbstractModelJpaTest implements UserServiceConsumerTest {

    @Autowired
    private ProjectRepository projectRepository;

    @Test
    void findByBuilderUserId_shouldReturnPageWithDefaultSort() {
        // Create builder user
        persistProjectDependencies(testProject);
        User builder = testProject.getBuilderUser();
        
        // Create multiple projects with distinct timestamps
        List<Project> projects = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            ProjectLocation location = ProjectLocation.builder()
                    .streetNumberAndName("Street " + i)
                    .city("City")
                    .stateOrProvince("ST")
                    .postalOrZipCode("12345")
                    .country("Country")
                    .build();
            
            Instant now = Instant.now().plusMillis(i * 100);
            Project project = Project.builder()
                    .builderUser(builder)
                    .location(location)
                    .createdAt(now)
                    .lastUpdatedAt(now)
                    .build();
            
            projects.add(projectRepository.save(project));
            
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        // Test pagination with ascending sort by createdAt
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "createdAt"));
        Page<Project> page = projectRepository.findByBuilderUserId(builder.getId(), pageable);
        
        assertNotNull(page);
        assertEquals(5, page.getTotalElements());
        assertEquals(5, page.getContent().size());
        
        // Verify ascending order
        List<Project> content = page.getContent();
        for (int i = 0; i < content.size() - 1; i++) {
            assertTrue(content.get(i).getCreatedAt().compareTo(content.get(i + 1).getCreatedAt()) <= 0,
                    "Projects should be sorted by createdAt in ascending order");
        }
    }

    @Test
    void findByBuilderUserId_shouldSortByLastUpdatedAtDescending() {
        // Create builder user
        persistProjectDependencies(testProject);
        User builder = testProject.getBuilderUser();
        
        // Create multiple projects
        for (int i = 0; i < 3; i++) {
            ProjectLocation location = ProjectLocation.builder()
                    .streetNumberAndName("Street " + i)
                    .city("City")
                    .stateOrProvince("ST")
                    .postalOrZipCode("12345")
                    .country("Country")
                    .build();
            
            Instant now = Instant.now().plusMillis(i * 100);
            Project project = Project.builder()
                    .builderUser(builder)
                    .location(location)
                    .createdAt(now)
                    .lastUpdatedAt(now)
                    .build();
            
            projectRepository.save(project);
            
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        // Test descending sort by lastUpdatedAt
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "lastUpdatedAt"));
        Page<Project> page = projectRepository.findByBuilderUserId(builder.getId(), pageable);
        
        assertNotNull(page);
        assertEquals(3, page.getTotalElements());
        
        // Verify descending order
        List<Project> content = page.getContent();
        for (int i = 0; i < content.size() - 1; i++) {
            assertTrue(content.get(i).getLastUpdatedAt().compareTo(content.get(i + 1).getLastUpdatedAt()) >= 0,
                    "Projects should be sorted by lastUpdatedAt in descending order");
        }
    }
}
