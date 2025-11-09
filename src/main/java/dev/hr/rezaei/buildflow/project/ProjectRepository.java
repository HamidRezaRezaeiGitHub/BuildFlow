package dev.hr.rezaei.buildflow.project;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    /**
     * Find all projects for a given user ID.
     * Uses EntityGraph to eagerly fetch participants and location to avoid LazyInitializationException.
     */
    @EntityGraph(attributePaths = {"participants", "location"})
    List<Project> findByUserId(UUID userId);
    
    /**
     * Find projects for a given user ID with pagination.
     * Uses EntityGraph to eagerly fetch participants and location to avoid LazyInitializationException.
     */
    @EntityGraph(attributePaths = {"participants", "location"})
    Page<Project> findByUserId(UUID userId, Pageable pageable);
    
    /**
     * Count projects by user ID without loading entities.
     */
    long countByUserId(UUID userId);
}

