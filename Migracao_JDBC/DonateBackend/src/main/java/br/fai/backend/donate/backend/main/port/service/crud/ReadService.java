package br.fai.backend.donate.backend.main.port.service.crud;

import java.util.List;

public interface ReadService<T> {
    T findById(final int id);
    List<T> findAll();
}
