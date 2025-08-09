package dev.hr.rezaei.buildflow.estimate;

import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import dev.hr.rezaei.buildflow.workitem.WorkItem;
import lombok.NonNull;

import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class EstimateGroupDtoMapper {

    public static EstimateGroupDto fromEstimateGroup(EstimateGroup estimateGroup) {
        if (estimateGroup == null) return null;
        return EstimateGroupDto.builder()
                .id(estimateGroup.getId())
                .name(estimateGroup.getName())
                .description(estimateGroup.getDescription())
                .estimateLineDtos(estimateGroup.getEstimateLines().stream()
                        .map(EstimateLineDtoMapper::fromEstimateLine)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet()))
                .build();
    }

    public static Set<UUID> getWorkItemIds(@NonNull Set<EstimateLineDto> estimateLineDtos) {
        return estimateLineDtos.stream()
                .map(EstimateLineDto::getWorkItemId)
                .collect(Collectors.toSet());
    }

    public static EstimateGroup toEstimateGroup(@NonNull EstimateGroupDto dto, @NonNull Set<WorkItem> workItems) {
        try {
            return map(dto, workItems);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid EstimateGroupDto: " + dto, e);
        }
    }

    private static EstimateGroup map(@NonNull EstimateGroupDto dto, @NonNull Set<WorkItem> workItems) {
        EstimateGroup estimateGroup = EstimateGroup.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .build();

        Set<UUID> expectedWorkItemIds = getWorkItemIds(dto.getEstimateLineDtos());
        Map<UUID, WorkItem> workItemMap = workItems.stream()
                .collect(Collectors.toMap(WorkItem::getId, workItem -> workItem));
        Set<UUID> providedWorkItemIds = workItemMap.keySet();

        if (!expectedWorkItemIds.equals(providedWorkItemIds)) {
            throw new IllegalArgumentException("Provided work items do not match expected work item IDs.");
        }

        Set<EstimateLine> estimateLines = dto.getEstimateLineDtos().stream()
                .map(lineDto -> EstimateLineDtoMapper.toEstimateLine(lineDto, workItemMap.get(lineDto.getWorkItemId())))
                .peek(estimateLine -> estimateLine.setGroup(estimateGroup))
                .collect(Collectors.toSet());

        estimateGroup.setEstimateLines(estimateLines);

        return estimateGroup;
    }

}
