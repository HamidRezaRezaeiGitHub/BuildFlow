package dev.hr.rezaei.buildflow.project;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByUserId(UUID userId);
    
    Page<Project> findByUserId(UUID userId, Pageable pageable);
    
    /**
     * Count projects by user ID without loading entities.
     */
    long countByUserId(UUID userId);

    /**
     * Find projects where user matches with date filtering.
     */
    @Query("""
        SELECT DISTINCT p FROM Project p
        WHERE p.user.id = :userId
        AND (:createdFrom IS NULL OR p.createdAt >= :createdFrom)
        AND (:createdTo IS NULL OR p.createdAt <= :createdTo)
        """)
    Page<Project> findCombinedProjects(
        @Param("userId") UUID userId,
        @Param("createdFrom") Instant createdFrom,
        @Param("createdTo") Instant createdTo,
        Pageable pageable
    );
    
    /**
     * Find projects where user is builder with date filtering.
     */
    @Query("""
        SELECT p FROM Project p
        WHERE p.user.id = :userId
        AND p.role = dev.hr.rezaei.buildflow.project.ProjectRole.BUILDER
        AND (:createdFrom IS NULL OR p.createdAt >= :createdFrom)
        AND (:createdTo IS NULL OR p.createdAt <= :createdTo)
        """)
    Page<Project> findBuilderProjects(
        @Param("userId") UUID userId,
        @Param("createdFrom") Instant createdFrom,
        @Param("createdTo") Instant createdTo,
        Pageable pageable
    );
    
    /**
     * Find projects where user is owner with date filtering.
     */
    @Query("""
        SELECT p FROM Project p
        WHERE p.user.id = :userId
        AND p.role = dev.hr.rezaei.buildflow.project.ProjectRole.OWNER
        AND (:createdFrom IS NULL OR p.createdAt >= :createdFrom)
        AND (:createdTo IS NULL OR p.createdAt <= :createdTo)
        """)
    Page<Project> findOwnerProjects(
        @Param("userId") UUID userId,
        @Param("createdFrom") Instant createdFrom,
        @Param("createdTo") Instant createdTo,
        Pageable pageable
    );
}
