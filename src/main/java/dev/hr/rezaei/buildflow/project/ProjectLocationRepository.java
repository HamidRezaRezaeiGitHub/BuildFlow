package dev.hr.rezaei.buildflow.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProjectLocationRepository extends JpaRepository<ProjectLocation, UUID> {
}

