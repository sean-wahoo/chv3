-- MariaDB dump 10.19  Distrib 10.5.10-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: chv3_testing
-- ------------------------------------------------------
-- Server version	10.5.10-MariaDB
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
--
-- Current Database: `chv3_testing`
--
CREATE DATABASE
/*!32312 IF NOT EXISTS*/
`chv3_testing`
/*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `chv3_testing`;
--
-- Table structure for table `users`
--
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isGoogle` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
--
-- Dumping data for table `users`
--
LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO
  `users`
VALUES
  (
    '47e6980a-6a70-42e5-93e0-3f3a978bd22e',
    'sean5',
    'trumpinson@gmail.com',
    '$2b$10$pgjLtX9OuI.P8IMmYjR5MOfLr6gqFdvieMFDTRyL9U/l6/xkngeJm',
    0
  ),(
    '498b358b-fff7-476f-939d-1ccff5428327',
    'moneyman',
    'moneyman4949yahoo@gmail.com',
    NULL,
    1
  ),(
    '4eba8c01-f130-4653-8f19-a8bad900b585',
    'sean',
    'test@email.com',
    '$2b$10$LBf7f3Zqd2IVu41qIJuMu.GorrWrvaXk53LX5EDa17yawhjR0/EGi',
    0
  ),(
    '8b76819a-5f27-4c0b-b26f-ec6c512a87f4',
    'sean2',
    'test@email2.com',
    '$2b$10$Y/TiT4xnwKHU7gk4WP9sMOCZsCJYaT4Z4zx7KCkseQ3ZMVY1GXjzW',
    0
  ),(
    'a00c48d3-6fd9-4e90-901a-2f8fbb23a927',
    'sean3',
    'test3@email.com',
    '$2b$10$2B/Gul9XWCybbMoIrfYw4uAtlCC9EHbsoOXO/xmEwdF1AEL1Z02xC',
    0
  ),(
    'fd224b38-df3c-483e-9532-8e7d9e04a43e',
    'sean4',
    'test@email4.com',
    '$2b$10$S7qSC1oWMuuCCSU5LIAwxOMOOdCAC/VVRM3MK6p/UCV5fCN0FAw/a',
    0
  );
  /*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
  /*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
  /*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
  /*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
  /*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
  /*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
  /*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
  /*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
  /*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
-- Dump completed on 2021-06-08 11:14:31