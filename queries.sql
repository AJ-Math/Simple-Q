-- database creation
CREATE DATABASE `simpleq`;

use simpleq;


-- users table
CREATE TABLE `simpleq`.`users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(320) NOT NULL UNIQUE,
  `flag` INT DEFAULT 0
  );

ALTER TABLE `simpleq`.`users` 
ADD COLUMN `queued` ENUM('Y', 'N') DEFAULT 'N' ;

ALTER TABLE `simpleq`.`users` 
ADD COLUMN `createdAt` DATETIME NULL AFTER `flag`;

ALTER TABLE `simpleq`.`users` 
ADD COLUMN `uniqueId` VARCHAR(256) NULL AFTER `queued`;



-- config table
CREATE TABLE `simpleq`.`config` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `value` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));

INSERT INTO `simpleq`.`config` (`id`, `name`, `value`)
	VALUES ('1', 'System.Email.User', ''); -- Email address used to send email.

-- Password is encrypted using algorithm in /api/hepers/encrypter-secrypter.js
INSERT INTO `simpleq`.`config` (`id`, `name`, `value`)
  VALUES ('2', 'System.Email.Pass', ''); -- Password of email address used to send email.

-- Admin password is md5 encrypted
INSERT INTO `simpleq`.`config` (`id`, `name`, `value`)
  VALUES('3', 'Admin.Pass', 'f6fdffe48c908deb0f4c3bd36c032e72');

INSERT INTO `simpleq`.`config` (`id`, `name`, `value`)
  VALUES ('4', 'Admin.Username', 'admin');



-- otp table
CREATE TABLE `simpleq`.`otp` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `otp` VARCHAR(7) NOT NULL,
  `verified` ENUM('Y', 'N') NULL DEFAULT 'N',
  `otpCount` INT NULL DEFAULT 1,
  `createdAt` DATETIME NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_otp_1`
    FOREIGN KEY (`userId`)
    REFERENCES `simpleq`.`users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);

