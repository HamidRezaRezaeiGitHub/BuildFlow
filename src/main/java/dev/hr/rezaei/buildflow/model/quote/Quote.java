package dev.hr.rezaei.buildflow.model.quote;

import dev.hr.rezaei.buildflow.model.address.Address;
import dev.hr.rezaei.buildflow.model.workitem.WorkItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Currency;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quote {
    private UUID id;
    private WorkItem workItem;
    private LocalDate quoteDate;
    private String supplierName;
    private String supplierContact;
    private BigDecimal unitPrice;
    private double squareFootage;
    private Address address;
    private Currency currency;
}

