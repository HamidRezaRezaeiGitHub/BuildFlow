package dev.hr.rezaei.buildflow.estimate;

import dev.hr.rezaei.buildflow.base.UpdatableEntityDtoMapper;
import dev.hr.rezaei.buildflow.project.Project;
import dev.hr.rezaei.buildflow.workitem.WorkItem;
import lombok.NonNull;

import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class EstimateDtoMapper {

    public static EstimateDto fromModel(Estimate estimate) {
        if (estimate == null) return null;
        return EstimateDto.builder()
                .id(estimate.getId())
                .projectId(estimate.getProject().getId())
                .overallMultiplier(estimate.getOverallMultiplier())
                .groupDtos(estimate.getGroups().stream()
                        .map(EstimateGroupDtoMapper::fromEstimateGroup)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet()))
                .createdAt(UpdatableEntityDtoMapper.toString(estimate.getCreatedAt()))
                .lastUpdatedAt(UpdatableEntityDtoMapper.toString(estimate.getLastUpdatedAt()))
                .build();
    }

    public static Set<UUID> getEstimateGroupIds(@NonNull Estimate estimate) {
        return estimate.getGroups().stream()
                .map(EstimateGroup::getId)
                .collect(Collectors.toSet());
    }

    private static Estimate map(@NonNull EstimateDto dto, Project project, Map<UUID, Set<WorkItem>> workItemsByGroupId) {
        Estimate estimate = Estimate.builder()
                .id(dto.getId())
                .project(project)
                .overallMultiplier(dto.getOverallMultiplier())
                .build();

        Set<UUID> expectedGroupIds = getEstimateGroupIds(estimate);
        Set<UUID> providedGroupIds = workItemsByGroupId.keySet();
        if (!expectedGroupIds.equals(providedGroupIds)) {
            throw new IllegalArgumentException("Provided work items do not match expected estimate group IDs.");
        }

        Set<EstimateGroup> groups = dto.getGroupDtos().stream()
                .map(groupDto -> EstimateGroupDtoMapper.toEstimateGroup(groupDto, workItemsByGroupId.get(groupDto.getId())))
                .peek(estimateGroup -> estimateGroup.setEstimate(estimate))
                .collect(Collectors.toSet());
        estimate.setGroups(groups);

        return estimate;
    }

}
