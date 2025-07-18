package dev.hr.rezaei.buildflow.model.address;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class AddressRepositoryTest {

    @Autowired
    private AddressRepository addressRepository;

    private Address address;

    @BeforeEach
    void setUp() {
        address = Address.builder()
                .unitNumber("12A")
                .streetNumber("123")
                .streetName("Main St")
                .city("Springfield")
                .stateOrProvince("IL")
                .postalCode("62704")
                .country("USA")
                .build();
    }

    @AfterEach
    void tearDown() {
        addressRepository.deleteAll();
    }

    @Test
    void save_shouldPersistAddress_whenAddressIsValid() {
        Address saved = addressRepository.save(address);
        Optional<Address> found = addressRepository.findById(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("Main St", found.get().getStreetName());
    }

    @Test
    void save_shouldUpdateAddress_whenCityIsChanged() {
        Address saved = addressRepository.save(address);
        saved.setCity("Chicago");
        Address updated = addressRepository.save(saved);
        assertEquals("Chicago", updated.getCity());
    }

    @Test
    void deleteById_shouldRemoveAddress_whenAddressExists() {
        Address saved = addressRepository.save(address);
        addressRepository.deleteById(saved.getId());
        Optional<Address> found = addressRepository.findById(saved.getId());
        assertFalse(found.isPresent());
    }

    @Test
    void findAll_shouldReturnAllAddresses_whenMultipleAddressesExist() {
        addressRepository.save(address);
        addressRepository.save(Address.builder()
                .unitNumber("34B")
                .streetNumber("456")
                .streetName("Elm St")
                .city("Springfield")
                .stateOrProvince("IL")
                .postalCode("62705")
                .country("USA")
                .build());
        assertEquals(2, addressRepository.findAll().size());
    }
}
