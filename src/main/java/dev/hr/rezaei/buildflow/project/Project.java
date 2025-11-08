package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.base.UpdatableEntity;
import dev.hr.rezaei.buildflow.estimate.Estimate;
import dev.hr.rezaei.buildflow.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.NonNull;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Project entity representing construction projects in the BuildFlow application.
 * <p>
 * Note: Remember to update the documentation when making changes to this class.
 * <ol>
 *     <li>Project package documentation: "ProjectModel.md"</li>
 *     <li>Base package documentation: "../Model.md"</li>
 * </ol>
 * Instructions for updating the documentation: src/test/resources/instructions/*
 */
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "projects", uniqueConstraints = {
    @UniqueConstraint(name = "uk_projects_location_id", columnNames = "location_id")
})
public class Project extends UpdatableEntity {
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    // Unidirectional relationship: Many Projects can have the same User.
    // Table: projects, Foreign Key: user_id
    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_projects_user"))
    private User user;

    // Role of the main user in the project
    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 50)
    private ProjectRole role;

    // Bidirectional relationship: One Project has many ProjectParticipants.
    // Table: project_participants, Foreign Key: project_id
    @NonNull
    @Builder.Default
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProjectParticipant> participants = new ArrayList<>();

    @NonNull
    @Builder.Default
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "location_id", nullable = false, foreignKey = @ForeignKey(name = "fk_projects_location"))
    private ProjectLocation location = new ProjectLocation();

    // Bidirectional relationship: One Project has many Estimates.
    // Table: estimates, Foreign Key: project_id
    @NonNull
    @Builder.Default
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Estimate> estimates = new ArrayList<>();

    @PrePersist
    private void prePersist() {
        ensureUserAndRole();
    }

    @PreUpdate
    private void preUpdate() {
        ensureUserAndRole();
    }

    private void ensureUserAndRole() {
        if (user == null || role == null) {
            throw new IllegalStateException("Project must have both a user and a role.");
        }
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", createdAt=" + getCreatedAt() +
                ", lastUpdatedAt=" + getLastUpdatedAt() +
                ", user.id=" + (user != null ? user.getId() : "null") +
                ", role=" + role +
                ", participants.size=" + participants.size() +
                ", location.id=" + location.getId() +
                ", estimates.size=" + estimates.size() +
                '}';
    }
}
