#!/bin/bash

MYSQL_ROOT_PASSWORD="SPTech#2024"
NEW_USER="bateria-adm"
NEW_USER_PASSWORD="Bateria@123"
DB_NAME="bateria"


mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<EOF

CREATE USER IF NOT EXISTS '$NEW_USER'@'localhost' IDENTIFIED BY '$NEW_USER_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO '$NEW_USER'@'localhost';
FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS $DB_NAME;
USE $DB_NAME;

CREATE TABLE IF NOT EXISTS agremiacao (
    idAgremiacao INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    categoria VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS instrumentos (
    idInstrumento INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    afinacao VARCHAR(5) NOT NULL
);


INSERT IGNORE INTO agremiacao (nome, categoria) VALUES
    ('Gaviões da Fiel', 'Grupo Especial'),
    ('Pérola Negra', 'Grupo de acesso 2'),
    ('Vai-Vai', 'Grupo Especial'),
    ('União da Ilha', 'Grupo Especial');

    
create table if not exists usuario (
    id int primary key auto_increment,
    nome varchar(45) not null,
    email varchar(45) not null unique,
    senha varchar(45) not null,
    fkagremiacao int,
    constraint fkuseragremiacao foreign key (fkagremiacao)
        references agremiacao(idagremiacao)
);
insert into usuario values
(default, 'Artur', 'artur@gmail.com', 'senha', null);

create table if not exists instrumentos (
    idinstrumento int primary key auto_increment,
    nome varchar(45) not null,
    afinacao varchar(5) not null
);

create table if not exists levada (
    idlevada int primary key auto_increment,
    nome varchar(100) not null,
    padrao text not null,
    bpm int null,
    instrumento varchar(50) null,
    dtcriacao datetime default current_timestamp,
    fkuser int not null,
    fkagremiacao int null,
    constraint fklevadauser foreign key (fkuser)
        references usuario(id),
    constraint fklevadaagremiacao foreign key (fkagremiacao)
        references agremiacao(idagremiacao)
);

insert into levada (nome, padrao, bpm, instrumento, fkuser, fkagremiacao)
values (
    'samba básico',
    '[{"nome":"surdo1","tempo":0},{"nome":"caixa","tempo":500},{"nome":"surdo2","tempo":1000}]',
    120,
    'bateria',
    1,
    3
);

create table if not exists nota (
    idnota int primary key auto_increment,
    tempo decimal(5,2) not null,
    intensidade int not null,
    fkinstrumento int,
    fklevada int,
    constraint fknotainstrumento foreign key (fkinstrumento)
        references instrumentos(idinstrumento),
    constraint fknotalevada foreign key (fklevada)
        references levada(idlevada)
);

select * from agremiacao;
select * from usuario;
select * from levada;

insert into levada (nome, padrao, bpm, instrumento, fkuser, fkagremiacao)
values (
    'Reggae Gaviões Profissional',
    '[{"nome":"surdo1","tempo":0,"arquivo":"surdo1.mp3"},
      {"nome":"surdo3","tempo":250,"arquivo":"surdo3.mp3"},
      {"nome":"caixa","tempo":500,"arquivo":"caixa.mp3"},
      {"nome":"surdo1","tempo":1000,"arquivo":"surdo1.mp3"},
      {"nome":"surdo3","tempo":1250,"arquivo":"surdo3.mp3"}]',
    115,
    'bateria',
    1,  
    1  
);

insert into levada (nome, padrao, bpm, instrumento, fkuser, fkagremiacao)
values (
    'Samba Vai-Vai Completo',
    '[{"nome":"surdo1","tempo":0,"arquivo":"surdo1.mp3"},
      {"nome":"surdo2","tempo":250,"arquivo":"surdo2.mp3"},
      {"nome":"surdo3","tempo":500,"arquivo":"surdo3.mp3"},
      {"nome":"caixa","tempo":750,"arquivo":"caixa.mp3"},
      {"nome":"tamborim","tempo":1000,"arquivo":"tamborim.mp3"}]',
    130,
    'bateria',
    1,
    3  -- ID da Vai-Vai
);

insert into levada (nome, padrao, bpm, instrumento, fkuser, fkagremiacao)
values (
    'Funk Pérola Pesado',
    '[{"nome":"surdo2","tempo":0,"arquivo":"surdo2.mp3"},
      {"nome":"caixa","tempo":200,"arquivo":"caixa.mp3"},
      {"nome":"surdo2","tempo":400,"arquivo":"surdo2.mp3"},
      {"nome":"agogo2","tempo":600,"arquivo":"agogo2.mp3"},
      {"nome":"tamborim","tempo":800,"arquivo":"tamborim.mp3"}]',
    108,
    'bateria',
    1,
    2  -- ID da Pérola Negra
);

insert into levada (nome, padrao, bpm, instrumento, fkuser, fkagremiacao)
values (
    'Reta União Tradicional',
    '[{"nome":"surdo1","tempo":0,"arquivo":"surdo1.mp3"},
      {"nome":"surdo3","tempo":300,"arquivo":"surdo3.mp3"},
      {"nome":"surdo1","tempo":600,"arquivo":"surdo1.mp3"},
      {"nome":"surdo3","tempo":900,"arquivo":"surdo3.mp3"},
      {"nome":"caixa","tempo":1200,"arquivo":"caixa.mp3"}]',
    122,
    'bateria',
    1,
    4  -- ID da União da Ilha
);

insert into levada (nome, padrao, bpm, instrumento, fkuser, fkagremiacao)
values (
    'Samba Enredo 2023',
    '[{"nome":"surdo1","tempo":0}]',
    125,
    'bateria',
    1,
    1 
);

insert into levada (nome, padrao, bpm, instrumento, fkuser, fkagremiacao)
values (
    'Meu exercício pessoal',
    '[{"nome":"caixa","tempo":0}]',
    110,
    'caixa',
    1,
    null 
);

set SQL_SAFE_UPDATES = 0;
update levada set instrumento = 'bateria' where instrumento is null;
set SQL_SAFE_UPDATES = 1;
alter table levada add column progresso int default 0;

create table if not exists levada_progresso (
    idprogresso int primary key auto_increment,
    fklevada int not null,
    fkuser int not null,
    progresso int not null,
    ultima_atualizacao datetime not null,
    constraint fkprogressolevada foreign key (fklevada) references levada(idlevada),
    constraint fkprogressouser foreign key (fkuser) references usuario(id),
    unique key (fklevada, fkuser)
);
EOF

echo "✅ Script finalizado. Banco '$DB_NAME' configurado com sucesso!"
