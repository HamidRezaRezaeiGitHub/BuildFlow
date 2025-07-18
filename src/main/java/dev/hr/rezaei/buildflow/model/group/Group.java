package dev.hr.rezaei.buildflow.model.group;

import dev.hr.rezaei.buildflow.model.user.User;
import dev.hr.rezaei.buildflow.model.workitem.WorkItem;
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
public class Group {
    private UUID id;
    private String name;
    private String description;
    private User owner;
    private List<WorkItem> workItems;
}
