package com.menteleve.api.controller;

import com.menteleve.api.dto.LembreteDTO;
import com.menteleve.api.service.LembreteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/lembretes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class LembreteController {

    private final LembreteService lembreteService;

    @PostMapping
    public ResponseEntity<LembreteDTO> criarLembrete(@RequestBody LembreteDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(lembreteService.criarLembrete(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LembreteDTO> obterLembretePorId(@PathVariable Long id) {
        return ResponseEntity.ok(lembreteService.obterLembretePorId(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<LembreteDTO>> listarLembretesDoUsuario(
            @PathVariable Long usuarioId,
            Pageable pageable) {
        return ResponseEntity.ok(lembreteService.listarLembretesDoUsuario(usuarioId, pageable));
    }

    @GetMapping("/usuario/{usuarioId}/ativos")
    public ResponseEntity<List<LembreteDTO>> listarLembretesAtivosDoUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(lembreteService.listarLembretesAtivosDoUsuario(usuarioId));
    }

    @GetMapping("/tipo/{tipoLembrete}")
    public ResponseEntity<List<LembreteDTO>> listarLembretePorTipo(@PathVariable String tipoLembrete) {
        return ResponseEntity.ok(lembreteService.listarLembretePorTipo(tipoLembrete));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LembreteDTO> atualizarLembrete(@PathVariable Long id, @RequestBody LembreteDTO dto) {
        return ResponseEntity.ok(lembreteService.atualizarLembrete(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarLembrete(@PathVariable Long id) {
        lembreteService.deletarLembrete(id);
        return ResponseEntity.noContent().build();
    }
}

