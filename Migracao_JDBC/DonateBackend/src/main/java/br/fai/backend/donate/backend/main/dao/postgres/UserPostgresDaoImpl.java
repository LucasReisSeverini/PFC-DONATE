package br.fai.backend.donate.backend.main.dao.postgres;

import br.fai.backend.donate.backend.main.domain.UsuarioModel;
import br.fai.backend.donate.backend.main.port.dao.user.UserDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class UserPostgresDaoImpl implements UserDao {

    private final JdbcTemplate jdbcTemplate;

    public UserPostgresDaoImpl(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    private final RowMapper<UsuarioModel> rowMapper = new RowMapper<UsuarioModel>() {
        @Override
        public UsuarioModel mapRow(ResultSet rs, int rowNum) throws SQLException {
            UsuarioModel usuario = new UsuarioModel();
            usuario.setId(rs.getInt("id"));
            usuario.setNome(rs.getString("nome"));
            usuario.setTelefone(rs.getString("telefone"));
            usuario.setSenha(rs.getString("senha"));
            usuario.setEmail(rs.getString("email"));
            usuario.setCpf(rs.getString("cpf"));
            usuario.setDoadora(rs.getBoolean("doadora"));
            usuario.setReceptora(rs.getBoolean("receptora"));
            usuario.setProfissional(rs.getBoolean("profissional"));
            usuario.setLatitude(rs.getObject("latitude") != null ? rs.getDouble("latitude") : null);
            usuario.setLongitude(rs.getObject("longitude") != null ? rs.getDouble("longitude") : null);
            return usuario;
        }
    };


    @Override
    public int add(UsuarioModel entity) {

        // Define padrão caso todas sejam null ou false
        if ((entity.getDoadora() == null || !entity.getDoadora())
                && (entity.getReceptora() == null || !entity.getReceptora())
                && (entity.getProfissional() == null || !entity.getProfissional())) {
            entity.setDoadora(true); // padrão como doadora
        }

        String sql = "INSERT INTO usuario " +
                "(nome, telefone, senha, email, cpf, doadora, receptora, profissional, latitude, longitude, id_municipio) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id;";

        return jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                entity.getNome(),
                entity.getTelefone(),
                entity.getSenha(),
                entity.getEmail(),
                entity.getCpf(),
                entity.getDoadora(),
                entity.getReceptora(),
                entity.getProfissional(),
                entity.getLatitude(),
                entity.getLongitude(),
                entity.getIdMunicipio()
        );
    }





    @Override
    public void remove(int id) {
        String sql = "DELETE FROM usuario_model WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public UsuarioModel readByID(int id) {
        String sql = "SELECT * FROM usuario_model WHERE id = ?";
        List<UsuarioModel> result = jdbcTemplate.query(sql, rowMapper, id);
        return result.isEmpty() ? null : result.get(0);
    }

    @Override
    public List<UsuarioModel> readAll() {
        String sql = "SELECT * FROM usuario_model";
        return jdbcTemplate.query(sql, rowMapper);
    }

    @Override
    public void updateInformation(int id, UsuarioModel entity) {
        String sql = "UPDATE usuario_model SET nome = ?, telefone = ?, email = ?, cpf = ?, doadora = ?, receptora = ?, profissional = ?, admin = ?, latitude = ?, longitude = ? WHERE id = ?";
        jdbcTemplate.update(sql,
                entity.getNome(),
                entity.getTelefone(),
                entity.getEmail(),
                entity.getCpf(),
                entity.getDoadora(),
                entity.getReceptora(),
                entity.getProfissional(),
                entity.getLatitude(),
                entity.getLongitude(),
                id
        );
    }

    @Override
    public UsuarioModel readByEmail(String email) {
        String sql = "SELECT * FROM usuario_model WHERE email = ?";
        List<UsuarioModel> result = jdbcTemplate.query(sql, rowMapper, email);
        return result.isEmpty() ? null : result.get(0);
    }

    @Override
    public boolean updatePassword(int id, String newPassword) {
        String sql = "UPDATE usuario_model SET senha = ? WHERE id = ?";
        return jdbcTemplate.update(sql, newPassword, id) > 0;
    }
}
