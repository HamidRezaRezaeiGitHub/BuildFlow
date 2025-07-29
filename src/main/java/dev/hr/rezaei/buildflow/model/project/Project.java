package dev.hr.rezaei.buildflow.model.project;

import dev.hr.rezaei.buildflow.model.base.UpdatableEntity;
import dev.hr.rezaei.buildflow.model.estimate.Estimate;
import dev.hr.rezaei.buildflow.model.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "projects")
public class Project extends UpdatableEntity {
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    // Bidirectional relationship: Many Projects can have the same User as builder.
    // Table: projects, Foreign Key: builder_id
    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "builder_id", nullable = false)
    private User builderUser;

    // Bidirectional relationship: Many Projects can have the same User as owner.
    // Table: projects, Foreign Key: owner_id
    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @NonNull
    @Builder.Default
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "location_id", nullable = false)
    private ProjectLocation location = new ProjectLocation();

    // Bidirectional relationship: One Project has many Estimates.
    // Table: estimates, Foreign Key: project_id
    @NonNull
    @Builder.Default
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Estimate> estimates = new ArrayList<>();

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", createdAt=" + getCreatedAt() +
                ", lastUpdatedAt=" + getLastUpdatedAt() +
                ", builder.id=" + builderUser.getId() +
                ", owner.id=" + owner.getId() +
                ", location.id=" + location.getId() +
                ", estimates.size=" + estimates.size() +
                '}';
    }
}
