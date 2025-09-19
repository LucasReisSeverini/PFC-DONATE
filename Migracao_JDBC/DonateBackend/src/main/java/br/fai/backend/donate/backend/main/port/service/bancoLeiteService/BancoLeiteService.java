package br.fai.backend.donate.backend.main.port.service.bancoLeiteService;

import br.fai.backend.donate.backend.main.domain.BancoLeiteModel;
import br.fai.backend.donate.backend.main.dto.BancoLeiteDto;
import java.util.List;

public interface BancoLeiteService {

    int create(BancoLeiteModel entity);
    void delete(int id);
    void update(int id, BancoLeiteModel entity);
    BancoLeiteModel findById(int id);
    List<BancoLeiteModel> findAll();

    // Alterado para retornar DTO
    BancoLeiteDto buscarBancoMaisProximo(double latitude, double longitude);
}
