package com.menteleve.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraseMotivacionalDTO {

    private Long id;
    private String texto;
    private String autor;
    private LocalDate dataFrase;
    private String categoria;
    private Boolean ativo;
}

