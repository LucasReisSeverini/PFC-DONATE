package com.donate.backend.main.controller;

import com.donate.backend.main.domain.CidadeModel;
import com.donate.backend.main.domain.UsuarioModel;
import com.donate.backend.main.dto.AtualizarLocalizacaoDto;
import com.donate.backend.main.dto.AtualizarPerfilDto;
import com.donate.backend.main.dto.UsuarioDto;
import com.donate.backend.main.service.CidadeService;
import com.donate.backend.main.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;


    @Autowired
    private CidadeService cidadeService;

    @GetMapping
    public ResponseEntity<List<UsuarioModel>> listarTodos() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioModel> buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email")
    public ResponseEntity<UsuarioModel> buscarPorEmail(@RequestParam String email) {
        return usuarioService.buscarPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("cadastro")
    public ResponseEntity<UsuarioModel> salvar(@RequestBody UsuarioDto usuarioDto) {
        CidadeModel cidade = cidadeService.buscarPorId(usuarioDto.getIdCidade())
                .orElseThrow(() -> new RuntimeException("Cidade não encontrada"));

        UsuarioModel usuario = new UsuarioModel();
        usuario.setNome(usuarioDto.getNome());
        usuario.setTelefone(usuarioDto.getTelefone());
        usuario.setSenha(usuarioDto.getSenha());
        usuario.setEmail(usuarioDto.getEmail());
        usuario.setCpf(usuarioDto.getCpf());
        usuario.setDoadora(usuarioDto.getDoadora());
        usuario.setReceptora(usuarioDto.getReceptora());
        usuario.setProfissional(usuarioDto.getProfissional());
        usuario.setLatitude(usuarioDto.getLatitude());
        usuario.setLongitude(usuarioDto.getLongitude());
        usuario.setCidade(cidade); // aqui você liga o ID com o objeto CidadeModel

        UsuarioModel novoUsuario = usuarioService.salvar(usuario);
        return ResponseEntity.ok(novoUsuario);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/localizacao")
    public ResponseEntity<Void> atualizarLocalizacao(
            @PathVariable Long id,
            @RequestBody AtualizarLocalizacaoDto dto) {
        usuarioService.atualizarLocalizacao(id, dto.getLatitude(), dto.getLongitude());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/perfil")
    public ResponseEntity<Void> atualizarPerfil(
            @PathVariable Long id,
            @RequestBody AtualizarPerfilDto dto) {

        usuarioService.atualizarPerfil(id, dto);  // <--- Chamada correta

        return ResponseEntity.noContent().build();
    }




}
