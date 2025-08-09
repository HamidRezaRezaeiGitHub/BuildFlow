package dev.hr.rezaei.buildflow.user;

import dev.hr.rezaei.buildflow.AbstractModelTest;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class UserTest extends AbstractModelTest {

    @Test
    void toString_shouldNotThrow_whenNoCycle() {
        assertDoesNotThrow(testUser::toString);
    }

    @Test
    void equals_shouldReturnTrue_forSameId() {
        User user1 = User.builder()
                .id(testUser.getId())
                .username("user1")
                .email("user1@example.com")
                .registered(true)
                .contact(testUser.getContact())
                .build();
        User user2 = User.builder()
                .id(testUser.getId())
                .username("user2")
                .email("user2@example.com")
                .registered(false)
                .contact(testUser.getContact())
                .build();
        // Should be equal because id is the same
        assertDoesNotThrow(() -> user1.equals(user2));
        assertDoesNotThrow(() -> user2.equals(user1));
        assertDoesNotThrow(user1::hashCode);
        assertDoesNotThrow(user2::hashCode);
        assertEquals(user1, user2);
        assertEquals(user1.hashCode(), user2.hashCode());
    }

    @Test
    void equals_shouldReturnFalse_forDifferentId() {
        User user1 = User.builder()
                .id(UUID.randomUUID())
                .username("user1")
                .email("user1@example.com")
                .registered(true)
                .contact(testUser.getContact())
                .build();
        User user2 = User.builder()
                .id(UUID.randomUUID())
                .username("user1")
                .email("user1@example.com")
                .registered(true)
                .contact(testUser.getContact())
                .build();
        // Should not be equal because id is different
        assertNotEquals(user1, user2);
        assertNotEquals(user1.hashCode(), user2.hashCode());
    }
}
