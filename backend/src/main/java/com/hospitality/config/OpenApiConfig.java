package com.hospitality.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI hospitalityOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hospitality - Healthcare Admission & Care Journey Intelligence API")
                        .description("Decision-support REST APIs for insurance extraction, deterministic hospital matching, and care journey guidance.")
                        .version("1.0.0")
                        .contact(new Contact().name("Hospitality Team").email("support@hospitality-health.ai"))
                        .license(new License().name("Apache 2.0").url("https://springdoc.org")));
    }
}
