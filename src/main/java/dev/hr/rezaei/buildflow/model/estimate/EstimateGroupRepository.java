package dev.hr.rezaei.buildflow.model.estimate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EstimateGroupRepository extends JpaRepository<EstimateGroup, UUID> {
}

