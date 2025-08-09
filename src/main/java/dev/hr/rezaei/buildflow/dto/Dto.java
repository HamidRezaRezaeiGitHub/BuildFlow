package dev.hr.rezaei.buildflow.dto;

import java.util.UUID;

/**
 * This interface is a marker helping to connect DTOs with their respective entities.
 */
public interface Dto<T> {
    UUID getId();
}
