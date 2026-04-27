package com.menteleve.api.controller;

import com.menteleve.api.dto.FraseMotivacionalDTO;
import com.menteleve.api.service.FraseMotivacionalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/frases-motivacionais")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class FraseMotivacionalController {

    private final FraseMotivacionalService fraseMotivacionalService;

    @PostMapping
    public ResponseEntity<FraseMotivacionalDTO> criarFrase(@RequestBody FraseMotivacionalDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fraseMotivacionalService.criarFrase(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FraseMotivacionalDTO> obterFrasePorId(@PathVariable Long id) {
        return ResponseEntity.ok(fraseMotivacionalService.obterFrasePorId(id));
    }

    @GetMapping("/ativas")
    public ResponseEntity<List<FraseMotivacionalDTO>> listarFrasesAtivas() {
        return ResponseEntity.ok(fraseMotivacionalService.listarFrasesAtivas());
    }

    @GetMapping("/do-dia")
    public ResponseEntity<FraseMotivacionalDTO> obterFraseDoDia() {
        return ResponseEntity.ok(fraseMotivacionalService.obterFraseDoDia());
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<FraseMotivacionalDTO>> listarFrasesPorCategoria(@PathVariable String categoria) {
        return ResponseEntity.ok(fraseMotivacionalService.listarFrasesPorCategoria(categoria));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FraseMotivacionalDTO> atualizarFrase(@PathVariable Long id, @RequestBody FraseMotivacionalDTO dto) {
        return ResponseEntity.ok(fraseMotivacionalService.atualizarFrase(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarFrase(@PathVariable Long id) {
        fraseMotivacionalService.deletarFrase(id);
        return ResponseEntity.noContent().build();
    }
}

