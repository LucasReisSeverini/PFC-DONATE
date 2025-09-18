package br.fai.backend.donate.backend.main.port.dao.user;

import br.fai.backend.donate.backend.main.domain.UsuarioModel;

public interface ReadByEmailDao {
    UsuarioModel readByEmail(final String email);
}

