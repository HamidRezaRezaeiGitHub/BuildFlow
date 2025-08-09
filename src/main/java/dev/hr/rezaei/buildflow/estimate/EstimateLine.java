package dev.hr.rezaei.buildflow.estimate;

import dev.hr.rezaei.buildflow.base.UpdatableEntity;
import dev.hr.rezaei.buildflow.workitem.WorkItem;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.UUID;

@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "estimate_lines")
public class EstimateLine extends UpdatableEntity {
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estimate_id", nullable = false)
    private Estimate estimate;

    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_item_id", nullable = false)
    private WorkItem workItem;

    @Column(nullable = false)
    private double quantity;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private EstimateLineStrategy estimateStrategy;

    @Builder.Default
    @Column(nullable = false)
    private double multiplier = 1.0;

    @Column(precision = 17, scale = 2)
    private BigDecimal computedCost;

    // Bidirectional relationship: Many EstimateLines belong to one EstimateGroup.
    // Table: estimate_lines, Foreign Key: group_id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private EstimateGroup group;

    @PrePersist
    @PreUpdate
    private void validate() {
        if (quantity < 0) {
            throw new IllegalArgumentException("Quantity must be greater than or equal to zero.");
        }
        if (multiplier < 0) {
            throw new IllegalArgumentException("Multiplier must be greater than or equal to zero.");
        }
        if (computedCost != null && computedCost.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Computed cost must be greater than or equal to zero.");
        }
    }

    @Override
    public String toString() {
        return "EstimateLine{" +
                "id=" + id +
                ", createdAt=" + getCreatedAt() +
                ", lastUpdatedAt=" + getLastUpdatedAt() +
                ", estimate.id=" + estimate.getId() +
                ", workItem.id=" + workItem.getId() +
                ", quantity=" + quantity +
                ", estimateStrategy=" + estimateStrategy +
                ", multiplier=" + multiplier +
                ", computedCost=" + computedCost +
                ", group=" + (group == null ? null : group.getId()) +
                '}';
    }
}
