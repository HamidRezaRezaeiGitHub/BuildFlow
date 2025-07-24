package dev.hr.rezaei.buildflow.model.quote;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QuoteRepository extends JpaRepository<Quote, UUID> {
}

