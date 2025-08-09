package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.AbstractModelTest;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class ContactAddressTest extends AbstractModelTest {

    @Test
    void toString_shouldNotThrow() {
        assertDoesNotThrow(() -> testContactAddress.toString());
    }

    @Test
    void equals_shouldReturnTrue_forSameId() {
        ContactAddress address1 = ContactAddress.builder()
                .id(testContactAddress.getId())
                .unitNumber("1")
                .streetNumber("100")
                .streetName("Main St")
                .city("Testville")
                .stateOrProvince("TS")
                .postalOrZipCode("12345")
                .country("Testland")
                .build();
        ContactAddress address2 = ContactAddress.builder()
                .id(testContactAddress.getId())
                .unitNumber("2")
                .streetNumber("200")
                .streetName("Other St")
                .city("Otherville")
                .stateOrProvince("OS")
                .postalOrZipCode("54321")
                .country("Otherland")
                .build();
        // Should be equal because id is the same
        assertDoesNotThrow(() -> address1.equals(address2));
        assertDoesNotThrow(() -> address2.equals(address1));
        assertDoesNotThrow(address1::hashCode);
        assertDoesNotThrow(address2::hashCode);
        assertEquals(address1, address2);
        assertEquals(address1.hashCode(), address2.hashCode());
    }

    @Test
    void equals_shouldReturnFalse_forDifferentId() {
        ContactAddress address1 = ContactAddress.builder()
                .id(UUID.randomUUID())
                .unitNumber("1")
                .streetNumber("100")
                .streetName("Main St")
                .city("Testville")
                .stateOrProvince("TS")
                .postalOrZipCode("12345")
                .country("Testland")
                .build();
        ContactAddress address2 = ContactAddress.builder()
                .id(UUID.randomUUID())
                .unitNumber("1")
                .streetNumber("100")
                .streetName("Main St")
                .city("Testville")
                .stateOrProvince("TS")
                .postalOrZipCode("12345")
                .country("Testland")
                .build();
        // Should not be equal because id is different
        assertNotEquals(address1, address2);
        assertNotEquals(address1.hashCode(), address2.hashCode());
    }
}
