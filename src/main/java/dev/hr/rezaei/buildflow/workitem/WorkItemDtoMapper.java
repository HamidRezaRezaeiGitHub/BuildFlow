package dev.hr.rezaei.buildflow.workitem;

import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import dev.hr.rezaei.buildflow.base.UpdatableEntityDtoMapper;
import dev.hr.rezaei.buildflow.user.User;
import lombok.NonNull;

import static dev.hr.rezaei.buildflow.util.EnumUtil.fromStringOrDefault;
import static dev.hr.rezaei.buildflow.util.StringUtil.orDefault;

public class WorkItemDtoMapper {

    public static WorkItemDto fromWorkItem(WorkItem workItem) {
        if (workItem == null) return null;
        return WorkItemDto.builder()
                .id(workItem.getId())
                .code(workItem.getCode())
                .name(workItem.getName())
                .description(workItem.getDescription())
                .optional(workItem.isOptional())
                .userId(workItem.getUser().getId())
                .defaultGroupName(workItem.getDefaultGroupName())
                .domain(workItem.getDomain().name())
                .createdAt(UpdatableEntityDtoMapper.toString(workItem.getCreatedAt()))
                .lastUpdatedAt(UpdatableEntityDtoMapper.toString(workItem.getLastUpdatedAt()))
                .build();
    }

    public static WorkItem toWorkItem(@NonNull WorkItemDto dto, User user) {
        try {
            return map(dto, user);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid WorkItemDto: " + dto, e);
        }
    }

    private static WorkItem map(@NonNull WorkItemDto dto, User user) {
        return WorkItem.builder()
                .id(dto.getId())
                .code(dto.getCode())
                .name(dto.getName())
                .description(dto.getDescription())
                .optional(dto.isOptional())
                .defaultGroupName(orDefault(dto.getDefaultGroupName(), WorkItem.UNASSIGNED_GROUP_NAME))
                .domain(fromStringOrDefault(WorkItemDomain.class, dto.getDomain(), WorkItemDomain.PUBLIC))
                .user(user)
                .createdAt(UpdatableEntityDtoMapper.fromString(dto.getCreatedAt()))
                .lastUpdatedAt(UpdatableEntityDtoMapper.fromString(dto.getLastUpdatedAt()))
                .build();
    }

}
