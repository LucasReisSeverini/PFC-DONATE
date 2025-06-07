package com.donate.backend.main.security;

import com.donate.backend.main.domain.UsuarioModel;
import com.donate.backend.main.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth") // endpoint base: /auth/login
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioService usuarioService;

//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
//
//        authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(
//                        request.getUsername(),
//                        request.getPassword()
//                )
//        );
//
//        UserDetails userDetails = usuarioService.loadUserByUsername(request.getUsername());
//        String jwt = jwtService.gerarToken(userDetails.getUsername());
//
//        return ResponseEntity.ok(new AuthenticationResponse(jwt));
//    } correto com apenas e-mail no token
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {

        // Autentica com Spring Security
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getSenha()
                )
        );

        // Busca o usuário completo para gerar o token
        Optional<UsuarioModel> optionalUsuario = usuarioService.buscarPorEmail(request.getEmail());
        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não encontrado");
        }

        UsuarioModel usuario = optionalUsuario.get();
        String jwt = jwtService.gerarToken(usuario);

        return ResponseEntity.ok(new AuthenticationResponse(jwt));
    }

}
