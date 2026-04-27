package com.menteleve.api.service;

import com.menteleve.api.dto.ExercicioRespiracaoDTO;
import com.menteleve.api.model.ExercicioRespiracao;
import com.menteleve.api.repository.ExercicioRespiracaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExercicioRespiracaoService {

    private final ExercicioRespiracaoRepository exercicioRespiracaoRepository;

    public ExercicioRespiracaoDTO criarExercicio(ExercicioRespiracaoDTO dto) {
        ExercicioRespiracao exercicio = ExercicioRespiracao.builder()
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .duracaoSegundos(dto.getDuracaoSegundos())
                .instrucoes(dto.getInstrucoes())
                .ativo(true)
                .build();

        ExercicioRespiracao exercicioSalvo = exercicioRespiracaoRepository.save(exercicio);
        return converterParaDTO(exercicioSalvo);
    }

    public ExercicioRespiracaoDTO obterExercicioPorId(Long id) {
        ExercicioRespiracao exercicio = exercicioRespiracaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercício não encontrado"));
        return converterParaDTO(exercicio);
    }

    public List<ExercicioRespiracaoDTO> listarExerciciosAtivos() {
        return exercicioRespiracaoRepository.findByAtivoTrue().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public List<ExercicioRespiracaoDTO> listarTodosExercicos() {
        return exercicioRespiracaoRepository.findAll().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public ExercicioRespiracaoDTO atualizarExercicio(Long id, ExercicioRespiracaoDTO dto) {
        ExercicioRespiracao exercicio = exercicioRespiracaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercício não encontrado"));

        exercicio.setNome(dto.getNome());
        exercicio.setDescricao(dto.getDescricao());
        exercicio.setDuracaoSegundos(dto.getDuracaoSegundos());
        exercicio.setInstrucoes(dto.getInstrucoes());
        exercicio.setAtivo(dto.getAtivo());

        ExercicioRespiracao exercicioAtualizado = exercicioRespiracaoRepository.save(exercicio);
        return converterParaDTO(exercicioAtualizado);
    }

    public void deletarExercicio(Long id) {
        ExercicioRespiracao exercicio = exercicioRespiracaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercício não encontrado"));
        exercicioRespiracaoRepository.delete(exercicio);
    }

    private ExercicioRespiracaoDTO converterParaDTO(ExercicioRespiracao exercicio) {
        return ExercicioRespiracaoDTO.builder()
                .id(exercicio.getId())
                .nome(exercicio.getNome())
                .descricao(exercicio.getDescricao())
                .duracaoSegundos(exercicio.getDuracaoSegundos())
                .instrucoes(exercicio.getInstrucoes())
                .ativo(exercicio.getAtivo())
                .build();
    }
}

