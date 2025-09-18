package br.fai.backend.donate.backend.main.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventoModel {

    private int id;
    private String titulo;
    private String descricao;
    private String data;  // pode ser LocalDate/LocalDateTime se quiser
    private String tipo;
    private MunicipioModel cidade; // FK cidade
}
