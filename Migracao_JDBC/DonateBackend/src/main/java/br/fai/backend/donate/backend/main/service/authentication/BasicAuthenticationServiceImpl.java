//package br.fai.backend.donate.backend.main.service.authentication;
//
//import br.fai.backend.donate.backend.main.domain.UsuarioModel;
//import br.fai.backend.donate.backend.main.port.service.authentication.AuthenticationService;
//import br.fai.backend.donate.backend.main.port.service.user.UserService;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//public class BasicAuthenticationServiceImpl implements AuthenticationService {
//
//    private final UserService userService;
//    private final PasswordEncoder passwordEncoder;
//
//    public BasicAuthenticationServiceImpl(UserService userService, PasswordEncoder passwordEncoder) {
//        this.userService = userService;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    @Override
//    public UsuarioModel authentication(String email, String password) {
//        UsuarioModel userModel = userService.findByEmail(email);
//        if (userModel == null) {
//            throw new UsernameNotFoundException("credenciais inválidas");
//        }
//
//        // senha com segurança
//        if (!passwordEncoder.matches(password, userModel.getSenha())) {
//            throw new BadCredentialsException("credenciais inválidas");
//        }
//
//        // garante o papel do usuário
//        userModel.definirUserRole();
//
//        return userModel;
//    }
//}
