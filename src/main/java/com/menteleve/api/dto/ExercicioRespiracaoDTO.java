package com.menteleve.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExercicioRespiracaoDTO {

    private Long id;
    private String nome;
    private String descricao;
    private Integer duracaoSegundos;
    private String instrucoes;
    private Boolean ativo;
}

