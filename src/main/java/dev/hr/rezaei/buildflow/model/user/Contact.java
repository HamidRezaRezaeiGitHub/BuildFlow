package dev.hr.rezaei.buildflow.model.user;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "contacts")
public class Contact {
    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue
    @Column(nullable = false, updatable = false)
    private UUID id;

    @NonNull
    @Column(length = 100, nullable = false)
    private String firstName;

    @NonNull
    @Column(length = 100, nullable = false)
    private String lastName;

    // A table "contact_labels" will be created to store the labels associated with each contact.
    // The table will have a foreign key reference to the "contacts" table.
    // The other column ("label") will be the labels themselves.
    @NonNull
    @Builder.Default
    @ElementCollection(targetClass = ContactLabel.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "contact_labels", joinColumns = @JoinColumn(name = "contact_id"))
    @Column(name = "label", length = 50)
    private List<ContactLabel> labels = new ArrayList<>();

    @NonNull
    @Column(length = 100, nullable = false, unique = true)
    private String email;

    @Column(length = 30)
    private String phone;

    @NonNull
    @Builder.Default
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "address_id")
    private ContactAddress address = new ContactAddress();

    @Override
    public String toString() {
        return "Contact{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", labels.size=" + labels.size() +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", address.id=" + address.getId() +
                '}';
    }
}
