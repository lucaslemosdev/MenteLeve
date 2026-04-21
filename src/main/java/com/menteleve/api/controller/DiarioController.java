package com.menteleve.api.controller;

import com.menteleve.api.dto.DiarioDTO;
import com.menteleve.api.service.DiarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/diarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class DiarioController {

    private final DiarioService diarioService;

    @PostMapping
    public ResponseEntity<DiarioDTO> criarDiario(@RequestBody DiarioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(diarioService.criarDiario(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiarioDTO> obterDiarioPorId(@PathVariable Long id) {
        return ResponseEntity.ok(diarioService.obterDiarioPorId(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<DiarioDTO>> listarDiariosDoUsuario(
            @PathVariable Long usuarioId,
            Pageable pageable) {
        return ResponseEntity.ok(diarioService.listarDiariosDoUsuario(usuarioId, pageable));
    }

    @GetMapping("/usuario/{usuarioId}/periodo")
    public ResponseEntity<List<DiarioDTO>> listarDiariosDoUsuarioPorPeriodo(
            @PathVariable Long usuarioId,
            @RequestParam LocalDateTime dataInicio,
            @RequestParam LocalDateTime dataFim) {
        return ResponseEntity.ok(diarioService.listarDiariosDoUsuarioPorPeriodo(usuarioId, dataInicio, dataFim));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiarioDTO> atualizarDiario(@PathVariable Long id, @RequestBody DiarioDTO dto) {
        return ResponseEntity.ok(diarioService.atualizarDiario(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDiario(@PathVariable Long id) {
        diarioService.deletarDiario(id);
        return ResponseEntity.noContent().build();
    }
}

