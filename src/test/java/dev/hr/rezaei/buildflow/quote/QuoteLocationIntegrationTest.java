package dev.hr.rezaei.buildflow.quote;

import dev.hr.rezaei.buildflow.quote.QuoteLocation;
import dev.hr.rezaei.buildflow.quote.QuoteLocationRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.beans.factory.annotation.Autowired;

@DataJpaTest
class QuoteLocationIntegrationTest {
    @Autowired
    private QuoteLocationRepository quoteLocationRepository;

    @Test
    void shouldSaveAndLoadQuoteLocation() {
        QuoteLocation location = new QuoteLocation();
        location.setCity("City");
        quoteLocationRepository.save(location);
        assert quoteLocationRepository.findById(location.getId()).isPresent();
    }
}

