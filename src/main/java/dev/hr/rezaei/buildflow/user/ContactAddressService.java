package dev.hr.rezaei.buildflow.user;

import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

/**
 * Any save or delete operations on ContactAddress should be done through the cascade from {@link Contact}.
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
    public ContactAddress update(@NonNull ContactAddress address) {
        if (address.getId() == null || !contactAddressRepository.existsById(address.getId())) {
            throw new IllegalArgumentException("ContactAddress must be already persisted.");
        }
        return contactAddressRepository.save(address);
    }

}
