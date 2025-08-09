package dev.hr.rezaei.buildflow.quote;

import dev.hr.rezaei.buildflow.quote.Quote;
import dev.hr.rezaei.buildflow.quote.QuoteDomain;
import dev.hr.rezaei.buildflow.quote.QuoteLocation;
import dev.hr.rezaei.buildflow.quote.QuoteUnit;
import dev.hr.rezaei.buildflow.workitem.WorkItem;
import dev.hr.rezaei.buildflow.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.Currency;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class QuoteTest {
    private WorkItem workItem;
    private User createdBy;
    private User supplier;
    private QuoteLocation location;
    private Quote quote;

    @BeforeEach
    void setUp() {
        workItem = Mockito.mock(WorkItem.class);
        createdBy = Mockito.mock(User.class);
        supplier = Mockito.mock(User.class);
        location = Mockito.mock(QuoteLocation.class);

        quote = Quote.builder()
                .workItem(workItem)
                .createdBy(createdBy)
                .supplier(supplier)
                .unit(QuoteUnit.EACH)
                .unitPrice(BigDecimal.ONE)
                .currency(Currency.getInstance("USD"))
                .domain(QuoteDomain.PUBLIC)
                .location(location)
                .valid(true)
                .build();
    }

    @Test
    void toString_shouldNotThrow_whenNoCycle() {
        assertDoesNotThrow(quote::toString);
    }
}
