package com.menteleve.api.repository;

import com.menteleve.api.model.ExercicioRespiracao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExercicioRespiracaoRepository extends JpaRepository<ExercicioRespiracao, Long> {
    List<ExercicioRespiracao> findByAtivoTrue();
}

