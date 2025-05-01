create database bateria;
use bateria;

create table agremiacao(
	idAgremiacao int primary key auto_increment,
    nome varchar(45) not null,
    categoria varchar(45) not null);

create table usuario(
	idUser int primary key auto_increment,
    nome varchar(45) not null,
    senha varchar(45) not null unique,
    email varchar(45) not null unique,
    tel varchar(45) not null unique,
    fkAgremiacao int,
    constraint fkUserAgremiacao foreign key (fkAgremiacao)
		references agremiacao(idAgremiacao));
        
create table instrumentos(
	idInstrumento int primary key auto_increment,
    nome varchar(45) not null,
    afinacao varchar(5) not null unique);
    
create table levada(
	idLevada int primary key auto_increment,
    nome varchar(45) not null,
    dataCriacao datetime default current_timestamp,
    fkUser int,
    fkAgremiacao int,
    constraint fkLevadaUser foreign key (fkUser)
		references usuario(idUser),
	constraint fkLevadaAgremiacao foreign key (fkAgremiacao)
		references agremiacao(idAgremiacao));

create table nota(
	idNota int primary key auto_increment,
    tempo decimal(5,2) not null, -- o momento da nota, tipo 1.25 segundos
    intensidade int not null, -- tipo força da batida (0 a 100)
    fkInstrumento int,
    fkLevada int,
    constraint fkNotaInstrumento foreign key (fkInstrumento)
		references instrumentos(idInstrumento),
	constraint fkNotaLevada foreign key (fkLevada)
		references levada(idLevada));
