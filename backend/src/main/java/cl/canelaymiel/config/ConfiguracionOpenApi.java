package cl.canelaymiel.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// Agrega el botón "Authorize" de Swagger para probar con el token Bearer.
@Configuration
public class ConfiguracionOpenApi {

    @Bean
    public OpenAPI canelaOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Canela & Miel API")
                        .version("1.0")
                        .description("Tienda de pastelería artesanal: productos, pedidos, usuarios y cupones."))
                .components(new Components().addSecuritySchemes("bearer",
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))
                .addSecurityItem(new SecurityRequirement().addList("bearer"));
    }
}
