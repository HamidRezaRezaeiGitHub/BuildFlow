package dev.hr.rezaei.buildflow.quote;

import com.fasterxml.jackson.annotation.JsonProperty;
import dev.hr.rezaei.buildflow.base.UpdatableEntityDto;
import dev.hr.rezaei.buildflow.dto.Dto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
@SuperBuilder
public class QuoteDto extends UpdatableEntityDto implements Dto<Quote> {
    private UUID id;
    private UUID workItemId;
    private UUID createdByUserId;
    private UUID supplierId;
    private String quoteUnit;
    private BigDecimal unitPrice;
    private String currency;
    private String quoteDomain;
    
    @JsonProperty("location")
    private QuoteLocationDto locationDto;
    
    private boolean valid;
}

