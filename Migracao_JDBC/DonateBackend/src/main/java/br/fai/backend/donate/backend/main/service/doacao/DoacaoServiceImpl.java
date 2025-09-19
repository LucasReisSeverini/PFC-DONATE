package br.fai.backend.donate.backend.main.service.doacao;

import br.fai.backend.donate.backend.main.domain.DoacaoModel;
import br.fai.backend.donate.backend.main.dto.DoacaoListDTO;
import br.fai.backend.donate.backend.main.port.dao.doacao.DoacaoDao;
import br.fai.backend.donate.backend.main.port.service.doacao.DoacaoService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DoacaoServiceImpl implements DoacaoService {

    private final DoacaoDao doacaoDao;

    public DoacaoServiceImpl(DoacaoDao doacaoDao) {
        this.doacaoDao = doacaoDao;
    }

    @Override
    public List<DoacaoListDTO> buscarTodos() {
        return doacaoDao.listarTodas();
    }

    @Override
    public Optional<DoacaoModel> buscarPorId(Long id) {
        return doacaoDao.buscarPorId(id);
    }

    @Override
    public int salvar(DoacaoModel doacao) {
        return doacaoDao.salvar(doacao);
    }

    @Override
    public int excluir(Long id) {
        return doacaoDao.deletar(id);
    }

    @Override
    public int atualizar(DoacaoModel doacao) {
        return doacaoDao.atualizar(doacao);
    }

    @Override
    public int atualizarStatus(Long id, String novoStatus) {
        Optional<DoacaoModel> optional = doacaoDao.buscarPorId(id);
        if (optional.isPresent()) {
            DoacaoModel doacao = optional.get();
            doacao.setStatus(novoStatus);
            return doacaoDao.atualizar(doacao);
        }
        return 0;
    }

    @Override
    public int reagendar(Long id, LocalDateTime novaDataHora) {
        Optional<DoacaoModel> optional = doacaoDao.buscarPorId(id);
        if (optional.isPresent()) {
            DoacaoModel doacao = optional.get();
            doacao.setDataDoacao(novaDataHora);
            doacao.setStatus("Reagendamento Solicitado");
            return doacaoDao.atualizar(doacao);
        }
        return 0;
    }

    @Override
    public boolean existeAgendamento(Long idBanco, LocalDateTime dataHora) {
        return doacaoDao.existeAgendamento(idBanco, dataHora);
    }

    @Override
    public List<DoacaoListDTO> buscarPorUsuarioId(Long idUsuario) {
        return doacaoDao.buscarPorUsuarioId(idUsuario);
    }

    @Override
    public Optional<DoacaoListDTO> buscarPorIdDTO(Long id) {
        return doacaoDao.buscarPorIdDTO(id); // <<< IMPLEMENTAÇÃO CORRETA
    }
}
