package br.fai.backend.donate.backend.main.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioModel {

    private int id;
    private String nome;
    private String telefone;
    private String senha;
    private String email;
    private String cpf;

    private Double latitude;
    private Double longitude;

    private Boolean doadora;       // de boolean para Boolean
    private Boolean receptora;     // de boolean para Boolean
    private Boolean profissional;  // de boolean para Boolean


    @JsonProperty("id_municipio")
    private Integer idMunicipio; // id do município associado ao usuário

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



    public int getId() {
        return id;
    }

    public void setId(int id) {
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

    public Integer getIdMunicipio() {
        return idMunicipio;
    }

    public void setIdMunicipio(Integer idMunicipio) {
        this.idMunicipio = idMunicipio;
    }
}
