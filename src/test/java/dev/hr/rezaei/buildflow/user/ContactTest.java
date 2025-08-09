package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.AbstractModelTest;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ContactTest extends AbstractModelTest {

    @Test
    void toString_shouldNotThrow_whenNoCycle() {
        assertDoesNotThrow(testContact::toString);
    }

    @Test
    void equals_shouldReturnTrue_forSameId() {
        Contact contact1 = Contact.builder()
                .id(testContact.getId())
                .firstName("John")
                .lastName("Doe")
                .labels(java.util.List.of(ContactLabel.OWNER))
                .email("john.doe@example.com")
                .phone("1234567890")
                .address(testContact.getAddress())
                .build();
        Contact contact2 = Contact.builder()
                .id(testContact.getId())
                .firstName("Jane")
                .lastName("Smith")
                .labels(java.util.List.of(ContactLabel.SUPPLIER))
                .email("jane.smith@example.com")
                .phone("0987654321")
                .address(testContact.getAddress())
                .build();
        // Should be equal because id is the same
        assertDoesNotThrow(() -> contact1.equals(contact2));
        assertDoesNotThrow(() -> contact2.equals(contact1));
        assertDoesNotThrow(contact1::hashCode);
        assertDoesNotThrow(contact2::hashCode);
        assertEquals(contact1, contact2);
        assertEquals(contact1.hashCode(), contact2.hashCode());
    }

    @Test
    void equals_shouldReturnFalse_forDifferentId() {
        Contact contact1 = Contact.builder()
                .id(UUID.randomUUID())
                .firstName("John")
                .lastName("Doe")
                .labels(List.of(ContactLabel.OWNER))
                .email("john.doe@example.com")
                .phone("1234567890")
                .address(testContact.getAddress())
                .build();
        Contact contact2 = Contact.builder()
                .id(UUID.randomUUID())
                .firstName("John")
                .lastName("Doe")
                .labels(List.of(ContactLabel.OWNER))
                .email("john.doe@example.com")
                .phone("1234567890")
                .address(testContact.getAddress())
                .build();
        // Should not be equal because id is different
        assertNotEquals(contact1, contact2);
        assertNotEquals(contact1.hashCode(), contact2.hashCode());
    }
}
