package com.donate.backend.main.domain;

/**
 * Representa um usuário do sistema sem dependências de JPA para que o
 * projeto utilize acesso a dados baseado em JDBC.
 */
public class UsuarioModel {

    private Long id;

    private String nome;
    private String telefone;
    private String senha;
    private String email;
    private String cpf;

    private Boolean doadora;
    private Boolean receptora;
    private Boolean profissional;

    private Double latitude;
    private Double longitude;

    private Long idCidade;

    // Getters e Setters

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

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public Boolean getDoadora() {
        return doadora;
    }

    public void setDoadora(Boolean doadora) {
        this.doadora = doadora;
    }

    public Boolean getReceptora() {
        return receptora;
    }

    public void setReceptora(Boolean receptora) {
        this.receptora = receptora;
    }

    public Boolean getProfissional() {
        return profissional;
    }

    public void setProfissional(Boolean profissional) {
        this.profissional = profissional;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Long getIdCidade() {
        return idCidade;
    }

    public void setIdCidade(Long idCidade) {
        this.idCidade = idCidade;
    }
}
