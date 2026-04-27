package com.menteleve.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;

@Entity
@Table(name = "tb_frase_motivacional")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraseMotivacional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    @Column(name = "autor")
    private String autor;

    @CreationTimestamp
    @Column(name = "data_frase")
    private LocalDate dataFrase;

    @Column(name = "categoria")
    private String categoria;

    @Column(name = "ativo")
    private Boolean ativo = true;
}

