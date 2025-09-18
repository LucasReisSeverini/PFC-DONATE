package br.fai.backend.donate.backend.main.port.service.municipio;

import br.fai.backend.donate.backend.main.domain.MunicipioModel;
import java.util.List;
import java.util.Optional;

public interface MunicipioService {

    // Cria um novo município
    int create(MunicipioModel entity);

    // Deleta um município pelo ID
    void delete(int id);

    // Atualiza um município pelo ID
    void update(int id, MunicipioModel entity);

    // Busca um município pelo ID
    public Optional<MunicipioModel> findById(int id);


    // Lista todos os municípios
    List<MunicipioModel> findAll();

    // Busca municípios por nome (opcional)
    List<MunicipioModel> findByNome(String nome);
}
