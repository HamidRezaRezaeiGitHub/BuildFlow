package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.project.Project;
import dev.hr.rezaei.buildflow.quote.Quote;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * User entity representing system users (builders, owners, etc.).
 * <p>
 * Note: Remember to update the documentation when making changes to this class.
 * <ol>
 *     <li>User package documentation: "UserModel.md"</li>
 *     <li>Base package documentation: "../Model.md"</li>
 * </ol>
 * Instructions for updating the documentation: src/test/resources/instructions/*
 */
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(name = "uk_users_username", columnNames = "username"),
        @UniqueConstraint(name = "uk_users_email", columnNames = "email"),
        @UniqueConstraint(name = "uk_users_contact_id", columnNames = "contact_id")
})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(length = 100, nullable = false)
    private String username;

    @Column(length = 100, nullable = false)
    private String email;

    @Builder.Default
    @Column(nullable = false)
    private boolean registered = false;

    @NonNull
    @Builder.Default
    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "contact_id", nullable = false, foreignKey = @ForeignKey(name = "fk_users_contact"))
    private Contact contact = new Contact();

    // Bidirectional relationship: One User (as builder) can have many Projects.
    // Table: projects, Foreign Key: builder_id
    @NonNull
    @Builder.Default
    @OneToMany(mappedBy = "builderUser", fetch = FetchType.EAGER)
    private List<Project> builtProjects = new ArrayList<>();

    // Bidirectional relationship: One User (as owner) can have many Projects.
    // Table: projects, Foreign Key: owner_id
    @NonNull
    @Builder.Default
    @OneToMany(mappedBy = "owner", fetch = FetchType.EAGER)
    private List<Project> ownedProjects = new ArrayList<>();

    // Bidirectional relationship: One User (as creator) can have many Quotes.
    // Table: quotes, Foreign Key: created_by_id
    @NonNull
    @Builder.Default
    @OneToMany(mappedBy = "createdBy", fetch = FetchType.EAGER)
    private List<Quote> createdQuotes = new ArrayList<>();

    // Bidirectional relationship: One User (as supplier) can have many Quotes.
    // Table: quotes, Foreign Key: supplier_id
    @NonNull
    @Builder.Default
    @OneToMany(mappedBy = "supplier", fetch = FetchType.EAGER)
    private List<Quote> suppliedQuotes = new ArrayList<>();

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", registered=" + registered +
                ", contact.id=" + contact.getId() +
                ", builtProjects.size=" + builtProjects.size() +
                ", ownedProjects.size=" + ownedProjects.size() +
                ", createdQuotes.size=" + createdQuotes.size() +
                ", suppliedQuotes.size=" + suppliedQuotes.size() +
                '}';
    }
}
