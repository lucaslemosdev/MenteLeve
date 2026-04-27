package com.menteleve.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiarioDTO {

    private Long id;
    private Long usuarioId;
    private String titulo;
    private String conteudo;
    private Integer nivelHumor;
    private LocalDateTime dataRegistro;
    private String tags;
}

