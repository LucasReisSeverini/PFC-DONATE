package com.donate.backend.main.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "bancos_de_leite")
public class BancoLeiteModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String endereco;
    private String telefone;
    private Double latitude;
    private Double longitude;

    @Column(name = "id_cidade")
    private Long idCidade;

    // Getters e setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Long getIdCidade() { return idCidade; }
    public void setIdCidade(Long idCidade) { this.idCidade = idCidade; }
}
