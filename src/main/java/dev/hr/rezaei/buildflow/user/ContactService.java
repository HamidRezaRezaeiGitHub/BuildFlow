package dev.hr.rezaei.buildflow.user;

import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

/**
 * ContactService providing business logic for contact management operations.
 * <p>
 * Note: Remember to update the documentation when making changes to this class.
 * <ol>
 *     <li>User package documentation: "UserServices.md"</li>
 *     <li>Base package documentation: "../Services.md"</li>
 * </ol>
 * Instructions for updating the documentation: src/test/resources/instructions/*
 */
@Service
public class ContactService {

    private final ContactRepository contactRepository;

    @Autowired
    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    /**
     * Find a Contact by its id.
     * Only returns if the contact is already persisted.
     */
    public Optional<Contact> findById(@NonNull UUID id) {
        return contactRepository.findById(id);
    }

    /**
     * Save a new Contact.
     * Throws IllegalArgumentException if the contact is already persisted or if a contact with the same email exists.
     */
    public Contact save(@NonNull Contact contact) {
        if (contact.getId() != null && contactRepository.existsById(contact.getId())) {
            throw new IllegalArgumentException("Contact is already persisted.");
        }
        if (existsByEmail(contact.getEmail())) {
            throw new IllegalArgumentException("A contact with this email already exists.");
        }
        return contactRepository.save(contact);
    }

    /**
     * Update an already persisted Contact.
     * Throws IllegalArgumentException if the contact is not persisted.
     */
    public Contact update(@NonNull Contact contact) {
        if (contact.getId() == null || !contactRepository.existsById(contact.getId())) {
            throw new IllegalArgumentException("Contact must be already persisted.");
        }
        return contactRepository.save(contact);
    }

    /**
     * Delete an already persisted Contact.
     * Throws IllegalArgumentException if the contact is not persisted.
     */
    public void delete(@NonNull Contact contact) {
        if (contact.getId() == null || !contactRepository.existsById(contact.getId())) {
            throw new IllegalArgumentException("Contact must be already persisted.");
        }
        contactRepository.delete(contact);
    }

    /**
     * Check if a Contact is persisted.
     */
    public boolean isPersisted(@NonNull Contact contact) {
        return contact.getId() != null && contactRepository.existsById(contact.getId());
    }

    public boolean existsByEmail(@NonNull String email) {
        return contactRepository.existsByEmail(email);
    }

    public Optional<Contact> findByEmail(@NonNull String email) {
        return contactRepository.findByEmail(email);
    }

}
