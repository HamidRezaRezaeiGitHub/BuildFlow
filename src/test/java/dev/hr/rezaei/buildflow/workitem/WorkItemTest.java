package dev.hr.rezaei.buildflow.workitem;

import dev.hr.rezaei.buildflow.AbstractModelTest;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class WorkItemTest extends AbstractModelTest  {

    @Test
    void toString_shouldNotThrow_whenNoCycle() {
        assertDoesNotThrow(testWorkItem::toString);
    }

    @Test
    void equals_shouldReturnTrue_forSameId() {
        WorkItem w1 = WorkItem.builder()
                .id(testWorkItem.getId())
                .code("A")
                .name("A")
                .user(testBuilderUser)
                .build();
        WorkItem w2 = WorkItem.builder()
                .id(testWorkItem.getId())
                .code("B")
                .name("B")
                .user(testBuilderUser)
                .build();
        assertDoesNotThrow(() -> w1.equals(w2));
        assertDoesNotThrow(() -> w2.equals(w1));
        assertDoesNotThrow(w1::hashCode);
        assertDoesNotThrow(w2::hashCode);
        assertEquals(w1, w2);
        assertEquals(w1.hashCode(), w2.hashCode());
    }

    @Test
    void equals_shouldReturnFalse_forDifferentId() {
        WorkItem w1 = WorkItem.builder()
                .id(UUID.randomUUID())
                .code("A")
                .name("A")
                .user(testBuilderUser)
                .build();
        WorkItem w2 = WorkItem.builder()
                .id(UUID.randomUUID())
                .code("A")
                .name("A")
                .user(testBuilderUser)
                .build();
        assertNotEquals(w1, w2);
        assertNotEquals(w1.hashCode(), w2.hashCode());
    }

}

