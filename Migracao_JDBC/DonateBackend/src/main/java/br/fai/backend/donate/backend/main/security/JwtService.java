package br.fai.backend.donate.backend.main.security;


import br.fai.backend.donate.backend.main.domain.UsuarioModel;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    private static final String SECRET = "XUFAE3FQG1RLBlgQ93fDSUlj4HfbKi4a1kFl1gDloOg=";
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String gerarToken(UsuarioModel usuario) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("nome", usuario.getNome());
        claims.put("role", determinarRole(usuario));
        claims.put("id", usuario.getId()); // Adiciona o ID do usuário


        return Jwts.builder()
                .setClaims(claims)
                .setSubject(usuario.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1h
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    private String determinarRole(UsuarioModel usuario) {
        if (Boolean.TRUE.equals(usuario.getAdmin())) return "ADMIN";
        if (Boolean.TRUE.equals(usuario.getProfissional())) return "PROFISSIONAL";
        if (Boolean.TRUE.equals(usuario.getReceptora())) return "RECEPTORA";
        if (Boolean.TRUE.equals(usuario.getDoadora())) return "DOADORA";
        return "USUARIO"; // padrão
    }


    public String extrairUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public String extrairRole(String token) {
        return (String) Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().get("role");
    }

    public boolean tokenValido(String token, String username) {
        return extrairUsername(token).equals(username) && !tokenExpirado(token);
    }

    private boolean tokenExpirado(String token) {
        Date exp = Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getExpiration();
        return exp.before(new Date());
    }

    public Long extrairId(String token) {
        return ((Number) Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("id")).longValue();
    }

}
