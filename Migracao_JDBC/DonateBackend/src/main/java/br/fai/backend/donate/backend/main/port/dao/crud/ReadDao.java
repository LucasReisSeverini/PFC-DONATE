package br.fai.backend.donate.backend.main.port.dao.crud;

import java.util.List;

public interface ReadDao<T> {
    T readByID(final int id);
    List<T> readAll();

}
