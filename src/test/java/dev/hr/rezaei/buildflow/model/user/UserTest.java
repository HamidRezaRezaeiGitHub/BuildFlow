package dev.hr.rezaei.buildflow.model.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class UserTest {
    private Contact contact;
    private User user;

    @BeforeEach
    void setUp() {
        contact = Mockito.mock(Contact.class);
        user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .registered(true)
                .contact(contact)
                .build();
    }

    @Test
    void toString_shouldNotThrow_whenNoCycle() {
        assertDoesNotThrow(user::toString);
    }
}
