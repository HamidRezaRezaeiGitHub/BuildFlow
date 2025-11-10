package dev.hr.rezaei.buildflow.estimate;

import dev.hr.rezaei.buildflow.base.EstimateNotFoundException;
import dev.hr.rezaei.buildflow.base.ProjectNotFoundException;
import dev.hr.rezaei.buildflow.project.Project;
import dev.hr.rezaei.buildflow.project.ProjectRepository;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * EstimateService providing business logic for estimate management operations.
 * Operates on entities, not DTOs, following the same pattern as ProjectParticipantService.
 */
@Slf4j
@Service
public class EstimateService {

    private final EstimateRepository estimateRepository;
    private final ProjectRepository projectRepository;

    public EstimateService(EstimateRepository estimateRepository,
                           ProjectRepository projectRepository) {
        this.estimateRepository = estimateRepository;
        this.projectRepository = projectRepository;
    }

    /**
     * Find estimate by ID.
     */
    @Transactional(readOnly = true)
    public Optional<Estimate> findById(@NonNull UUID id) {
        return estimateRepository.findById(id);
    }

    /**
     * List all estimates for a given project.
     */
    @Transactional(readOnly = true)
    public List<Estimate> findByProjectId(@NonNull UUID projectId) {
        verifyProjectExists(projectId);
        return estimateRepository.findByProjectId(projectId);
    }

    /**
     * List estimates for a given project with pagination support.
     * Applies default sort by lastUpdatedAt DESC if pageable is unsorted.
     */
    @Transactional(readOnly = true)
    public Page<Estimate> getEstimatesByProjectId(@NonNull UUID projectId, @NonNull Pageable pageable) {
        verifyProjectExists(projectId);
        Pageable pageableWithSort = ensureDefaultSort(pageable);
        return estimateRepository.findByProjectId(projectId, pageableWithSort);
    }

    /**
     * Count estimates by project ID.
     */
    @Transactional(readOnly = true)
    public long countByProjectId(@NonNull UUID projectId) {
        return estimateRepository.countByProjectId(projectId);
    }

    /**
     * Create a new estimate for a project.
     */
    @Transactional
    public Estimate createEstimate(@NonNull UUID projectId, double overallMultiplier) {
        // Verify project exists
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project with ID " + projectId + " does not exist."));

        Instant now = Instant.now();
        Estimate estimate = Estimate.builder()
                .project(project)
                .overallMultiplier(overallMultiplier)
                .createdAt(now)
                .lastUpdatedAt(now)
                .build();

        Estimate saved = estimateRepository.save(estimate);
        log.info("Created estimate with ID {} for project ID {} with multiplier {}", saved.getId(), projectId, overallMultiplier);
        return saved;
    }

    /**
     * Update an existing estimate.
     */
    @Transactional
    public Estimate updateEstimate(@NonNull UUID estimateId, double overallMultiplier) {
        Estimate estimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new EstimateNotFoundException("Estimate with ID " + estimateId + " does not exist."));

        estimate.setOverallMultiplier(overallMultiplier);
        Instant now = Instant.now();
        estimate.setLastUpdatedAt(now);

        Estimate updated = estimateRepository.save(estimate);
        log.info("Updated estimate ID {} with multiplier {}", estimateId, overallMultiplier);
        return updated;
    }

    /**
     * Delete an estimate by ID.
     */
    @Transactional
    public void deleteEstimate(@NonNull UUID estimateId) {
        if (!estimateRepository.existsById(estimateId)) {
            throw new EstimateNotFoundException("Estimate with ID " + estimateId + " does not exist.");
        }
        estimateRepository.deleteById(estimateId);
        log.info("Deleted estimate with ID {}", estimateId);
    }

    /**
     * Ensures that the pageable has default sorting by lastUpdatedAt DESC if no sort is provided.
     */
    private Pageable ensureDefaultSort(Pageable pageable) {
        if (pageable.getSort().isUnsorted()) {
            Sort defaultSort = Sort.by(Sort.Direction.DESC, "lastUpdatedAt");
            return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), defaultSort);
        }
        return pageable;
    }

    /**
     * Verify that a project exists.
     */
    private void verifyProjectExists(UUID projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ProjectNotFoundException("Project with ID " + projectId + " does not exist.");
        }
    }
}

