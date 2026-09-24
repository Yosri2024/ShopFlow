package org.example;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class ShopFlowApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    void applicationStarts() {
        // Verifies Spring context with H2 dev profile and data.sql
    }
}
