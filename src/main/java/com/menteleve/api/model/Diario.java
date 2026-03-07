package com.menteleve.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_diario")
@Data
public class Diario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String conteudo;

    private Integer nivelHumor; // 1 a 5, por exemplo

    private LocalDateTime dataRegistro = LocalDateTime.now();
}