package com.donate.backend.main.service;

import com.donate.backend.main.domain.UsuarioModel;
import com.donate.backend.main.dto.AtualizarPerfilDto;
import com.donate.backend.main.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UsuarioModel usuario = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        return new org.springframework.security.core.userdetails.User(
                usuario.getEmail(),
                usuario.getSenha(),
                new ArrayList<>()
        );
    }

    public List<UsuarioModel> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<UsuarioModel> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public UsuarioModel salvar(UsuarioModel usuario) {
        // Criptografa a senha antes de salvar
        String senhaCriptografada = passwordEncoder.encode(usuario.getSenha());
        usuario.setSenha(senhaCriptografada);
        return usuarioRepository.save(usuario);
    }

    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Optional<UsuarioModel> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<UsuarioModel> buscarPorEmailOuCpf(String email, String cpf) {
        return usuarioRepository.findByEmailOrCpf(email, cpf);
    }

    public void atualizarLocalizacao(Long id, Double latitude, Double longitude) {
        Optional<UsuarioModel> optionalUsuario = usuarioRepository.findById(id);
        if (optionalUsuario.isPresent()) {
            UsuarioModel usuario = optionalUsuario.get();
            usuario.setLatitude(latitude);
            usuario.setLongitude(longitude);
            usuarioRepository.save(usuario);
        }
    }

    public void atualizarPerfil(Long id, AtualizarPerfilDto dto) {
        Optional<UsuarioModel> optionalUsuario = usuarioRepository.findById(id);

        if (optionalUsuario.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado");
        }

        UsuarioModel usuario = optionalUsuario.get();
        usuario.setNome(dto.getNome());
        usuario.setTelefone(dto.getTelefone());

        // Verificar se quer trocar a senha
        if (dto.getNovaSenha() != null && !dto.getNovaSenha().isBlank()) {
            // dto precisa conter a senha antiga digitada para comparar
            if (dto.getSenhaAntiga() == null || dto.getSenhaAntiga().isBlank()) {
                throw new RuntimeException("Senha antiga é necessária para trocar a senha");
            }

            // Verifica se a senha antiga digitada bate com a senha do banco
            if (!passwordEncoder.matches(dto.getSenhaAntiga(), usuario.getSenha())) {
                throw new RuntimeException("Senha antiga incorreta");
            }

            // Se passou na verificação, atualiza a senha
            usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()));
        }

        usuarioRepository.save(usuario);
    }





}
