package com.menteleve.api.repository;

import com.menteleve.api.model.Diario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DiarioRepository extends JpaRepository<Diario, Long> {
    Page<Diario> findByUsuarioId(Long usuarioId, Pageable pageable);
    List<Diario> findByUsuarioIdAndDataRegistroBetween(Long usuarioId, LocalDateTime dataInicio, LocalDateTime dataFim);
}

