package br.fai.backend.donate.backend.main.port.service.crud;

public interface CreateService<T> {
    int create(final  T entity);
}
