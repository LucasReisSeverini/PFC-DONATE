package br.fai.backend.donate.backend.main.service.evento;

import br.fai.backend.donate.backend.main.domain.EventoModel;
import br.fai.backend.donate.backend.main.port.dao.evento.EventoDao;
import br.fai.backend.donate.backend.main.port.service.evento.EventoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventoServiceImpl implements EventoService {

    private final EventoDao eventoDao;

    public EventoServiceImpl(EventoDao eventoDao) {
        this.eventoDao = eventoDao;
    }

    @Override
    public List<EventoModel> listarTodos() {
        return eventoDao.readAll();
    }

    @Override
    public EventoModel listarPorId(Long id) {
        // DAO usa int, então convertemos
        return eventoDao.readByID(id.intValue());
    }

    @Override
    public EventoModel salvar(EventoModel evento) {
        int id = eventoDao.add(evento);
        evento.setId((long) id);
        return evento;
    }

    @Override
    public EventoModel atualizar(Long id, EventoModel evento) {
        eventoDao.updateInformation(id.intValue(), evento);
        evento.setId(id);
        return evento;
    }

    @Override
    public void excluir(Long id) {
        eventoDao.remove(id.intValue());
    }
}
