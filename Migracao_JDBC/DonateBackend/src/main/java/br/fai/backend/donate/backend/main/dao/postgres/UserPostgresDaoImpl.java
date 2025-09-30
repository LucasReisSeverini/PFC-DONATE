package br.fai.backend.donate.backend.main.dao.postgres;

import br.fai.backend.donate.backend.main.domain.UsuarioModel;
import br.fai.backend.donate.backend.main.port.dao.user.UserDao;
import br.fai.backend.donate.backend.main.port.dao.user.UpdatePasswordDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class UserPostgresDaoImpl implements UserDao, UpdatePasswordDao {

    private final Connection connection;

    @Autowired
    public UserPostgresDaoImpl(DataSource dataSource) throws SQLException {
        this.connection = dataSource.getConnection();
    }

    @Override
    public int add(UsuarioModel entity) {
        if (readByEmail(entity.getEmail()) != null) throw new RuntimeException("Email já cadastrado");
        if (readByCpf(entity.getCpf()) != null) throw new RuntimeException("CPF já cadastrado");

        if ((entity.getAdmin() == null || !entity.getAdmin()) &&
                (entity.getDoadora() == null || !entity.getDoadora()) &&
                (entity.getReceptora() == null || !entity.getReceptora()) &&
                (entity.getProfissional() == null || !entity.getProfissional())) {
            entity.setDoadora(true);
        }


        // Adicionei o campo admin no INSERT
        String sql = "INSERT INTO usuario (nome, telefone, senha, email, cpf, doadora, receptora, profissional, latitude, longitude, id_municipio, admin) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            connection.setAutoCommit(false);
            try (PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setString(1, entity.getNome());
                ps.setString(2, entity.getTelefone());
                ps.setString(3, entity.getSenha());
                ps.setString(4, entity.getEmail());
                ps.setString(5, entity.getCpf());
                ps.setBoolean(6, entity.getDoadora());
                ps.setBoolean(7, entity.getReceptora());
                ps.setBoolean(8, entity.getProfissional());
                if (entity.getLatitude() != null) ps.setDouble(9, entity.getLatitude());
                else ps.setNull(9, Types.DOUBLE);
                if (entity.getLongitude() != null) ps.setDouble(10, entity.getLongitude());
                else ps.setNull(10, Types.DOUBLE);
                ps.setInt(11, entity.getIdMunicipio());
                ps.setBoolean(12, entity.getAdmin() != null && entity.getAdmin()); // novo campo
                ps.executeUpdate();

                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) entity.setId(rs.getInt(1));
                }
            }

            // Salvar senha inicial no histórico
            salvarSenhaNoHistorico((long) entity.getId(), entity.getSenha());

            connection.commit();
            return entity.getId();
        } catch (SQLException e) {
            try { connection.rollback(); } catch (SQLException ex) { throw new RuntimeException(ex); }
            throw new RuntimeException(e);
        }
    }

    @Override
    public UsuarioModel findByCpf(String cpf) {
        return readByCpf(cpf);
    }

    @Override
    public UsuarioModel readByCpf(String cpf) {
        String sql = "SELECT * FROM usuario WHERE cpf = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, cpf);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return mapResultSetToUsuario(rs);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @Override
    public void remove(int id) {
        String sql = "DELETE FROM usuario WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public UsuarioModel readByID(int id) {
        String sql = "SELECT * FROM usuario WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return mapResultSetToUsuario(rs);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @Override
    public List<UsuarioModel> readAll() {
        String sql = "SELECT * FROM usuario";
        List<UsuarioModel> usuarios = new ArrayList<>();
        try (PreparedStatement ps = connection.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) usuarios.add(mapResultSetToUsuario(rs));
            return usuarios;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private UsuarioModel mapResultSetToUsuario(ResultSet rs) throws SQLException {
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
        usuario.setIdMunicipio(rs.getInt("id_municipio"));
        usuario.setAdmin(rs.getBoolean("admin")); // novo campo
        return usuario;
    }

    public void updateInformation(int id, UsuarioModel entity) {
        String sql = "UPDATE usuario SET " +
                "nome = COALESCE(?, nome), " +
                "telefone = COALESCE(?, telefone), " +
                "senha = COALESCE(?, senha), " +
                "email = COALESCE(?, email), " +
                "cpf = COALESCE(?, cpf), " +
                "doadora = COALESCE(?, doadora), " +
                "receptora = COALESCE(?, receptora), " +
                "profissional = COALESCE(?, profissional), " +
                "latitude = COALESCE(?, latitude), " +
                "longitude = COALESCE(?, longitude) " +
                "WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, entity.getNome());
            ps.setString(2, entity.getTelefone());
            ps.setString(3, entity.getSenha());
            ps.setString(4, entity.getEmail());
            ps.setString(5, entity.getCpf());
            ps.setBoolean(6, entity.getDoadora());
            ps.setBoolean(7, entity.getReceptora());
            ps.setBoolean(8, entity.getProfissional());
            if (entity.getLatitude() != null) ps.setDouble(9, entity.getLatitude());
            else ps.setNull(9, Types.DOUBLE);
            if (entity.getLongitude() != null) ps.setDouble(10, entity.getLongitude());
            else ps.setNull(10, Types.DOUBLE);
            ps.setInt(11, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public UsuarioModel readByEmail(String email) {
        String sql = "SELECT * FROM usuario WHERE email = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return mapResultSetToUsuario(rs);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    // ------------------ MÉTODOS DE SENHA COM HISTÓRICO ------------------

    @Override
    public boolean updatePassword(int id, String newPassword) throws SQLException {
        if (senhaJaUtilizada((long) id, newPassword)) {
            throw new RuntimeException("Senha já utilizada nas últimas 3 alterações");
        }
        atualizarSenha((long) id, newPassword);
        salvarSenhaNoHistorico((long) id, newPassword);
        limparHistorico((long) id, 3);
        return true;
    }

    @Override
    public String getSenhaAtual(Long usuarioId) throws SQLException {
        String sql = "SELECT senha FROM usuario WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, usuarioId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return rs.getString("senha");
            }
        }
        return null;
    }
    @Override
    public boolean setUserAsAdmin(int id) {
        String sql = "UPDATE usuario SET admin = TRUE, doadora = FALSE, receptora = FALSE, profissional = FALSE WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, id);
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0; // retorna true se alguma linha foi atualizada
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean deleteUser(int id) {
        String sql = "DELETE FROM usuario WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, id);
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0; // true se algum registro foi deletado
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean setUserRole(int id, boolean admin, boolean doadora, boolean receptora, boolean profissional) {
        String sql = "UPDATE usuario SET admin = ?, doadora = ?, receptora = ?, profissional = ? WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setBoolean(1, admin);
            ps.setBoolean(2, doadora);
            ps.setBoolean(3, receptora);
            ps.setBoolean(4, profissional);
            ps.setInt(5, id);
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }









    @Override
    public boolean senhaJaUtilizada(Long usuarioId, String novaSenhaHash) throws SQLException {
        String sql = "SELECT COUNT(*) FROM usuario_senha_historico WHERE usuario_id = ? AND senha = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, usuarioId);
            ps.setString(2, novaSenhaHash);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return rs.getInt(1) > 0;
            }
        }
        return false;
    }

    @Override
    public void salvarSenhaNoHistorico(Long usuarioId, String senhaHash) throws SQLException {
        String sql = "INSERT INTO usuario_senha_historico (usuario_id, senha) VALUES (?, ?)";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, usuarioId);
            ps.setString(2, senhaHash);
            ps.executeUpdate();
        }
    }

    @Override
    public void atualizarSenha(Long usuarioId, String novaSenhaHash) throws SQLException {
        String sql = "UPDATE usuario SET senha = ? WHERE id = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, novaSenhaHash);
            ps.setLong(2, usuarioId);
            ps.executeUpdate();
        }
    }

    @Override
    public void limparHistorico(Long usuarioId, int limiteHistorico) throws SQLException {
        String sql = "DELETE FROM usuario_senha_historico WHERE usuario_id = ? AND id NOT IN " +
                "(SELECT id FROM usuario_senha_historico WHERE usuario_id = ? ORDER BY data_alteracao DESC LIMIT ?)";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, usuarioId);
            ps.setLong(2, usuarioId);
            ps.setInt(3, limiteHistorico);
            ps.executeUpdate();
        }
    }

    @Override
    public List<String> getUltimasSenhas(Long usuarioId, int limite) throws SQLException {
        String sql = "SELECT senha FROM usuario_senha_historico " +
                "WHERE usuario_id = ? " +
                "ORDER BY data_alteracao DESC " +
                "LIMIT ?";
        List<String> senhas = new ArrayList<>();
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setLong(1, usuarioId);
            ps.setInt(2, limite);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    senhas.add(rs.getString("senha"));
                }
            }
        }
        return senhas;
    }

}
