package dev.hr.rezaei.buildflow.estimate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EstimateRepository extends JpaRepository<Estimate, UUID> {
    List<Estimate> findByProjectId(UUID projectId);
    Page<Estimate> findByProjectId(UUID projectId, Pageable pageable);
    long countByProjectId(UUID projectId);
}

