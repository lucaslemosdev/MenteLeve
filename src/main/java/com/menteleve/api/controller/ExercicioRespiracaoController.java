package com.menteleve.api.controller;

import com.menteleve.api.dto.ExercicioRespiracaoDTO;
import com.menteleve.api.service.ExercicioRespiracaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/exercicios-respiracao")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ExercicioRespiracaoController {

    private final ExercicioRespiracaoService exercicioRespiracaoService;

    @PostMapping
    public ResponseEntity<ExercicioRespiracaoDTO> criarExercicio(@RequestBody ExercicioRespiracaoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(exercicioRespiracaoService.criarExercicio(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExercicioRespiracaoDTO> obterExercicioPorId(@PathVariable Long id) {
        return ResponseEntity.ok(exercicioRespiracaoService.obterExercicioPorId(id));
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<ExercicioRespiracaoDTO>> listarExerciciosAtivos() {
        return ResponseEntity.ok(exercicioRespiracaoService.listarExerciciosAtivos());
    }

    @GetMapping
    public ResponseEntity<List<ExercicioRespiracaoDTO>> listarTodosExercicos() {
        return ResponseEntity.ok(exercicioRespiracaoService.listarTodosExercicos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExercicioRespiracaoDTO> atualizarExercicio(@PathVariable Long id, @RequestBody ExercicioRespiracaoDTO dto) {
        return ResponseEntity.ok(exercicioRespiracaoService.atualizarExercicio(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarExercicio(@PathVariable Long id) {
        exercicioRespiracaoService.deletarExercicio(id);
        return ResponseEntity.noContent().build();
    }
}

