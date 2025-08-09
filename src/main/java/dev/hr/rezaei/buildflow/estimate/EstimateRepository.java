package dev.hr.rezaei.buildflow.estimate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EstimateRepository extends JpaRepository<Estimate, UUID> {
}

