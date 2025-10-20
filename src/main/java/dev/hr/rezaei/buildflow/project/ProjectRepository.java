package dev.hr.rezaei.buildflow.project;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByBuilderUserId(UUID builderId);
    List<Project> findByOwnerId(UUID ownerId);
    
    Page<Project> findByBuilderUserId(UUID builderId, Pageable pageable);
    Page<Project> findByOwnerId(UUID ownerId, Pageable pageable);
}

