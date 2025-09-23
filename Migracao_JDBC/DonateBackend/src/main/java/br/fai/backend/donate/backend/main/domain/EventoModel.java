package br.fai.backend.donate.backend.main.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data                   // gera getters, setters, toString, equals e hashCode
@NoArgsConstructor      // gera construtor vazio
@AllArgsConstructor     // gera construtor com todos os campos
public class EventoModel {

    private Long id;
    private String titulo;
    private String descricao;
    private String data;   // pode ser String ou LocalDate dependendo do banco
    private String tipo;   // "evento" ou "noticia"
    @JsonProperty("id_municipio")
    private Integer idMunicipio;
}
