package dev.hr.rezaei.buildflow.workitem;

import dev.hr.rezaei.buildflow.base.UpdatableEntity;
import dev.hr.rezaei.buildflow.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@Entity
@Table(name = "work_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class WorkItem extends UpdatableEntity {
    public static final String UNASSIGNED_GROUP_NAME = "Unassigned";

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    @NonNull
    @Column(length = 50, nullable = false)
    private String code;

    @NonNull
    @Column(length = 250, nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private boolean optional;

    // Bidirectional relationship: One User (as owner) can have many WorkItems.
    // Table: work_items, Foreign Key: user_id
    @NonNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_work_items_user"))
    private User user;

    @Builder.Default
    @Column(nullable = false)
    private String defaultGroupName = UNASSIGNED_GROUP_NAME;

    @NonNull
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private WorkItemDomain domain = WorkItemDomain.PUBLIC;

    @PrePersist
    @PreUpdate
    private void validate() {
        if (code.isBlank()) {
            throw new IllegalArgumentException("Work item code cannot be blank.");
        }
        if (name.isBlank()) {
            throw new IllegalArgumentException("Work item name cannot be blank.");
        }
        if (defaultGroupName == null || defaultGroupName.isBlank()) {
            defaultGroupName = UNASSIGNED_GROUP_NAME;
        }
    }

    @Override
    public String toString() {
        return "WorkItem{" +
                "id=" + id +
                ", createdAt=" + getCreatedAt() +
                ", lastUpdatedAt=" + getLastUpdatedAt() +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", optional=" + optional +
                ", user.id=" + user.getId() +
                ", defaultGroupName='" + defaultGroupName + '\'' +
                ", domain=" + domain +
                '}';
    }
}
