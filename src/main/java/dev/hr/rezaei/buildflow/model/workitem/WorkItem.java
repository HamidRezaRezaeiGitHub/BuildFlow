package dev.hr.rezaei.buildflow.model.workitem;

import dev.hr.rezaei.buildflow.model.group.Group;
import dev.hr.rezaei.buildflow.model.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkItem {
    private UUID id;
    private String code;
    private String name;
    private CostType costType;
    private boolean optional;
    private User owner;
    private List<Group> groups;
}
