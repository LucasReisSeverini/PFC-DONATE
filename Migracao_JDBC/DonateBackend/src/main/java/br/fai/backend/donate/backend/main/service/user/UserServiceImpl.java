package br.fai.backend.donate.backend.main.service.user;

import br.fai.backend.donate.backend.main.domain.UsuarioModel;
import br.fai.backend.donate.backend.main.dto.AtualizarPerfilDto;
import br.fai.backend.donate.backend.main.port.dao.user.UserDao;
import br.fai.backend.donate.backend.main.port.service.user.UserService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserDao userDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UsuarioModel usuario = findByEmail(username);

        if (usuario == null) {
            throw new UsernameNotFoundException("Usuário não encontrado: " + username);
        }

        var authorities = new java.util.ArrayList<String>();
        if (Boolean.TRUE.equals(usuario.getDoadora())) authorities.add("DOADORA");
        if (Boolean.TRUE.equals(usuario.getReceptora())) authorities.add("RECEPTORA");
        if (Boolean.TRUE.equals(usuario.getProfissional())) authorities.add("PROFISSIONAL");

        var grantedAuthorities = authorities.stream()
                .map(role -> new org.springframework.security.core.authority.SimpleGrantedAuthority(role))
                .toList();

        return new User(
                usuario.getEmail(),
                usuario.getSenha(),
                grantedAuthorities
        );
    }

    // =================== CRUD ===================
    @Override
    public int create(UsuarioModel entity) {
        if (entity == null
                || entity.getNome() == null || entity.getNome().isEmpty()
                || entity.getSenha() == null || entity.getSenha().isEmpty()
                || entity.getEmail() == null || entity.getEmail().isEmpty()) {
            return 0;
        }

        if (entity.getDoadora() == null && entity.getReceptora() == null && entity.getProfissional() == null) {
            entity.setDoadora(true);
        }
        if (entity.getDoadora() == null) entity.setDoadora(false);
        if (entity.getReceptora() == null) entity.setReceptora(false);
        if (entity.getProfissional() == null) entity.setProfissional(false);

        entity.setSenha(passwordEncoder.encode(entity.getSenha()));

        return userDao.add(entity);
    }

    @Override
    public void delete(int id) {
        if (id <= 0) return;
        userDao.remove(id);
    }

    @Override
    public UsuarioModel findById(int id) {
        if (id <= 0) return null;
        return userDao.readByID(id);
    }

    @Override
    public List<UsuarioModel> findAll() {
        return userDao.readAll();
    }

    @Override
    public void update(int id, UsuarioModel entity) {
        if (id <= 0 || entity == null) return;

        UsuarioModel existente = findById(id);
        if (existente == null) return;

        if (entity.getDoadora() == null) entity.setDoadora(existente.getDoadora());
        if (entity.getReceptora() == null) entity.setReceptora(existente.getReceptora());
        if (entity.getProfissional() == null) entity.setProfissional(existente.getProfissional());

        if (entity.getSenha() != null && !entity.getSenha().isEmpty()) {
            entity.setSenha(passwordEncoder.encode(entity.getSenha()));
        } else {
            entity.setSenha(existente.getSenha());
        }

        userDao.updateInformation(id, entity);
    }

    // =================== Senha ===================
    @Override
    public boolean updatePassword(int id, String oldPassword, String newPassword) {
        if (id <= 0 || newPassword == null || newPassword.isEmpty()) return false;

        UsuarioModel user = findById(id);
        if (user == null) return false;

        if (!passwordEncoder.matches(oldPassword, user.getSenha())) return false;

        String senhaCriptografada = passwordEncoder.encode(newPassword);
        return userDao.updatePassword(id, senhaCriptografada);
    }

    @Override
    public boolean recoveryPassword(int id, String newPassword) {
        if (id <= 0 || newPassword == null || newPassword.isEmpty()) return false;

        String senhaCriptografada = passwordEncoder.encode(newPassword);
        return userDao.updatePassword(id, senhaCriptografada);
    }

    // =================== Consulta ===================
    @Override
    public UsuarioModel findByEmail(String email) {
        if (email == null || email.isEmpty()) return null;
        return userDao.readByEmail(email);
    }

    @Override
    public UsuarioModel authentication(String email, String password) {
        if (email == null || password == null) return null;

        UsuarioModel user = findByEmail(email);
        if (user == null) return null;

        if (!passwordEncoder.matches(password, user.getSenha())) return null;

        return user;
    }

    @Override
    public Optional<UsuarioModel> buscarPorEmail(String email) {
        if (email == null || email.isEmpty()) return Optional.empty();
        UsuarioModel usuario = userDao.readByEmail(email);
        return Optional.ofNullable(usuario);
    }

    // =================== Atualizar Perfil via DTO ===================
    @Override
    public boolean atualizarPerfil(int id, AtualizarPerfilDto dto) {
        if (id <= 0 || dto == null) return false;

        UsuarioModel existente = findById(id);
        if (existente == null) return false;

        // Atualiza nome e telefone
        existente.setNome(dto.getNome() != null ? dto.getNome() : existente.getNome());
        existente.setTelefone(dto.getTelefone() != null ? dto.getTelefone() : existente.getTelefone());

        // Atualiza senha se houver nova senha
        if (dto.getNovaSenha() != null && !dto.getNovaSenha().isEmpty()) {
            // senha antiga é obrigatória
            if (dto.getSenhaAntiga() == null || dto.getSenhaAntiga().isEmpty()) {
                return false;
            }
            // valida senha antiga
            if (!passwordEncoder.matches(dto.getSenhaAntiga(), existente.getSenha())) {
                return false;
            }
            existente.setSenha(passwordEncoder.encode(dto.getNovaSenha()));
        }

        userDao.updateInformation(id, existente);
        return true;
    }

}
