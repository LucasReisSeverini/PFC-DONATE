package br.fai.backend.donate.backend.main.port.service.user;

import br.fai.backend.donate.backend.main.domain.UsuarioModel;
import br.fai.backend.donate.backend.main.dto.AtualizarPerfilDto;
import br.fai.backend.donate.backend.main.port.dao.crud.CrudDao;
import br.fai.backend.donate.backend.main.port.dao.user.ReadByEmailDao;
import br.fai.backend.donate.backend.main.port.dao.user.UpdatePasswordDao;
import br.fai.backend.donate.backend.main.port.service.authentication.AuthenticationService;
import br.fai.backend.donate.backend.main.port.service.crud.CrudService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;


public interface UserService extends CrudService<UsuarioModel>, UpdatePasswordService, ReadByEmailService
        , AuthenticationService, RecoveryPasswordService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
    Optional<UsuarioModel> buscarPorEmail(String email);

    boolean atualizarPerfil(int id, AtualizarPerfilDto dto);
    Optional<UsuarioModel> buscarPorCpf(String cpf);

    boolean setUserAsAdmin(int id);

    boolean deleteUser(int id);

    boolean updateUserRole(int id, boolean admin, boolean doadora, boolean receptora, boolean profissional);

}
