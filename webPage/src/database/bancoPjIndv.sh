#!/bin/bash

MYSQL_ROOT_PASSWORD="@At21AMA"
NEW_USER="bateria-adm"
NEW_USER_PASSWORD="bateria@123"
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

CREATE TABLE IF NOT EXISTS usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    fkAgremiacao INT,
    CONSTRAINT fkUserAgremiacao FOREIGN KEY (fkAgremiacao)
        REFERENCES agremiacao(idAgremiacao)
);

CREATE TABLE IF NOT EXISTS instrumentos (
    idInstrumento INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    afinacao VARCHAR(5) NOT NULL
);

CREATE TABLE IF NOT EXISTS levada (
    idLevada INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    dataCriacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    fkUser INT,
    fkAgremiacao INT,
    CONSTRAINT fkLevadaUser FOREIGN KEY (fkUser)
        REFERENCES usuario(id),
    CONSTRAINT fkLevadaAgremiacao FOREIGN KEY (fkAgremiacao)
        REFERENCES agremiacao(idAgremiacao)
);

CREATE TABLE IF NOT EXISTS nota (
    idNota INT PRIMARY KEY AUTO_INCREMENT,
    tempo DECIMAL(5,2) NOT NULL,
    intensidade INT NOT NULL,
    fkInstrumento INT,
    fkLevada INT,
    CONSTRAINT fkNotaInstrumento FOREIGN KEY (fkInstrumento)
        REFERENCES instrumentos(idInstrumento),
    CONSTRAINT fkNotaLevada FOREIGN KEY (fkLevada)
        REFERENCES levada(idLevada)
);

INSERT IGNORE INTO agremiacao (nome, categoria) VALUES
    ('Gaviões da Fiel', 'Grupo Especial'),
    ('Pérola Negra', 'Grupo de acesso 2'),
    ('Vai-Vai', 'Grupo Especial'),
    ('União da Ilha', 'Grupo Especial');

EOF

echo "✅ Script finalizado. Banco '$DB_NAME' configurado com sucesso!"
