package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.AbstractModelTest;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class ContactAddressTest extends AbstractModelTest {

    @Test
    void toString_shouldNotThrow() {
        assertDoesNotThrow(() -> testBuilderUserContactAddress.toString());
    }

    @Test
    void equals_shouldReturnTrue_forSameId() {
        UUID sameId = testBuilderUserContactAddress.getId();
        ContactAddress address1 = ContactAddress.builder()
                .id(sameId)
                .unitNumber(testBuilderUserContactAddress.getUnitNumber())
                .streetNumber(testBuilderUserContactAddress.getStreetNumber())
                .streetName(testBuilderUserContactAddress.getStreetName())
                .city(testBuilderUserContactAddress.getCity())
                .stateOrProvince(testBuilderUserContactAddress.getStateOrProvince())
                .postalOrZipCode(testBuilderUserContactAddress.getPostalOrZipCode())
                .country(testBuilderUserContactAddress.getCountry())
                .build();
        ContactAddress address2 = ContactAddress.builder()
                .id(sameId)
                .unitNumber(testOwnerUserContactAddress.getUnitNumber())
                .streetNumber(testOwnerUserContactAddress.getStreetNumber())
                .streetName(testOwnerUserContactAddress.getStreetName())
                .city(testOwnerUserContactAddress.getCity())
                .stateOrProvince(testOwnerUserContactAddress.getStateOrProvince())
                .postalOrZipCode(testOwnerUserContactAddress.getPostalOrZipCode())
                .country(testOwnerUserContactAddress.getCountry())
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
        ContactAddress address1 = createRandomContactAddress();
        address1.setId(UUID.randomUUID());
        ContactAddress address2 = createRandomContactAddress();
        address2.setId(UUID.randomUUID());

        // Should not be equal because id is different
        assertNotEquals(address1, address2);
        assertNotEquals(address1.hashCode(), address2.hashCode());
    }
}
