package dev.hr.rezaei.buildflow.model.user;

import dev.hr.rezaei.buildflow.model.project.Project;
import dev.hr.rezaei.buildflow.model.quote.Quote;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
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

    @Column(length = 100, nullable = false, unique = true)
    private String username;

    @Column(length = 100, nullable = false, unique = true)
    private String email;

    @Builder.Default
    @Column(nullable = false)
    private boolean registered = false;

    @NonNull
    @Builder.Default
    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact = new Contact();

    // Bidirectional relationship: One User (as builder) can have many Projects.
    // Table: projects, Foreign Key: builder_id
    @NonNull
    @Builder.Default
    @OneToMany(mappedBy = "builderUser", fetch = FetchType.LAZY)
    private List<Project> builtProjects = new ArrayList<>();

    // Bidirectional relationship: One User (as owner) can have many Projects.
    // Table: projects, Foreign Key: owner_id
    @NonNull
    @Builder.Default
    @OneToMany(mappedBy = "owner", fetch = FetchType.LAZY)
    private List<Project> ownedProjects = new ArrayList<>();

    // Bidirectional relationship: One User (as creator) can have many Quotes.
    // Table: quotes, Foreign Key: created_by_id
    @NonNull
    @Builder.Default
    @OneToMany(mappedBy = "createdBy", fetch = FetchType.LAZY)
    private List<Quote> createdQuotes = new ArrayList<>();

    // Bidirectional relationship: One User (as supplier) can have many Quotes.
    // Table: quotes, Foreign Key: supplier_id
    @NonNull
    @Builder.Default
    @OneToMany(mappedBy = "supplier", fetch = FetchType.LAZY)
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
