package br.fai.backend.donate.backend.main.security;

import br.fai.backend.donate.backend.main.domain.UsuarioModel;
import br.fai.backend.donate.backend.main.service.user.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth") // endpoint base: /auth
public class AuthenticationController {

    @Autowired
    private UserServiceImpl usuarioService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder; // ✅ necessário para matches()

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {

        // Busca usuário pelo email
        Optional<UsuarioModel> optionalUsuario = usuarioService.buscarPorEmail(request.getEmail());
        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não encontrado");
        }

        UsuarioModel usuario = optionalUsuario.get();

        // Valida senha com PasswordEncoder
        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta");
        }

        // Gera token JWT
        String jwt = jwtService.gerarToken(usuario);

         return ResponseEntity.ok(new AuthenticationResponse(jwt));
    }
}
