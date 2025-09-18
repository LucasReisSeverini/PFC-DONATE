package br.fai.backend.donate.backend.main.port.dao.municipio;

import br.fai.backend.donate.backend.main.domain.MunicipioModel;

import java.util.List;
import java.util.Optional;

public interface MunicipioDao {

    // Cria um novo município e retorna o ID gerado
    int create(MunicipioModel entity);

    // Atualiza um município existente
    void update(int id, MunicipioModel entity);

    // Deleta um município pelo ID
    void delete(int id);

    // Busca um município pelo ID
    Optional<MunicipioModel> findById(int id);

    // Lista todos os municípios
    List<MunicipioModel> findAll();

    // Busca municípios por nome
    List<MunicipioModel> findByNome(String nome);
}
