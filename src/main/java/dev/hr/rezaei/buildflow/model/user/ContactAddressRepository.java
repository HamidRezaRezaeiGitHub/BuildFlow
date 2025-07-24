package dev.hr.rezaei.buildflow.model.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ContactAddressRepository extends JpaRepository<ContactAddress, UUID> {
}

