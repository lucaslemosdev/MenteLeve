package com.menteleve.api.repository;

import com.menteleve.api.model.Lembrete;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LembreteRepository extends JpaRepository<Lembrete, Long> {
    Page<Lembrete> findByUsuarioId(Long usuarioId, Pageable pageable);
    List<Lembrete> findByUsuarioIdAndAtivoTrue(Long usuarioId);
    List<Lembrete> findByTipoLembrete(String tipoLembrete);
}

