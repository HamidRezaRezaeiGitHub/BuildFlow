package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.AbstractModelTest;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ContactTest extends AbstractModelTest {

    @Test
    void toString_shouldNotThrow_whenNoCycle() {
        assertDoesNotThrow(testBuilderUserContact::toString);
    }

    @Test
    void equals_shouldReturnTrue_forSameId() {
        UUID sameId = testBuilderUserContact.getId();
        Contact contact1 = Contact.builder()
                .id(sameId)
                .firstName(testBuilderUserContact.getFirstName())
                .lastName(testBuilderUserContact.getLastName())
                .labels(testBuilderUserContact.getLabels())
                .email(testBuilderUserContact.getEmail())
                .phone(testBuilderUserContact.getPhone())
                .address(testBuilderUserContact.getAddress())
                .build();
        Contact contact2 = Contact.builder()
                .id(sameId)
                .firstName(testOwnerUserContact.getFirstName())
                .lastName(testOwnerUserContact.getLastName())
                .labels(testOwnerUserContact.getLabels())
                .email(testOwnerUserContact.getEmail())
                .phone(testOwnerUserContact.getPhone())
                .address(testOwnerUserContact.getAddress())
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
        Contact contact1 = createRandomContact();
        contact1.setId(UUID.randomUUID());
        Contact contact2 = createRandomContact();
        contact2.setId(UUID.randomUUID());

        // Should not be equal because id is different
        assertNotEquals(contact1, contact2);
        assertNotEquals(contact1.hashCode(), contact2.hashCode());
    }
}
