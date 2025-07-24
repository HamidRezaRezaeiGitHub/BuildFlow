package dev.hr.rezaei.buildflow.model.quote;

import dev.hr.rezaei.buildflow.model.base.UpdatableEntity;
import dev.hr.rezaei.buildflow.model.estimate.WorkItem;
import dev.hr.rezaei.buildflow.model.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.Currency;
import java.util.UUID;

@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "quotes")
public class Quote extends UpdatableEntity {
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    // Many Quotes can reference the same WorkItem.
    // Table: quotes, Foreign Key: work_item_id
    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_item_id", nullable = false)
    private WorkItem workItem;

    // Many Quotes can be created by the same User.
    // Table: quotes, Foreign Key: created_by_id
    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    // Many Quotes can reference the same supplier User.
    // Table: quotes, Foreign Key: supplier_id
    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private User supplier;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private QuoteUnit unit;

    @Column(precision = 17, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    @NonNull
    @Column(nullable = false)
    private Currency currency;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private QuoteDomain domain;

    @NonNull
    @Builder.Default
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "location_id", nullable = false)
    private QuoteLocation location = new QuoteLocation();

    @Builder.Default
    @Column(nullable = false)
    private boolean valid = true;

    @Override
    public String toString() {
        return "Quote{" +
                "id=" + id +
                ", createdAt=" + getCreatedAt() +
                ", lastUpdatedAt=" + getLastUpdatedAt() +
                ", workItem.id=" + workItem.getId() +
                ", createdBy.id=" + createdBy.getId() +
                ", supplier.id=" + supplier.getId() +
                ", unit=" + unit +
                ", unitPrice=" + unitPrice +
                ", currency=" + currency +
                ", domain=" + domain +
                ", location.id=" + location.getId() +
                ", valid=" + valid +
                '}';
    }
}
