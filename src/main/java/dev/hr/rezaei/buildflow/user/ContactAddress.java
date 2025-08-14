package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.base.BaseAddress;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

/**
 * ContactAddress entity representing address information for contacts.
 * <p>
 * Note: Remember to update the documentation when making changes to this class.
 * <ol>
 *     <li>User package documentation: "UserModel.md"</li>
 *     <li>Base package documentation: "../Model.md"</li>
 * </ol>
 * Instructions for updating the documentation: src/test/resources/instructions/*
 */
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@ToString(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "contact_addresses")
public class ContactAddress extends BaseAddress {
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;
}
