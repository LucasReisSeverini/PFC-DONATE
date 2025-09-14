package com.donate.backend.main.domain;

/**
 * Modelo simples para representar uma cidade sem dependências de JPA,
 * permitindo acesso a dados via JDBC.
 */
public class CidadeModel {

    private Long id;

    private String nome;

    private String estado;

    public CidadeModel() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
