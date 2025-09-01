package dev.hr.rezaei.buildflow.user;

import jakarta.transaction.Transactional;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

/**
 * ContactAddressService providing business logic for contact address management operations.
 * Any save or delete operations on ContactAddress should be done through the cascade from {@link Contact}.
 * <p>
 * Note: Remember to update the documentation when making changes to this class.
 * <ol>
 *     <li>User package documentation: "UserServices.md"</li>
 *     <li>Base package documentation: "../Services.md"</li>
 * </ol>
 * Instructions for updating the documentation: src/test/resources/instructions/*
 */
@Service
public class ContactAddressService {

    private final ContactAddressRepository contactAddressRepository;

    @Autowired
    public ContactAddressService(ContactAddressRepository contactAddressRepository) {
        this.contactAddressRepository = contactAddressRepository;
    }

    /**
     * Find a ContactAddress by its id.
     * Only returns if the address is already persisted.
     */
    public Optional<ContactAddress> findById(@NonNull UUID id) {
        return contactAddressRepository.findById(id);
    }

    /**
     * Update an already persisted ContactAddress.
     * Throws IllegalArgumentException if the address is not persisted.
     */
    @Transactional
    public ContactAddress update(@NonNull ContactAddress address) {
        if (address.getId() == null || !contactAddressRepository.existsById(address.getId())) {
            throw new IllegalArgumentException("ContactAddress must be already persisted.");
        }
        return contactAddressRepository.save(address);
    }

}
