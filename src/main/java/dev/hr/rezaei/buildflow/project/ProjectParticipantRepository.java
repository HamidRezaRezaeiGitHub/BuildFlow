package dev.hr.rezaei.buildflow.project;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectParticipantRepository extends JpaRepository<ProjectParticipant, UUID> {
    List<ProjectParticipant> findByProjectId(UUID projectId);
    Page<ProjectParticipant> findByProjectId(UUID projectId, Pageable pageable);
    long countByProjectId(UUID projectId);
    List<ProjectParticipant> findByContactId(UUID contactId);
    List<ProjectParticipant> findByRole(ProjectRole role);
}
