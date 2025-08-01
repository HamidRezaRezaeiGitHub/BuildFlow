package dev.hr.rezaei.buildflow.model.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContactRepository extends JpaRepository<Contact, UUID> {

    boolean existsByEmail(String email);

    Optional<Contact> findByEmail(String email);
}

