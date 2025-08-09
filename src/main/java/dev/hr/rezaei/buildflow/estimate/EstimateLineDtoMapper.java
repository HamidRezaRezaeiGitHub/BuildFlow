package dev.hr.rezaei.buildflow.estimate;

import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import dev.hr.rezaei.buildflow.base.UpdatableEntityDtoMapper;
import dev.hr.rezaei.buildflow.workitem.WorkItem;
import lombok.NonNull;

import static dev.hr.rezaei.buildflow.util.EnumUtil.fromString;

public class EstimateLineDtoMapper {

    public static EstimateLineDto fromEstimateLine(EstimateLine estimateLine) {
        if (estimateLine == null) return null;
        return EstimateLineDto.builder()
                .id(estimateLine.getId())
                .workItemId(estimateLine.getWorkItem().getId())
                .quantity(estimateLine.getQuantity())
                .estimateStrategy(estimateLine.getEstimateStrategy().name())
                .multiplier(estimateLine.getMultiplier())
                .computedCost(estimateLine.getComputedCost())
                .createdAt(UpdatableEntityDtoMapper.toString(estimateLine.getCreatedAt()))
                .lastUpdatedAt(UpdatableEntityDtoMapper.toString(estimateLine.getLastUpdatedAt()))
                .build();
    }

    public static EstimateLine toEstimateLine(@NonNull EstimateLineDto dto, WorkItem workItem) {
        try {
            return map(dto, workItem);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid EstimateLineDto: " + dto, e);
        }
    }

    private static EstimateLine map(@NonNull EstimateLineDto dto, WorkItem workItem) {
        return EstimateLine.builder()
                .id(dto.getId())
                .workItem(workItem)
                .quantity(dto.getQuantity())
                .estimateStrategy(fromString(EstimateLineStrategy.class, dto.getEstimateStrategy()))
                .multiplier(dto.getMultiplier())
                .computedCost(dto.getComputedCost())
                .createdAt(UpdatableEntityDtoMapper.fromString(dto.getCreatedAt()))
                .lastUpdatedAt(UpdatableEntityDtoMapper.fromString(dto.getLastUpdatedAt()))
                .build();
    }
}
