package com.donate.backend.main.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "eventos")
public class EventoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String data;

    private String tipo; // "evento" ou "noticia"

    @Column(name = "id_cidade")
    private Long idCidade; // <-- novo campo

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getData() { return data; }
    public void setData(String data) { this.data = data; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Long getIdCidade() { return idCidade; }
    public void setIdCidade(Long idCidade) { this.idCidade = idCidade; }
}
