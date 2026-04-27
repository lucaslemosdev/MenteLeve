package com.menteleve.api.service;

import com.menteleve.api.dto.FraseMotivacionalDTO;
import com.menteleve.api.model.FraseMotivacional;
import com.menteleve.api.repository.FraseMotivacionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FraseMotivacionalService {

    private final FraseMotivacionalRepository fraseMotivacionalRepository;

    public FraseMotivacionalDTO criarFrase(FraseMotivacionalDTO dto) {
        FraseMotivacional frase = FraseMotivacional.builder()
                .texto(dto.getTexto())
                .autor(dto.getAutor())
                .categoria(dto.getCategoria())
                .ativo(true)
                .build();

        FraseMotivacional fraseSalva = fraseMotivacionalRepository.save(frase);
        return converterParaDTO(fraseSalva);
    }

    public FraseMotivacionalDTO obterFrasePorId(Long id) {
        FraseMotivacional frase = fraseMotivacionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Frase não encontrada"));
        return converterParaDTO(frase);
    }

    public List<FraseMotivacionalDTO> listarFrasesAtivas() {
        return fraseMotivacionalRepository.findByAtivoTrue().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public FraseMotivacionalDTO obterFraseDoDia() {
        return fraseMotivacionalRepository.findByDataFrase(LocalDate.now())
                .map(this::converterParaDTO)
                .orElseThrow(() -> new RuntimeException("Nenhuma frase para hoje"));
    }

    public List<FraseMotivacionalDTO> listarFrasesPorCategoria(String categoria) {
        return fraseMotivacionalRepository.findByCategoria(categoria).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    public FraseMotivacionalDTO atualizarFrase(Long id, FraseMotivacionalDTO dto) {
        FraseMotivacional frase = fraseMotivacionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Frase não encontrada"));

        frase.setTexto(dto.getTexto());
        frase.setAutor(dto.getAutor());
        frase.setDataFrase(dto.getDataFrase());
        frase.setCategoria(dto.getCategoria());
        frase.setAtivo(dto.getAtivo());

        FraseMotivacional fraseAtualizada = fraseMotivacionalRepository.save(frase);
        return converterParaDTO(fraseAtualizada);
    }

    public void deletarFrase(Long id) {
        FraseMotivacional frase = fraseMotivacionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Frase não encontrada"));
        fraseMotivacionalRepository.delete(frase);
    }

    private FraseMotivacionalDTO converterParaDTO(FraseMotivacional frase) {
        return FraseMotivacionalDTO.builder()
                .id(frase.getId())
                .texto(frase.getTexto())
                .autor(frase.getAutor())
                .dataFrase(frase.getDataFrase())
                .categoria(frase.getCategoria())
                .ativo(frase.getAtivo())
                .build();
    }
}

