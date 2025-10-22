package dev.hr.rezaei.buildflow.quote;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class QuoteLocationTest {
    private QuoteLocation location;

    @BeforeEach
    void setUp() {
        location = QuoteLocation.builder()
                .id(UUID.randomUUID())
                .city("City")
                .build();
    }

    @Test
    void toString_shouldNotThrow_whenNoCycle() {
        assertDoesNotThrow(location::toString);
    }
}
