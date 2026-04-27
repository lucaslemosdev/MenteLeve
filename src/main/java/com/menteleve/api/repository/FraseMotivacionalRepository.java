package com.menteleve.api.repository;

import com.menteleve.api.model.FraseMotivacional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FraseMotivacionalRepository extends JpaRepository<FraseMotivacional, Long> {
    List<FraseMotivacional> findByAtivoTrue();
    Optional<FraseMotivacional> findByDataFrase(LocalDate dataFrase);
    List<FraseMotivacional> findByCategoria(String categoria);
}

