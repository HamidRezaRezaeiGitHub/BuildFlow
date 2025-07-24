package dev.hr.rezaei.buildflow.model.estimate;

import dev.hr.rezaei.buildflow.model.base.UpdatableEntity;
import dev.hr.rezaei.buildflow.model.project.Project;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "estimates")
public class Estimate extends UpdatableEntity {
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Builder.Default
    @Column(nullable = false)
    private double overallMultiplier = 1.0;

    // Bidirectional relationship: One Estimate has many EstimateGroups.
    // Table: estimate_groups, Foreign Key: estimate_id
    @NonNull
    @Builder.Default
    @OneToMany(mappedBy = "estimate", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<EstimateGroup> groups = new HashSet<>();

    @Override
    public String toString() {
        return "Estimate{" +
                "id=" + id +
                ", createdAt=" + getCreatedAt() +
                ", lastUpdatedAt=" + getLastUpdatedAt() +
                ", project.id=" + project.getId() +
                ", overallMultiplier=" + overallMultiplier +
                ", groups.size=" + groups.size() +
                '}';
    }

}
