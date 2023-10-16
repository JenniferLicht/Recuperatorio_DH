USE jenniferlich_user_managment;

INSERT INTO User (Nombre, Apellido, Email, clave, EsAdmin, BajaLogica, FechaRegistro)
VALUES ('Juan', 'Pérez', 'juan.perez@example.com', 'clave123', 1, 0, NOW());

INSERT INTO User (Nombre, Apellido, Email, clave, EsAdmin, BajaLogica, FechaRegistro)
VALUES ('María', 'González', 'maria.gonzalez@example.com', 'contrasena456', 0, 0, NOW());

INSERT INTO UserProfileImage (userID, ubicacion, bajaLogica) 
VALUES (1, '/ruta/de/imagen/para/usuario1.jpg', 0);

INSERT INTO UserProfileImage (userID, ubicacion, bajaLogica) 
VALUES (2, '/ruta/de/imagen/para/usuario2.jpg', 0);