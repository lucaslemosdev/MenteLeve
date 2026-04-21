package com.menteleve.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_diario")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Diario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String conteudo;

    @Column(name = "nivel_humor")
    private Integer nivelHumor; // 1 a 5

    @CreationTimestamp
    @Column(name = "data_registro")
    private LocalDateTime dataRegistro;

    @Column(name = "tags")
    private String tags;
}

