package com.donate.backend.main.repository;

import com.donate.backend.main.domain.DoacaoModel;
import com.donate.backend.main.domain.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoacaoRepository extends JpaRepository<DoacaoModel, Long> {
    List<DoacaoModel> findByUsuarioId(Long idUsuario);
}
