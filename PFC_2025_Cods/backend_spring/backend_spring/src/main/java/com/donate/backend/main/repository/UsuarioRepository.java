package com.donate.backend.main.repository;

import com.donate.backend.main.domain.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<UsuarioModel, Long> {
    Optional<UsuarioModel> findByEmail(String email);

    Optional<UsuarioModel> findByEmailOrCpf(String email, String cpf);

}
