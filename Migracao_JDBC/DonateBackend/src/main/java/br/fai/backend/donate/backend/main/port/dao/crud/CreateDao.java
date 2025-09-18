package br.fai.backend.donate.backend.main.port.dao.crud;

public interface CreateDao<T> {
    int add(final T entity);
}
