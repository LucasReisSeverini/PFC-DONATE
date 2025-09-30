package br.fai.backend.donate.backend.main.controller;

import br.fai.backend.donate.backend.main.domain.MunicipioModel;
import br.fai.backend.donate.backend.main.domain.UsuarioModel;
import br.fai.backend.donate.backend.main.dto.AtualizarPerfilDto;
import br.fai.backend.donate.backend.main.dto.UpdatePasswordDto;
import br.fai.backend.donate.backend.main.port.service.municipio.MunicipioService;
import br.fai.backend.donate.backend.main.port.service.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UserRestController {

    private final UserService userService;
    private final MunicipioService municipioService; // adiciona aqui

    public UserRestController(UserService userService, MunicipioService municipioService) {
        this.userService = userService;
        this.municipioService = municipioService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<?> salvar(@RequestBody UsuarioModel usuarioDto) {
        // Verifica se o email já existe
        if (userService.buscarPorEmail(usuarioDto.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(409)
                    .body("Email já cadastrado");
        }

        // Verifica se o CPF já existe
        if (userService.buscarPorCpf(usuarioDto.getCpf()).isPresent()) {
            return ResponseEntity
                    .status(409)
                    .body("CPF já cadastrado");
        }

        // Busca o município pelo ID enviado no DTO
        MunicipioModel municipio = municipioService.findById(usuarioDto.getIdMunicipio())
                .orElseThrow(() -> new RuntimeException("Município não encontrado"));

        UsuarioModel usuario = new UsuarioModel();
        usuario.setNome(usuarioDto.getNome());
        usuario.setTelefone(usuarioDto.getTelefone());
        usuario.setSenha(usuarioDto.getSenha());
        usuario.setEmail(usuarioDto.getEmail());
        usuario.setCpf(usuarioDto.getCpf());
        usuario.setDoadora(usuarioDto.getDoadora());
        usuario.setReceptora(usuarioDto.getReceptora());
        usuario.setProfissional(usuarioDto.getProfissional());
        usuario.setAdmin(usuarioDto.getAdmin());
        usuario.setLatitude(usuarioDto.getLatitude());
        usuario.setLongitude(usuarioDto.getLongitude());
        usuario.setIdMunicipio(municipio.getId());

        int novoId = userService.create(usuario);
        usuario.setId(novoId);

        return ResponseEntity.ok(usuario);
    }



    @GetMapping()
    public ResponseEntity<List<UsuarioModel>> getEntities(){
        List<UsuarioModel> users = userService.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioModel> getEntityById(@PathVariable final int id){
        UsuarioModel user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

//    @GetMapping("/email/{email}")
//    public ResponseEntity<UsuarioModel> getEntityByEmail(@PathVariable final String email){
//        UsuarioModel user = userService.findByEmail(email);
//        return ResponseEntity.ok(user);
//    }

    @GetMapping("/email")
    public ResponseEntity<UsuarioModel> buscarPorEmail(@RequestParam String email) {
        return userService.buscarPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping()
    public ResponseEntity<UsuarioModel> createEntity(@RequestBody final UsuarioModel data){
        int id = userService.create(data);
        data.setId(id);
        final URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).body(data);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateEntity(@PathVariable final int id, @RequestBody final UsuarioModel data) {
        userService.update(id, data);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntity(@PathVariable final int id){
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update-password")
    public ResponseEntity<Void> updatePassword(@RequestBody final UpdatePasswordDto data) {
        boolean response = userService.updatePassword(data.getId(), data.getOldPassword(), data.getNewPassword());
        return response ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}/perfil")
    public ResponseEntity<String> atualizarPerfil(
            @PathVariable int id,
            @RequestBody AtualizarPerfilDto dto) {

        try {
            boolean atualizado = userService.atualizarPerfil(id, dto);
            if (atualizado) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.badRequest().body("Erro ao atualizar perfil");
            }
        } catch (IllegalArgumentException e) {
            // Retorna mensagem da exceção para o front
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno do servidor");
        }
    }

    // ---------------------- ENDPOINTS ADMIN ----------------------

    /**
     * Excluir qualquer usuário (admin)
     */
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUserAsAdmin(@PathVariable int id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Tornar um usuário admin
     */
    @PutMapping("/admin/{id}/set-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> setUserAsAdmin(@PathVariable int id) {
        boolean atualizado = userService.setUserAsAdmin(id);
        if (!atualizado) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }


    /**
     * Remover o papel de admin de um usuário
     */
    @PutMapping("/admin/{id}/remove-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removeAdminRole(@PathVariable int id) {
        UsuarioModel usuario = userService.findById(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        usuario.setAdmin(false);
        userService.update(id, usuario);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable int id) {
        boolean deleted = userService.deleteUser(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/admin/{id}/set-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> setUserRole(
            @PathVariable int id,
            @RequestParam boolean admin,
            @RequestParam boolean doadora,
            @RequestParam boolean receptora,
            @RequestParam boolean profissional) {

        boolean updated = userService.updateUserRole(id, admin, doadora, receptora, profissional);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }





}
