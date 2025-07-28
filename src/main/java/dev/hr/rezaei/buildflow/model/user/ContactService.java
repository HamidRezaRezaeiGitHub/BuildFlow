package dev.hr.rezaei.buildflow.model.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;


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
    public Optional<Contact> findById(UUID id) {
        return contactRepository.findById(id);
    }

    /**
     * Update an already persisted Contact.
     * Throws IllegalArgumentException if the contact is not persisted.
     */
    public Contact update(Contact contact) {
        if (contact.getId() == null || !contactRepository.existsById(contact.getId())) {
            throw new IllegalArgumentException("Contact must be already persisted.");
        }
        return contactRepository.save(contact);
    }

    /**
     * Delete an already persisted Contact.
     * Throws IllegalArgumentException if the contact is not persisted.
     */
    public void delete(Contact contact) {
        if (contact.getId() == null || !contactRepository.existsById(contact.getId())) {
            throw new IllegalArgumentException("Contact must be already persisted.");
        }
        contactRepository.delete(contact);
    }

    /**
     * Check if a Contact is persisted.
     */
    public boolean isPersisted(Contact contact) {
        return contact.getId() != null && contactRepository.existsById(contact.getId());
    }
}
