create database bateria;
use bateria;

create table agremiacao(
	idAgremiacao int primary key auto_increment,
    nome varchar(45) not null,
    categoria varchar(45) not null);
    
insert into agremiacao values
	(default, 'Gaviões da Fiel','Grupo Especial'),
	(default,'Pérola Negra','Grupo de acesso 2'),
	(default,'Vai-Vai', 'Grupo Especial'),
	(default,'União da Ilha', 'Grupo Especial');
    
create table usuario(
	id int primary key auto_increment,
    nome varchar(45) not null,
	email varchar(45) not null unique,
    senha varchar(45) not null,
    fkAgremiacao int,
    constraint fkUserAgremiacao foreign key (fkAgremiacao)
		references agremiacao(idAgremiacao));
        
create table instrumentos(
	idInstrumento int primary key auto_increment,
    nome varchar(45) not null,
    afinacao varchar(5) not null );
    
create table levada(
	idLevada int primary key auto_increment,
    nome varchar(45) not null,
    dataCriacao datetime default current_timestamp,
    fkUser int,
    fkAgremiacao int,
    constraint fkLevadaUser foreign key (fkUser)
		references usuario(idUser));

create table nota(
	idNota int primary key auto_increment,
    tempo decimal(5,2) not null, 
    intensidade int not null, 
    fkInstrumento int,
    fkLevada int,
    constraint fkNotaInstrumento foreign key (fkInstrumento)
		references instrumentos(idInstrumento),
	constraint fkNotaLevada foreign key (fkLevada)
		references levada(idLevada));

select * from usuario;