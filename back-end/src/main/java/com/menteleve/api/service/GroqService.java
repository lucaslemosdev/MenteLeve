package com.menteleve.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class GroqService {

    private final RestClient restClient;

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.api.model}")
    private String model;

    private static final String SYSTEM_PROMPT = """
            Você é um assistente de bem-estar emocional do aplicativo Mente Leve.
            Gere UMA mensagem curta (máximo 2 frases), acolhedora e emocionalmente segura, em português brasileiro,
            para uma pessoa que pode estar enfrentando ansiedade, estresse ou tristeza.
            
            Regras:
            - Evite positividade tóxica (ex: "Nunca desista", "Você consegue tudo", "Você é mais forte do que pensa")
            - Evite promessas de cura ou linguagem médica
            - Evite tom de coach ou pressão para produtividade
            - Use tom humano, leve, gentil e confortável
            - A mensagem deve transmitir acolhimento, não cobrança
            - Não use aspas ao redor da mensagem
            - Responda APENAS com a mensagem, sem explicações adicionais
            """;

    public GroqService() {
        this.restClient = RestClient.create();
    }

    @SuppressWarnings("unchecked")
    public String gerarMensagemMotivacional() {
        try {
            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", SYSTEM_PROMPT),
                            Map.of("role", "user", "content",
                                    "Gere uma nova mensagem acolhedora e única para hoje.")
                    ),
                    "temperature", 0.9,
                    "max_tokens", 150
            );

            Map<String, Object> response = restClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            if (response == null) {
                throw new RuntimeException("Resposta vazia da API Groq");
            }

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> messageObj = (Map<String, Object>) choices.get(0).get("message");
            String message = ((String) messageObj.get("content")).trim();

            // Remove aspas ao redor se a IA incluir
            if (message.startsWith("\"") && message.endsWith("\"")) {
                message = message.substring(1, message.length() - 1);
            }

            return message;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar mensagem motivacional via IA: " + e.getMessage(), e);
        }
    }
}
