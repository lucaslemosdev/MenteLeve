package com.menteleve.api.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração para carregar variáveis de ambiente do arquivo .env
 * 
 * Esta classe carrega as variáveis do arquivo .env (se existir) na raiz do projeto
 * durante a inicialização da aplicação Spring Boot.
 * 
 * O arquivo .env é opcional e não deve ser versionado (incluído no .gitignore).
 * Use .env.example como template para criar seu próprio .env local.
 */
@Configuration
public class EnvironmentConfig {

    public EnvironmentConfig() {
        // Carrega variáveis de ambiente do arquivo .env se ele existir
        // Usa valores do sistema como fallback
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        // Popula as variáveis de ambiente do .env para o System.getenv()
        // para que o Spring Boot possa acessá-las via @Value
        dotenv.entries().forEach(entry -> 
            System.setProperty(entry.getKey(), entry.getValue())
        );
    }
}
