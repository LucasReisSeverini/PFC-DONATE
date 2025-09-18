package br.fai.backend.donate.backend.main.port.service.user;

import br.fai.backend.donate.backend.main.domain.UsuarioModel;

public interface ReadByEmailService {
    UsuarioModel findByEmail(final String email);
}
