package br.fai.backend.donate.backend.main.port.dao.evento;

import br.fai.backend.donate.backend.main.domain.EventoModel;
import java.util.List;

public interface EventoDao {

    int add(EventoModel entity);

    void remove(int id);

    EventoModel readByID(int id);

    List<EventoModel> readAll();

    void updateInformation(int id, EventoModel entity);
}
