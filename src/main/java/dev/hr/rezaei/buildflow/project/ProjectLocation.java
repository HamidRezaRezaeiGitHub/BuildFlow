package dev.hr.rezaei.buildflow.project;


import dev.hr.rezaei.buildflow.base.BaseAddress;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

/**
 * ProjectLocation entity representing address information for project locations.
 * <p>
 * Note: Remember to update the documentation when making changes to this class.
 * <ol>
 *     <li>Project package documentation: "ProjectModel.md"</li>
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
@Table(name = "project_locations")
public class ProjectLocation extends BaseAddress {
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;
}
