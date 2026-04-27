package com.menteleve.api.service;

import com.menteleve.api.dto.LembreteDTO;
import com.menteleve.api.model.Lembrete;
import com.menteleve.api.model.Usuario;
import com.menteleve.api.repository.LembreteRepository;
import com.menteleve.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LembreteService {

    private final LembreteRepository lembreteRepository;
    private final UsuarioRepository usuarioRepository;

    public LembreteDTO criarLembrete(LembreteDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Lembrete lembrete = Lembrete.builder()
                .usuario(usuario)
                .titulo(dto.getTitulo())
                .descricao(dto.getDescricao())
                .tipoLembrete(dto.getTipoLembrete())
                .horaLembrete(dto.getHoraLembrete())
                .ativo(true)
                .build();

        Lembrete lembreteSalvo = lembreteRepository.save(lembrete);
        return converterParaDTO(lembreteSalvo);
    }

    public LembreteDTO obterLembretePorId(Long id) {
        Lembrete lembrete = lembreteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lembrete não encontrado"));
        return converterParaDTO(lembrete);
    }

    public Page<LembreteDTO> listarLembretesDoUsuario(Long usuarioId, Pageable pageable) {
        return lembreteRepository.findByUsuarioId(usuarioId, pageable)
                .map(this::converterParaDTO);
    }

    public List<LembreteDTO> listarLembretesAtivosDoUsuario(Long usuarioId) {
        return lembreteRepository.findByUsuarioIdAndAtivoTrue(usuarioId).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public List<LembreteDTO> listarLembretePorTipo(String tipoLembrete) {
        return lembreteRepository.findByTipoLembrete(tipoLembrete).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public LembreteDTO atualizarLembrete(Long id, LembreteDTO dto) {
        Lembrete lembrete = lembreteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lembrete não encontrado"));

        lembrete.setTitulo(dto.getTitulo());
        lembrete.setDescricao(dto.getDescricao());
        lembrete.setTipoLembrete(dto.getTipoLembrete());
        lembrete.setHoraLembrete(dto.getHoraLembrete());
        lembrete.setAtivo(dto.getAtivo());

        Lembrete lembreteAtualizado = lembreteRepository.save(lembrete);
        return converterParaDTO(lembreteAtualizado);
    }

    public void deletarLembrete(Long id) {
        Lembrete lembrete = lembreteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lembrete não encontrado"));
        lembreteRepository.delete(lembrete);
    }

    private LembreteDTO converterParaDTO(Lembrete lembrete) {
        return LembreteDTO.builder()
                .id(lembrete.getId())
                .usuarioId(lembrete.getUsuario().getId())
                .titulo(lembrete.getTitulo())
                .descricao(lembrete.getDescricao())
                .tipoLembrete(lembrete.getTipoLembrete())
                .horaLembrete(lembrete.getHoraLembrete())
                .ativo(lembrete.getAtivo())
                .dataCriacao(lembrete.getDataCriacao())
                .build();
    }
}

