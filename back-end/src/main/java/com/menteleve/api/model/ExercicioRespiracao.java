package com.menteleve.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_exercicio_respiracao")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExercicioRespiracao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "duracao_segundos")
    private Integer duracaoSegundos;

    @Column(name = "instrucoes", columnDefinition = "TEXT")
    private String instrucoes;

    @Column(name = "ativo")
    private Boolean ativo = true;
}

