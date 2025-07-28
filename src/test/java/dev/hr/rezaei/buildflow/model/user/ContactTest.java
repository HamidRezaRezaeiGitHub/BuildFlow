package dev.hr.rezaei.buildflow.model.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class ContactTest {

    private ContactAddress address;
    private Contact contact;

    @BeforeEach
    void setUp() {
        address = Mockito.mock(ContactAddress.class);

        contact = Contact.builder()
                .firstName("John")
                .lastName("Doe")
                .address(address)
                .labels(new ArrayList<>())
                .build();
    }

    @Test
    void toString_shouldNotThrow_whenNoCycle() {
        assertDoesNotThrow(contact::toString);
    }
}
