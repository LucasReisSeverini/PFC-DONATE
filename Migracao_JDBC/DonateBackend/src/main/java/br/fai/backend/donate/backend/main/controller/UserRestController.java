package br.fai.backend.donate.backend.main.controller;

import br.fai.backend.donate.backend.main.domain.MunicipioModel;
import br.fai.backend.donate.backend.main.domain.UsuarioModel;
import br.fai.backend.donate.backend.main.dto.AtualizarPerfilDto;
import br.fai.backend.donate.backend.main.dto.UpdatePasswordDto;
import br.fai.backend.donate.backend.main.port.service.municipio.MunicipioService;
import br.fai.backend.donate.backend.main.port.service.user.UserService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<UsuarioModel> salvar(@RequestBody UsuarioModel usuarioDto) {
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
        // usuario.setAdmin(usuarioDto.getAdmin()); // remova se não existir no banco
        usuario.setLatitude(usuarioDto.getLatitude());
        usuario.setLongitude(usuarioDto.getLongitude());
        usuario.setIdMunicipio(municipio.getId()); // associa pelo ID

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
    public ResponseEntity<Void> atualizarPerfil(
            @PathVariable int id,
            @RequestBody AtualizarPerfilDto dto) {

        boolean atualizado = userService.atualizarPerfil(id, dto);

        return atualizado ? ResponseEntity.noContent().build() : ResponseEntity.badRequest().build();
    }


}
