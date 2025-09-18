package br.fai.backend.donate.backend.main.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UnidadeFederativaModel {

    private int id;
    private String nome;
    private String sigla; // ex: "SP", "RJ", etc.
}
