drop database if exists donate;
create database donate;

\c donate;

create table cidade (
    id serial primary key,
    nome varchar(100) not null,
    estado varchar(100) not null
);

create table usuario (
    id serial primary key,
    nome varchar(100) not null,
    email varchar(100) not null unique,
    telefone varchar(20),
    cpf varchar(20) not null unique,
    senha varchar(100) not null,
    doadora boolean not null default false,
    receptora boolean not null default false,
    profissional boolean not null default false,
    latitude decimal(9,6) not null,
    longitude decimal(9,6) not null,
    quantidade_ml decimal(10,2) not null,
    id_cidade int not null,
    foreign key (id_cidade) references cidade(id)
);

create table banco_leite (
    id serial primary key,
    nome varchar(100) not null,
    descricao text not null,
    telefone varchar(20),
    email varchar(100),
    endereco varchar(255) not null,
    latitude decimal(9,6) not null,
    longitude decimal(9,6) not null,
    id_usuario int not null,
    foreign key (id_usuario) references usuario(id)
);

create table notificacao (
    id serial primary key,
    id_banco_leite int not null,
    codigo varchar(50) not null,
    datahora_envio datetime not null default current_timestamp,
    mensagem varchar(255) not null,
    foreign key (id_banco_leite) references banco_leite(id)
);

commit;