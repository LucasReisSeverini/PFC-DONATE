package br.fai.backend.donate.backend.main.dto;

public class BancoLeiteDto {

    private Long id;
    private String nome;
    private String endereco;
    private String telefone;
    private Double latitude;
    private Double longitude;
    private Double distancia; // existente
    private Long id_municipio; // novo campo

    public BancoLeiteDto() {}

    public BancoLeiteDto(Long id, String nome, String endereco, String telefone,
                         Double latitude, Double longitude, Double distancia, Long id_municipio) {
        this.id = id;
        this.nome = nome;
        this.endereco = endereco;
        this.telefone = telefone;
        this.latitude = latitude;
        this.longitude = longitude;
        this.distancia = distancia;
        this.id_municipio = id_municipio;
    }

    // Getters e Setters
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

    public Double getDistancia() { return distancia; }
    public void setDistancia(Double distancia) { this.distancia = distancia; }

    public Long getId_municipio() { return id_municipio; }
    public void setId_municipio(Long id_municipio) { this.id_municipio = id_municipio; }
}
