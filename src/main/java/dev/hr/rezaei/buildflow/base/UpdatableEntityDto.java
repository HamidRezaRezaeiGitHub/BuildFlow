package dev.hr.rezaei.buildflow.base;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class UpdatableEntityDto {
    private String createdAt;
    private String lastUpdatedAt;
}
