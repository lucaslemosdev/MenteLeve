package com.menteleve.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LembreteDTO {

    private Long id;
    private Long usuarioId;
    private String titulo;
    private String descricao;
    private String tipoLembrete;
    private LocalTime horaLembrete;
    private Boolean ativo;
    private LocalDateTime dataCriacao;
}

