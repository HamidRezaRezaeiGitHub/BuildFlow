package dev.hr.rezaei.buildflow.model.estimate;

import dev.hr.rezaei.buildflow.model.project.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Estimate {
    private UUID id;
    private Project project;
    private LocalDate creationDate;
    private List<EstimateLine> estimateLines;
}

