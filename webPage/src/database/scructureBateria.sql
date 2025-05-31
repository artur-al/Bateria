create database if not exists bateria;
use bateria;

create table if not exists agremiacao (
    idagremiacao int primary key auto_increment,
    nome varchar(45) not null,
    categoria varchar(45) not null
);

insert into agremiacao values
    (default, 'Gaviões da fiel', 'grupo especial'),
    (default, 'Pérola Negra', 'grupo de acesso 2'),
    (default, 'Vai-Vai', 'grupo especial'),
    (default, 'União da ilha', 'grupo especial');

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

