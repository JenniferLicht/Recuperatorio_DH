CREATE TABLE `User`(
    `userID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nombre` BIGINT NOT NULL,
    `apellido` BIGINT NOT NULL,
    `email` BIGINT NOT NULL,
    `clave` BIGINT NOT NULL,
    `esAdmin` BIGINT NOT NULL,
    `bajaLogica` BIGINT NOT NULL,
    `FechaRegistro` BIGINT NOT NULL
);
CREATE TABLE `UserProfileImage`(
    `imageID` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userID` BIGINT NOT NULL,
    `ubicacion` BIGINT NOT NULL,
    `bajaLogica` BIGINT NOT NULL
);
ALTER TABLE
    `UserProfileImage` ADD CONSTRAINT `userprofileimage_userid_foreign` FOREIGN KEY(`userID`) REFERENCES `User`(`userID`);