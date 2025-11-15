package dev.hr.rezaei.buildflow.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for ProjectParticipant entity.
 * 
 * Note: Pagination methods removed since participant counts per project are expected to be small.
 */
@Repository
public interface ProjectParticipantRepository extends JpaRepository<ProjectParticipant, UUID> {
    List<ProjectParticipant> findByProjectId(UUID projectId);
    long countByProjectId(UUID projectId);
    List<ProjectParticipant> findByContactId(UUID contactId);
    List<ProjectParticipant> findByRole(ProjectRole role);
}
