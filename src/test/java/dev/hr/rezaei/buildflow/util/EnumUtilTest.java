package dev.hr.rezaei.buildflow.util;

import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class EnumUtilTest {
    // Dummy enum for testing
    private enum DummyEnum {
        FOO, BAR, BAZ
    }

    @Test
    void fromString_shouldReturnEnum_whenValidString() {
        assertEquals(DummyEnum.FOO, EnumUtil.fromString(DummyEnum.class, "FOO"));
        assertEquals(DummyEnum.BAR, EnumUtil.fromString(DummyEnum.class, "bar"));
    }

    @Test
    void fromString_shouldReturnNull_whenInvalidString() {
        assertNull(EnumUtil.fromString(DummyEnum.class, "INVALID"));
        assertNull(EnumUtil.fromString(DummyEnum.class, null));
    }

    @Test
    void fromStringOrDefault_shouldReturnEnum_whenValidString() {
        assertEquals(DummyEnum.BAZ, EnumUtil.fromStringOrDefault(DummyEnum.class, "baz", DummyEnum.FOO));
    }

    @Test
    void fromStringOrDefault_shouldReturnDefault_whenInvalidString() {
        assertEquals(DummyEnum.FOO, EnumUtil.fromStringOrDefault(DummyEnum.class, "INVALID", DummyEnum.FOO));
        assertEquals(DummyEnum.FOO, EnumUtil.fromStringOrDefault(DummyEnum.class, null, DummyEnum.FOO));
    }

    @Test
    void fromStrings_shouldReturnEnumList_whenValidStrings() {
        List<String> input = Arrays.asList("foo", "BAR", "baz");
        List<DummyEnum> expected = Arrays.asList(DummyEnum.FOO, DummyEnum.BAR, DummyEnum.BAZ);
        assertEquals(expected, EnumUtil.fromStrings(DummyEnum.class, input));
    }

    @Test
    void fromStrings_shouldIgnoreInvalidStrings() {
        List<String> input = Arrays.asList("foo", "INVALID", "baz");
        List<DummyEnum> expected = Arrays.asList(DummyEnum.FOO, DummyEnum.BAZ);
        assertEquals(expected, EnumUtil.fromStrings(DummyEnum.class, input));
    }

    @Test
    void fromStringsOrDefault_shouldReturnEnumListOrDefault() {
        List<String> input = Arrays.asList("foo", "INVALID", "baz");
        List<DummyEnum> expected = Arrays.asList(DummyEnum.FOO, DummyEnum.FOO, DummyEnum.BAZ);
        assertEquals(expected, EnumUtil.fromStringsOrDefault(DummyEnum.class, input, DummyEnum.FOO));
    }

    @Test
    void fromUniqStrings_shouldReturnUniqueEnumSet() {
        Set<String> input = new HashSet<>(Arrays.asList("foo", "bar", "foo", "baz"));
        Set<DummyEnum> expected = EnumSet.of(DummyEnum.FOO, DummyEnum.BAR, DummyEnum.BAZ);
        assertEquals(expected, EnumUtil.fromUniqStrings(DummyEnum.class, input));
    }

    @Test
    void fromUniqStrings_shouldIgnoreInvalidStrings() {
        Set<String> input = new HashSet<>(Arrays.asList("foo", "INVALID", "baz"));
        Set<DummyEnum> expected = EnumSet.of(DummyEnum.FOO, DummyEnum.BAZ);
        assertEquals(expected, EnumUtil.fromUniqStrings(DummyEnum.class, input));
    }

    @Test
    void fromUniqStringsOrDefault_shouldReturnUniqueEnumSetOrDefault() {
        Set<String> input = new HashSet<>(Arrays.asList("foo", "INVALID", "baz"));
        Set<DummyEnum> expected = EnumSet.of(DummyEnum.FOO, DummyEnum.BAZ);
        // The default will be added for the invalid string
        Set<DummyEnum> actual = EnumUtil.fromUniqStringsOrDefault(DummyEnum.class, input, DummyEnum.BAZ);
        assertEquals(expected, actual);
    }
}
