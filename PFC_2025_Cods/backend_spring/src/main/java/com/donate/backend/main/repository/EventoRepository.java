package com.donate.backend.main.repository;

import com.donate.backend.main.domain.EventoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoRepository extends JpaRepository<EventoModel, Long> {
    // Aqui você pode adicionar métodos customizados se precisar, ex:
    // List<EventoModel> findByTipo(String tipo);
}
