package br.fai.backend.donate.backend.main.service.authentication;

import br.fai.backend.donate.backend.main.domain.UsuarioModel;
import br.fai.backend.donate.backend.main.port.service.authentication.AuthenticationService;
import br.fai.backend.donate.backend.main.port.service.user.UserService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

//import br.fai.backend.donate.backend.main.domain.UsuarioModel;
//import br.fai.backend.donate.backend.main.port.service.authentication.AuthenticationService;
//import br.fai.backend.donate.backend.main.port.service.user.UserService;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.crypto.password.PasswordEncoder;
//

    @Service
    public class JwtAuthenticationServiceImpl implements AuthenticationService {

        private final UserService userService;
        private final PasswordEncoder passwordEncoder;

        public JwtAuthenticationServiceImpl(UserService userService, PasswordEncoder passwordEncoder) {
            this.userService = userService;
            this.passwordEncoder = passwordEncoder;
        }

        @Override
        public UsuarioModel authentication(String email, String password) {
            UsuarioModel user = userService.findByEmail(email);
            if (user == null) throw new UsernameNotFoundException("Email não encontrado");

            if (!passwordEncoder.matches(password, user.getSenha()))
                throw new BadCredentialsException("Credenciais inválidas");


            return user;
        }
    }


//
//    private final UserService userService;
//    private final PasswordEncoder passwordEncoder;
//
//    public JwtAuthenticationServiceImpl(UserService userService, PasswordEncoder passwordEncoder) {
//        this.userService = userService;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//
//    @Override
//    public UsuarioModel authentication(String email, String password) {
//        final UsuarioModel userModel = userService.findByEmail(email);
//        if (userModel == null) {
//            throw new UsernameNotFoundException("Email não encontrado");
//        }
//
//        if (!passwordEncoder.matches(password, userModel.getSenha())) {
//            throw new BadCredentialsException("Credenciais inválidas");
//        }
//
//        // Garante que o UserRole será definido corretamente antes de retornar
//        userModel.definirUserRole();
//
//        return userModel;
//    }
//}