package br.fai.backend.donate.backend.main.service.bancoLeite;

import br.fai.backend.donate.backend.main.domain.BancoLeiteModel;
import br.fai.backend.donate.backend.main.dto.BancoLeiteDto;
import br.fai.backend.donate.backend.main.port.dao.bancoLeite.BancoLeiteDao;
import br.fai.backend.donate.backend.main.port.service.bancoLeiteService.BancoLeiteService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BancoLeiteServiceImpl implements BancoLeiteService {

    private final BancoLeiteDao bancoLeiteDao;

    public BancoLeiteServiceImpl(BancoLeiteDao bancoLeiteDao) {
        this.bancoLeiteDao = bancoLeiteDao;
    }

    @Override
    public int create(BancoLeiteModel entity) {
        return bancoLeiteDao.add(entity);
    }

    @Override
    public void delete(int id) {
        bancoLeiteDao.remove(id);
    }

    @Override
    public void update(int id, BancoLeiteModel entity) {
        bancoLeiteDao.updateInformation(id, entity);
    }

    @Override
    public BancoLeiteModel findById(int id) {
        return bancoLeiteDao.readByID(id);
    }

    @Override
    public List<BancoLeiteModel> findAll() {
        return bancoLeiteDao.readAll();
    }

    @Override
    public BancoLeiteDto buscarBancoMaisProximo(double latitude, double longitude) {
        List<BancoLeiteModel> bancos = bancoLeiteDao.readAll();
        BancoLeiteModel maisProximo = null;
        double menorDistancia = Double.MAX_VALUE;

        for (BancoLeiteModel banco : bancos) {
            if (banco.getLatitude() != null && banco.getLongitude() != null) {
                double dist = calcularDistancia(latitude, longitude, banco.getLatitude(), banco.getLongitude());
                if (dist < menorDistancia) {
                    menorDistancia = dist;
                    maisProximo = banco;
                }
            }
        }

        if (maisProximo == null) return null;

        // Retorna DTO com distância e id_municipio
        return new BancoLeiteDto(
                maisProximo.getId(),
                maisProximo.getNome(),
                maisProximo.getEndereco(),
                maisProximo.getTelefone(),
                maisProximo.getLatitude(),
                maisProximo.getLongitude(),
                menorDistancia,
                maisProximo.getIdMunicipio()  // garante que é Long
        );
    }

    // Calcula distância em km entre duas coordenadas usando Haversine
    private double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Raio da Terra em km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
