package dev.hr.rezaei.buildflow.quote;

import dev.hr.rezaei.buildflow.AbstractModelJpaTest;
import dev.hr.rezaei.buildflow.user.User;
import dev.hr.rezaei.buildflow.workitem.WorkItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.Currency;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for QuoteRepository focusing on the unidirectional
 * Quote -> User relationship and query methods.
 */
@DataJpaTest
class QuoteRepositoryIntegrationTest extends AbstractModelJpaTest {

    @Autowired
    private QuoteRepository quoteRepository;

    private User creator;
    private User supplier;
    private User anotherUser;
    private WorkItem workItem;

    @BeforeEach
    void setUp() {
        // Create and save users
        creator = createRandomBuilderUser();
        supplier = createRandomBuilderUser();
        anotherUser = createRandomBuilderUser();
        
        persistUserDependencies(creator);
        persistUserDependencies(supplier);
        persistUserDependencies(anotherUser);
        
        userRepository.save(creator);
        userRepository.save(supplier);
        userRepository.save(anotherUser);

        // Create and save work item
        workItem = createRandomWorkItem();
        persistWorkItemDependencies(workItem);
        workItemRepository.save(workItem);
    }

    @Test
    void findByCreatedById_shouldReturnQuotesCreatedByUser() {
        // Given: quotes created by different users
        Quote quote1 = createQuote(creator, supplier);
        Quote quote2 = createQuote(creator, supplier);
        Quote quote3 = createQuote(anotherUser, supplier);
        
        quoteRepository.save(quote1);
        quoteRepository.save(quote2);
        quoteRepository.save(quote3);

        // When: searching for quotes by creator
        Pageable pageable = PageRequest.of(0, 10, Sort.by("id"));
        Page<Quote> result = quoteRepository.findByCreatedById(creator.getId(), pageable);

        // Then: only quotes created by the specific user are returned
        assertThat(result).isNotNull();
        assertThat(result.getTotalElements()).isEqualTo(2);
        assertThat(result.getContent())
                .hasSize(2)
                .extracting(Quote::getCreatedBy)
                .containsOnly(creator);
    }

    @Test
    void findBySupplierId_shouldReturnQuotesSuppliedByUser() {
        // Given: quotes with different suppliers
        Quote quote1 = createQuote(creator, supplier);
        Quote quote2 = createQuote(creator, supplier);
        Quote quote3 = createQuote(creator, anotherUser);
        
        quoteRepository.save(quote1);
        quoteRepository.save(quote2);
        quoteRepository.save(quote3);

        // When: searching for quotes by supplier
        Pageable pageable = PageRequest.of(0, 10, Sort.by("id"));
        Page<Quote> result = quoteRepository.findBySupplierId(supplier.getId(), pageable);

        // Then: only quotes supplied by the specific user are returned
        assertThat(result).isNotNull();
        assertThat(result.getTotalElements()).isEqualTo(2);
        assertThat(result.getContent())
                .hasSize(2)
                .extracting(Quote::getSupplier)
                .containsOnly(supplier);
    }

    @Test
    void findByCreatedById_shouldSupportPagination() {
        // Given: multiple quotes created by same user
        for (int i = 0; i < 5; i++) {
            Quote quote = createQuote(creator, supplier);
            quoteRepository.save(quote);
        }

        // When: requesting first page with size 2
        Pageable pageable = PageRequest.of(0, 2, Sort.by("id"));
        Page<Quote> result = quoteRepository.findByCreatedById(creator.getId(), pageable);

        // Then: pagination works correctly
        assertThat(result.getTotalElements()).isEqualTo(5);
        assertThat(result.getTotalPages()).isEqualTo(3);
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.isFirst()).isTrue();
        assertThat(result.hasNext()).isTrue();
    }

    @Test
    void countByCreatedById_shouldReturnCorrectCount() {
        // Given: quotes created by different users
        quoteRepository.save(createQuote(creator, supplier));
        quoteRepository.save(createQuote(creator, supplier));
        quoteRepository.save(createQuote(anotherUser, supplier));

        // When: counting quotes by creator
        long count = quoteRepository.countByCreatedById(creator.getId());

        // Then: correct count is returned
        assertThat(count).isEqualTo(2);
    }

    @Test
    void countBySupplierId_shouldReturnCorrectCount() {
        // Given: quotes with different suppliers
        quoteRepository.save(createQuote(creator, supplier));
        quoteRepository.save(createQuote(creator, supplier));
        quoteRepository.save(createQuote(creator, anotherUser));

        // When: counting quotes by supplier
        long count = quoteRepository.countBySupplierId(supplier.getId());

        // Then: correct count is returned
        assertThat(count).isEqualTo(2);
    }

    @Test
    void fetchingUser_shouldNotLoadQuotes() {
        // Given: a user with created quotes
        quoteRepository.save(createQuote(creator, supplier));
        quoteRepository.save(createQuote(creator, supplier));

        // When: fetching the user
        User fetchedUser = userRepository.findById(creator.getId()).orElseThrow();

        // Then: user is fetched but quotes are not eagerly loaded
        // (This is ensured by LAZY fetch type on Quote.createdBy and Quote.supplier)
        assertThat(fetchedUser).isNotNull();
        assertThat(fetchedUser.getId()).isEqualTo(creator.getId());
        // No quotes collection on User entity to verify
    }

    @Test
    void findByCreatedById_shouldReturnEmptyPage_whenNoQuotes() {
        // When: searching for quotes by user with no created quotes
        Pageable pageable = PageRequest.of(0, 10);
        Page<Quote> result = quoteRepository.findByCreatedById(anotherUser.getId(), pageable);

        // Then: empty page is returned
        assertThat(result).isNotNull();
        assertThat(result.getTotalElements()).isZero();
        assertThat(result.getContent()).isEmpty();
    }

    private Quote createQuote(User createdBy, User supplier) {
        return Quote.builder()
                .workItem(workItem)
                .createdBy(createdBy)
                .supplier(supplier)
                .unit(QuoteUnit.EACH)
                .unitPrice(BigDecimal.valueOf(100.00))
                .currency(Currency.getInstance("USD"))
                .domain(QuoteDomain.PUBLIC)
                .location(QuoteLocation.builder()
                        .city("Test City")
                        .stateOrProvince("TS")
                        .country("Test Country")
                        .build())
                .valid(true)
                .build();
    }
}
