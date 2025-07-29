package dev.hr.rezaei.buildflow.model.project;

import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectLocationService {
    private final ProjectLocationRepository projectLocationRepository;

    @Autowired
    public ProjectLocationService(ProjectLocationRepository projectLocationRepository) {
        this.projectLocationRepository = projectLocationRepository;
    }

    /**
     * Find a ProjectLocation by its id.
     * Only returns if the location is already persisted.
     */
    public Optional<ProjectLocation> findById(UUID id) {
        return projectLocationRepository.findById(id);
    }

    /**
     * Update an already persisted ProjectLocation.
     * Throws IllegalArgumentException if the location is not persisted.
     */
    public ProjectLocation update(ProjectLocation location) {
        if (location.getId() == null || !projectLocationRepository.existsById(location.getId())) {
            throw new IllegalArgumentException("ProjectLocation must be already persisted.");
        }
        return projectLocationRepository.save(location);
    }

    public boolean existsById(@NonNull UUID id) {
        return projectLocationRepository.existsById(id);
    }

    public boolean isPersisted(@NonNull ProjectLocation location) {
        return location.getId() != null && projectLocationRepository.existsById(location.getId());
    }
}
