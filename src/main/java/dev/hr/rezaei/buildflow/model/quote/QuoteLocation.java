package dev.hr.rezaei.buildflow.model.quote;


import dev.hr.rezaei.buildflow.model.base.BaseAddress;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@ToString(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "quote_locations")
public class QuoteLocation extends BaseAddress {
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;
}
