package dev.hr.rezaei.buildflow.workitem;

import dev.hr.rezaei.buildflow.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkItemRepository extends JpaRepository<WorkItem, UUID> {
    List<WorkItem> findByUser(User user);
    List<WorkItem> findByUserId(UUID userId);
    List<WorkItem> findByDomain(WorkItemDomain domain);
    Optional<WorkItem> findByUserIdAndCode(UUID userId, String code);
    List<WorkItem> findByUserIdAndDomain(UUID userId, WorkItemDomain domain);
}
