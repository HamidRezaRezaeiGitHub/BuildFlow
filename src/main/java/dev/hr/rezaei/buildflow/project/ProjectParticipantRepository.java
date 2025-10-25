package dev.hr.rezaei.buildflow.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectParticipantRepository extends JpaRepository<ProjectParticipant, UUID> {
    List<ProjectParticipant> findByProjectId(UUID projectId);
    List<ProjectParticipant> findByContactId(UUID contactId);
    List<ProjectParticipant> findByRole(ProjectRole role);
}
