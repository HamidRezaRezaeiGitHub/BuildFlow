package dev.hr.rezaei.buildflow.project;

import dev.hr.rezaei.buildflow.user.Contact;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * ProjectParticipant entity representing a participant in a project with a specific role.
 * <p>
 * Note: Remember to update the documentation when making changes to this class.
 * <ol>
 *     <li>Project package documentation: "ProjectModel.md"</li>
 *     <li>Base package documentation: "../Model.md"</li>
 * </ol>
 * Instructions for updating the documentation: src/test/resources/instructions/*
 */
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "project_participants")
public class ProjectParticipant {
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    // Bidirectional relationship: Many ProjectParticipants can belong to one Project.
    // Table: project_participants, Foreign Key: project_id
    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false, foreignKey = @ForeignKey(name = "fk_project_participant_project"))
    private Project project;

    // Role of the participant in the project
    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 50)
    private ProjectRole role;

    // Unidirectional relationship: Many ProjectParticipants can reference one Contact.
    // Table: project_participants, Foreign Key: contact_id
    @NonNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false, foreignKey = @ForeignKey(name = "fk_project_participant_contact"))
    private Contact contact;

    @Override
    public String toString() {
        return "ProjectParticipant{" +
                "id=" + id +
                ", project.id=" + (project != null ? project.getId() : "null") +
                ", role=" + role +
                ", contact.id=" + (contact != null ? contact.getId() : "null") +
                '}';
    }
}
