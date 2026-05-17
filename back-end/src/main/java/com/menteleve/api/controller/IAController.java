package com.menteleve.api.controller;

import com.menteleve.api.service.GroqService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ia")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class IAController {

    private final GroqService groqService;

    @PostMapping("/mensagem-motivacional")
    public ResponseEntity<Map<String, String>> gerarMensagem() {
        String mensagem = groqService.gerarMensagemMotivacional();
        return ResponseEntity.ok(Map.of(
                "mensagem", mensagem,
                "autor", "Mente Leve IA"
        ));
    }
}
