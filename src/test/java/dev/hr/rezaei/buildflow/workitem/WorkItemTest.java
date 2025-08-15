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
        UUID sameId = testWorkItem.getId();
        WorkItem w1 = WorkItem.builder()
                .id(sameId)
                .code(testWorkItem.getCode())
                .name(testWorkItem.getName())
                .user(testWorkItem.getUser())
                .build();
        WorkItem w2 = WorkItem.builder()
                .id(sameId)
                .code(testWorkItem2.getCode())
                .name(testWorkItem2.getName())
                .user(testWorkItem2.getUser())
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
        WorkItem w1 = createRandomWorkItem();
        w1.setId(UUID.randomUUID());
        WorkItem w2 = createRandomWorkItem();
        w2.setId(UUID.randomUUID());

        assertNotEquals(w1, w2);
        assertNotEquals(w1.hashCode(), w2.hashCode());
    }
}
