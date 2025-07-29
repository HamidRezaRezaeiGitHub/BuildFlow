package dev.hr.rezaei.buildflow.model.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByBuilderUserId(UUID builderId);
    List<Project> findByOwnerId(UUID ownerId);
}

