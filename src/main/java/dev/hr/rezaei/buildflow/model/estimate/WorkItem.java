package dev.hr.rezaei.buildflow.model.estimate;

import dev.hr.rezaei.buildflow.model.base.UpdatableEntity;
import dev.hr.rezaei.buildflow.model.user.User;
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

    @Column(length = 50, nullable = false)
    private String code;

    @NonNull
    @Column(length = 200, nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private boolean optional;

    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

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
                ", owner.id=" + owner.getId() +
                ", defaultGroupName='" + defaultGroupName + '\'' +
                ", domain=" + domain +
                '}';
    }
}
