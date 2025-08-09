package dev.hr.rezaei.buildflow.base;

import lombok.NonNull;

import java.time.Instant;

public class UpdatableEntityDtoMapper {

    public static String toString(@NonNull Instant instant) {
        return instant.toString();
    }

    public static Instant fromString(@NonNull String instant) {
        return Instant.parse(instant);
    }
}
