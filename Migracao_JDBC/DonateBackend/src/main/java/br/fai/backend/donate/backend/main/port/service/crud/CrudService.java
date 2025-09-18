package br.fai.backend.donate.backend.main.port.service.crud;

import br.fai.backend.donate.backend.main.dto.AtualizarPerfilDto;

import java.util.List;

public interface CrudService<T> extends CreateService<T>, ReadService<T>, UpdateService<T>, DeleteService

{
}
