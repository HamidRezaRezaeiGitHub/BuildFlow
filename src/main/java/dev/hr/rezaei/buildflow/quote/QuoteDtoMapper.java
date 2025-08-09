package dev.hr.rezaei.buildflow.quote;

import dev.hr.rezaei.buildflow.dto.DtoMappingException;
import dev.hr.rezaei.buildflow.base.UpdatableEntityDtoMapper;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.workitem.WorkItem;
import lombok.NonNull;

import java.util.Currency;

import static dev.hr.rezaei.buildflow.util.EnumUtil.fromString;

public class QuoteDtoMapper {

    public static QuoteDto fromQuote(Quote quote) {
        if (quote == null) return null;
        return QuoteDto.builder()
                .id(quote.getId())
                .workItemId(quote.getWorkItem().getId())
                .createdByUserId(quote.getCreatedBy().getId())
                .supplierId(quote.getSupplier().getId())
                .quoteUnit(quote.getUnit().name())
                .unitPrice(quote.getUnitPrice())
                .currency(quote.getCurrency().getCurrencyCode())
                .quoteDomain(quote.getDomain().name())
                .locationDto(QuoteLocationDtoMapper.fromQuoteLocation(quote.getLocation()))
                .valid(quote.isValid())
                .createdAt(UpdatableEntityDtoMapper.toString(quote.getCreatedAt()))
                .lastUpdatedAt(UpdatableEntityDtoMapper.toString(quote.getLastUpdatedAt()))
                .build();
    }


    public static Quote toQuote(@NonNull QuoteDto dto, WorkItem workItem, User createdBy, User supplier) {
        try {
            return map(dto, workItem, createdBy, supplier);
        } catch (Exception e) {
            throw new DtoMappingException("Invalid QuoteDto: " + dto, e);
        }
    }

    private static Quote map(@NonNull QuoteDto dto, WorkItem workItem, User createdBy, User supplier) {
        return Quote.builder()
                .id(dto.getId())
                .workItem(workItem)
                .createdBy(createdBy)
                .supplier(supplier)
                .unit(fromString(QuoteUnit.class, dto.getQuoteUnit()))
                .unitPrice(dto.getUnitPrice())
                .currency(Currency.getInstance(dto.getCurrency()))
                .domain(fromString(QuoteDomain.class, dto.getQuoteDomain()))
                .location(QuoteLocationDtoMapper.toQuoteLocation(dto.getLocationDto()))
                .valid(dto.isValid())
                .createdAt(UpdatableEntityDtoMapper.fromString(dto.getCreatedAt()))
                .lastUpdatedAt(UpdatableEntityDtoMapper.fromString(dto.getLastUpdatedAt()))
                .build();
    }
}
