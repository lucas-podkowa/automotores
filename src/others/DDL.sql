CREATE TABLE PERSONA (
	dni varchar(8) PRIMARY KEY,
    nombre varchar(50) NOT NULL,
    apellido varchar(50) NOT NULL
);

CREATE TABLE USUARIO (
	usuario_id int AUTO_INCREMENT PRIMARY KEY,
    mail varchar(50) UNIQUE NOT NULL,
    pass varchar(255) NOT NULL,
    persona_id varchar(8) NOT NULL,
    foreign key (persona_id) references persona(dni)
);

CREATE TABLE MARCA (
	marca_id smallint AUTO_INCREMENT PRIMARY KEY,
    nombre varchar(50) NOT NULL
);

CREATE TABLE VEHICULO (
	matricula varchar(7) PRIMARY KEY,
    nombre varchar(50) NOT NULL,
    modelo year,
    kilometraje int ,
    marca_id smallint NOT NULL,
    foreign key (marca_id) references marca(marca_id)
);

CREATE TABLE RESERVA (
	reserva_id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo varchar(7) NOT NULL,
    responsable varchar(8) NOT NULL,
	desde datetime NOT NULL,
    hasta datetime,
    finalizada boolean DEFAULT (false),
    cancelada boolean DEFAULT (false),
    foreign key (vehiculo) references vehiculo(matricula),
    foreign key (responsable) references persona(dni)
);

INSERT INTO marca (nombre) VALUES ("Chevrolet"),("Fiat"),("Ford"),("Toyota"),("Volkswagen");


