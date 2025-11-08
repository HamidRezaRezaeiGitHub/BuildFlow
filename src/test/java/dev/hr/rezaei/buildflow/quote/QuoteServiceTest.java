package dev.hr.rezaei.buildflow.quote;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

/**
 * Unit tests for QuoteService focusing on unidirectional relationship queries.
 */
@ExtendWith(MockitoExtension.class)
class QuoteServiceTest {

    @Mock
    private QuoteRepository quoteRepository;

    @InjectMocks
    private QuoteService quoteService;

    private UUID creatorId;
    private UUID supplierId;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        creatorId = UUID.randomUUID();
        supplierId = UUID.randomUUID();
        pageable = PageRequest.of(0, 10);
    }

    @Test
    void getQuotesByCreator_shouldCallRepository() {
        // Given
        Page<Quote> expectedPage = new PageImpl<>(Collections.emptyList());
        when(quoteRepository.findByCreatedById(creatorId, pageable))
                .thenReturn(expectedPage);

        // When
        Page<Quote> result = quoteService.getQuotesByCreator(creatorId, pageable);

        // Then
        assertThat(result).isEqualTo(expectedPage);
        verify(quoteRepository, times(1)).findByCreatedById(creatorId, pageable);
        verifyNoMoreInteractions(quoteRepository);
    }

    @Test
    void getQuotesBySupplier_shouldCallRepository() {
        // Given
        Page<Quote> expectedPage = new PageImpl<>(Collections.emptyList());
        when(quoteRepository.findBySupplierId(supplierId, pageable))
                .thenReturn(expectedPage);

        // When
        Page<Quote> result = quoteService.getQuotesBySupplier(supplierId, pageable);

        // Then
        assertThat(result).isEqualTo(expectedPage);
        verify(quoteRepository, times(1)).findBySupplierId(supplierId, pageable);
        verifyNoMoreInteractions(quoteRepository);
    }

    @Test
    void countQuotesByCreator_shouldCallRepository() {
        // Given
        long expectedCount = 5L;
        when(quoteRepository.countByCreatedById(creatorId))
                .thenReturn(expectedCount);

        // When
        long result = quoteService.countQuotesByCreator(creatorId);

        // Then
        assertThat(result).isEqualTo(expectedCount);
        verify(quoteRepository, times(1)).countByCreatedById(creatorId);
        verifyNoMoreInteractions(quoteRepository);
    }

    @Test
    void countQuotesBySupplier_shouldCallRepository() {
        // Given
        long expectedCount = 3L;
        when(quoteRepository.countBySupplierId(supplierId))
                .thenReturn(expectedCount);

        // When
        long result = quoteService.countQuotesBySupplier(supplierId);

        // Then
        assertThat(result).isEqualTo(expectedCount);
        verify(quoteRepository, times(1)).countBySupplierId(supplierId);
        verifyNoMoreInteractions(quoteRepository);
    }
}
