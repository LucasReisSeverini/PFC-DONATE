drop database if exists donate;
create database donate;

\c donate;

-- tabela: municipio
create table municipio (
    id serial primary key,
    nome varchar(100) not null,
    uf varchar(100) not null
);

-- tabela: usuario
create table usuario (
    id serial primary key,
    nome varchar(100) not null,
    email varchar(100) unique not null,
    telefone varchar(20),
    cpf varchar(11) unique not null,
    senha varchar(100) not null,
    doadora boolean default false,
    receptora boolean default false,
    profissional boolean default false,
    latitude numeric(8,6),
    longitude numeric(8,6),
    id_municipio integer not null,
    constraint fk_usuario_municipio foreign key (id_municipio) references municipio(id)
);

-- tabela: bancos_de_leite
create table bancos_de_leite (
    id serial primary key,
    nome varchar(100) not null,
    id_municipio integer not null,
    endereco varchar(255) not null,
    telefone varchar(20) not null,
    latitude numeric(8,6),
    longitude numeric(8,6),
    constraint fk_banco_municipio foreign key (id_municipio) references municipio(id)
);

-- tabela: doacao
create table doacao (
    id serial primary key,
    id_bancos_de_leite integer not null,
    quantidade_ml integer not null,
    data_doacao timestamptz not null,
    id_usuario integer not null,
    constraint fk_doacao_banco foreign key (id_bancos_de_leite) references bancos_de_leite(id),
    constraint fk_doacao_usuario foreign key (id_usuario) references usuario(id)
);

commit;
