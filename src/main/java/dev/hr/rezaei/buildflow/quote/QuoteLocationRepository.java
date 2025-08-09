package dev.hr.rezaei.buildflow.quote;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QuoteLocationRepository extends JpaRepository<QuoteLocation, UUID> {
}

