package br.fai.backend.donate.backend.main.service.user;

import br.fai.backend.donate.backend.main.domain.UsuarioModel;
import br.fai.backend.donate.backend.main.port.dao.user.UserDao;
import br.fai.backend.donate.backend.main.port.service.user.UserService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserDao userDao;

    public UserServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Busca o usuário pelo email
        UsuarioModel usuario = findByEmail(username);

        if (usuario == null) {
            throw new UsernameNotFoundException("Usuário não encontrado: " + username);
        }

        // Aqui você pode mapear as roles como authorities
        // Exemplo simples: cria authorities baseado nos booleanos
        var authorities = new java.util.ArrayList<String>();
        if (Boolean.TRUE.equals(usuario.getDoadora())) authorities.add("DOADORA");
        if (Boolean.TRUE.equals(usuario.getReceptora())) authorities.add("RECEPTORA");
        if (Boolean.TRUE.equals(usuario.getProfissional())) authorities.add("PROFISSIONAL");


        // Converte para GrantedAuthority
        var grantedAuthorities = authorities.stream()
                .map(role -> new org.springframework.security.core.authority.SimpleGrantedAuthority(role))
                .toList();

        // Retorna UserDetails do Spring Security
        return new User(
                usuario.getEmail(),    // username
                usuario.getSenha(),    // password
                grantedAuthorities     // roles/authorities
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

        // Se nenhuma flag foi informada, define doadora como padrão
        if (entity.getDoadora() == null && entity.getReceptora() == null && entity.getProfissional() == null) {
            entity.setDoadora(true);
        }

        // Define flags que estiverem null como false
        if (entity.getDoadora() == null) entity.setDoadora(false);
        if (entity.getReceptora() == null) entity.setReceptora(false);
        if (entity.getProfissional() == null) entity.setProfissional(false);


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

        // Mantém os valores existentes se não forem atualizados
        if (entity.getDoadora() == null) entity.setDoadora(existente.getDoadora());
        if (entity.getReceptora() == null) entity.setReceptora(existente.getReceptora());
        if (entity.getProfissional() == null) entity.setProfissional(existente.getProfissional());


        userDao.updateInformation(id, entity);
    }

    // =================== Senha ===================
    @Override
    public boolean updatePassword(int id, String oldPassword, String newPassword) {
        if (id <= 0 || newPassword == null || newPassword.isEmpty()) return false;

        UsuarioModel user = findById(id);
        if (user == null) return false;

        if (!user.getSenha().equals(oldPassword)) return false;

        return userDao.updatePassword(id, newPassword);
    }

    @Override
    public boolean recoveryPassword(int id, String newPassword) {
        if (id <= 0 || newPassword == null || newPassword.isEmpty()) return false;
        return userDao.updatePassword(id, newPassword);
    }

    // =================== Consulta ===================
    @Override
    public UsuarioModel findByEmail(String email) {
        if (email == null || email.isEmpty()) return null;
        return userDao.readByEmail(email);
    }

    // =================== Autenticação ===================
    @Override
    public UsuarioModel authentication(String email, String password) {
        if (email == null || password == null) return null;

        UsuarioModel user = findByEmail(email);
        if (user == null) return null;

        if (!password.equals(user.getSenha())) return null;

        return user;
    }

    public Optional<UsuarioModel> buscarPorEmail(String email) {
        if (email == null || email.isEmpty()) {
            return Optional.empty();
        }

        UsuarioModel usuario = userDao.readByEmail(email); // supondo que você já tenha esse método no DAO
        return Optional.ofNullable(usuario);
    }

}
