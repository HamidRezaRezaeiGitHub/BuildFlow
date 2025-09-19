package dev.hr.rezaei.buildflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class BuildFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(BuildFlowApplication.class, args);
    }
}
