package dev.hr.rezaei.buildflow.model.estimate;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "estimate_groups")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EstimateGroup {
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    // Bidirectional relationship: Many EstimateGroups belong to one Estimate.
    // Table: estimate_groups, Foreign Key: estimate_id
    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estimate_id", nullable = false)
    private Estimate estimate;

    // Bidirectional relationship: One EstimateGroup has many EstimateLines.
    // Table: estimate_lines, Foreign Key: group_id
    @NonNull
    @Builder.Default
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<EstimateLine> estimateLines = new HashSet<>();

    @Override
    public String toString() {
        return "EstimateGroup{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", estimate.id=" + estimate.getId() +
                ", estimateLines.size=" + estimateLines.size() +
                '}';
    }
}
