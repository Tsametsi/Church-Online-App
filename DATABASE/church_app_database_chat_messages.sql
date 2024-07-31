-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: church_app_database
-- ------------------------------------------------------
-- Server version	8.0.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `recipient` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_messages`
--

LOCK TABLES `chat_messages` WRITE;
/*!40000 ALTER TABLE `chat_messages` DISABLE KEYS */;
INSERT INTO `chat_messages` VALUES (1,'yourUsername','Eyethu','Hi',NULL,'2024-07-22 12:43:29'),(2,'yourUsername','Eyethu','hi',NULL,'2024-07-22 12:45:37'),(3,'yourUsername','Jazz','Hello',NULL,'2024-07-22 12:46:02'),(4,'yourUsername','Eyethu','Good',NULL,'2024-07-22 12:46:29'),(5,'yourUsername','Eyethu','How are you ?',NULL,'2024-07-22 12:51:48'),(6,'yourUsername','Eyethu','Good and you?',NULL,'2024-07-22 13:04:11'),(8,'yourUsername','mahlogonolo','Hi',NULL,'2024-07-22 17:17:09'),(10,'yourUsername','James','Hey',NULL,'2024-07-22 17:55:05'),(11,'mahlogonolo','Fan','hi',NULL,'2024-07-22 18:43:57'),(12,'mahlogonolo','James','Hey Zoe',NULL,'2024-07-22 18:44:29'),(13,'mahlogonolo','Matt','hi',NULL,'2024-07-22 18:44:57'),(15,'Jazz','Jazz','hi',NULL,'2024-07-22 18:47:48'),(16,'Jazz','Jazz','hi',NULL,'2024-07-22 18:47:57'),(17,'Jazz','mahlogonolo','sup',NULL,'2024-07-22 18:48:10'),(18,'Jazz','mahlogonolo','heyy',NULL,'2024-07-22 18:48:20'),(19,'Jazz','mahlogonolo','sho',NULL,'2024-07-22 18:48:46'),(20,'Jazz','get','hi',NULL,'2024-07-22 19:11:24'),(23,'Jazz','zoe','get',NULL,'2024-07-22 19:26:43'),(24,'Jazz','mahlogonolo','yy',NULL,'2024-07-22 19:26:56'),(26,'mahlogonolo','Jazz','hi',NULL,'2024-07-23 09:01:20'),(27,'mahlogonolo','mahlogonolo','hi',NULL,'2024-07-23 09:01:36'),(28,'mahlogonolo','zoe','hi',NULL,'2024-07-23 09:01:43'),(29,'Jazz','zoe','hi',NULL,'2024-07-23 09:20:50'),(30,'Jazz','zoe','ty',NULL,'2024-07-23 09:21:02'),(31,'Jazz','Matt','hi',NULL,'2024-07-23 09:54:17'),(32,'Jazz','get','hi',NULL,'2024-07-23 09:59:12'),(33,'Fan','mahlogonolo','Hey',NULL,'2024-07-23 10:02:02'),(34,'Fan','Fan','yo',NULL,'2024-07-23 10:13:06'),(35,'Fan','Jazz','Hi',NULL,'2024-07-23 10:13:35'),(37,'Eyethu','mahlogonolo','L',NULL,'2024-07-24 06:08:09'),(38,'Eyethu','James','hi',NULL,'2024-07-24 11:42:28'),(39,'mahlogonolo','','','/uploads/1721822477090.jpg','2024-07-24 12:01:17'),(43,'mahlogonolo','mahlogonolo','','/uploads/1721822650200.jpg','2024-07-24 12:04:10'),(45,'Eyethu','mahlogonolo','','/uploads/1721822822228.jpg','2024-07-24 12:07:02'),(46,'Joseph','Joseph','hi',NULL,'2024-07-25 17:59:23'),(47,'QWE','zoe','Hi',NULL,'2024-07-27 13:18:32'),(48,'QWE','zoe','Hey',NULL,'2024-07-27 19:10:29'),(49,'QWE','zoe','Hello',NULL,'2024-07-27 19:28:30'),(50,'QWE','Eyethu','Hi',NULL,'2024-07-28 10:35:57'),(51,'mahlogonolo','James','Hi',NULL,'2024-07-28 17:57:31');
/*!40000 ALTER TABLE `chat_messages` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-31 11:24:24
