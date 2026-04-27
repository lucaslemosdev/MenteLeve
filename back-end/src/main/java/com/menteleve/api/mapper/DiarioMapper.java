package com.menteleve.api.mapper;

import com.menteleve.api.dto.DiarioDTO;
import com.menteleve.api.model.Diario;
import org.springframework.stereotype.Component;

@Component
public class DiarioMapper {

    public DiarioDTO toDTO(Diario diario) {
        if (diario == null) {
            return null;
        }

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

