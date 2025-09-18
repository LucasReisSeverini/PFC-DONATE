package br.fai.backend.donate.backend.main.port.service.authentication;

import br.fai.backend.donate.backend.main.domain.UsuarioModel;

public interface AuthenticationService {
    UsuarioModel authentication(final String email, final String password);
}
