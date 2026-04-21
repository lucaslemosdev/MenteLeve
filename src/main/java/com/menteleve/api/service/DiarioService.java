package com.menteleve.api.service;

import com.menteleve.api.dto.DiarioDTO;
import com.menteleve.api.model.Diario;
import com.menteleve.api.model.Usuario;
import com.menteleve.api.repository.DiarioRepository;
import com.menteleve.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiarioService {

    private final DiarioRepository diarioRepository;
    private final UsuarioRepository usuarioRepository;

    public DiarioDTO criarDiario(DiarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Diario diario = Diario.builder()
                .usuario(usuario)
                .titulo(dto.getTitulo())
                .conteudo(dto.getConteudo())
                .nivelHumor(dto.getNivelHumor())
                .tags(dto.getTags())
                .build();

        Diario diarioSalvo = diarioRepository.save(diario);
        return converterParaDTO(diarioSalvo);
    }

    public DiarioDTO obterDiarioPorId(Long id) {
        Diario diario = diarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diário não encontrado"));
        return converterParaDTO(diario);
    }

    public Page<DiarioDTO> listarDiariosDoUsuario(Long usuarioId, Pageable pageable) {
        return diarioRepository.findByUsuarioId(usuarioId, pageable)
                .map(this::converterParaDTO);
    }

    public List<DiarioDTO> listarDiariosDoUsuarioPorPeriodo(Long usuarioId, LocalDateTime dataInicio, LocalDateTime dataFim) {
        return diarioRepository.findByUsuarioIdAndDataRegistroBetween(usuarioId, dataInicio, dataFim).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public DiarioDTO atualizarDiario(Long id, DiarioDTO dto) {
        Diario diario = diarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diário não encontrado"));

        diario.setTitulo(dto.getTitulo());
        diario.setConteudo(dto.getConteudo());
        diario.setNivelHumor(dto.getNivelHumor());
        diario.setTags(dto.getTags());

        Diario diarioAtualizado = diarioRepository.save(diario);
        return converterParaDTO(diarioAtualizado);
    }

    public void deletarDiario(Long id) {
        Diario diario = diarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diário não encontrado"));
        diarioRepository.delete(diario);
    }

    private DiarioDTO converterParaDTO(Diario diario) {
        return DiarioDTO.builder()
                .id(diario.getId())
                .usuarioId(diario.getUsuario().getId())
                .titulo(diario.getTitulo())
                .conteudo(diario.getConteudo())
                .nivelHumor(diario.getNivelHumor())
                .dataRegistro(diario.getDataRegistro())
                .tags(diario.getTags())
                .build();
    }
}

