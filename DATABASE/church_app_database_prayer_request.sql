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
-- Table structure for table `prayer_request`
--

DROP TABLE IF EXISTS `prayer_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prayer_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `prayer_request` text NOT NULL,
  `pastor_email` varchar(255) NOT NULL,
  `response` text,
  `rating` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prayer_request`
--

LOCK TABLES `prayer_request` WRITE;
/*!40000 ALTER TABLE `prayer_request` DISABLE KEYS */;
INSERT INTO `prayer_request` VALUES (1,'rer','followme303030@gmail.com','sfd','pastor1@example.com',NULL,NULL),(2,'rer','followme303030@gmail.com','sfd','pastor1@example.com',NULL,NULL),(3,'rer','followme303030@gmail.com','sfd','pastor1@example.com',NULL,NULL),(4,'rer','followme303030@gmail.com','sfd','pastor1@example.com',NULL,NULL),(5,'Jazz','jazz@gmail.com','new request','pastor1@example.com',NULL,NULL),(6,'Eyethu','eyethugwacela457@gmail.com','New request','followme303030@gmail.com',NULL,NULL),(7,'Eyethu','eyethugwacela457@gmail.com','New request','tsametsibmalala@gmail.com',NULL,NULL),(8,'Eyethu','followme303030@gmail.com','new request','tsametsibmalala@gmail.com',NULL,NULL),(9,'Eyethu','followme303030@gmail.com','new request','tsametsibmalala@gmail.com',NULL,NULL),(10,'Eyethu','followme303030@gmail.com','new request','tsametsibmalala@gmail.com',NULL,NULL),(11,'Eyethu','followme303030@gmail.com','new request','tsametsibmalala@gmail.com',NULL,NULL),(12,'Eyethu','followme303030@gmail.com','new request','tsametsibmalala@gmail.com',NULL,NULL),(13,'Eyethu','followme303030@gmail.com','new request','tsametsibmalala@gmail.com',NULL,NULL),(14,'Eyethu','followme303030@gmail.com','new request','tsametsibmalala@gmail.com',NULL,NULL),(15,'Eyethu','followme303030@gmail.com','new request','tsametsibmalala@gmail.com',NULL,NULL),(16,'Eyethu','followme303030@gmail.com','new request','tsametsibmalala@gmail.com',NULL,NULL),(17,'Eyethu','followme303030@gmail.com','ddwd','followme303030@gmail.com',NULL,NULL),(18,'Eyethu','followme303030@gmail.com','ddwd','followme303030@gmail.com',NULL,NULL),(19,'Eyethu','followme303030@gmail.com','New request','eyethugwacela457@gmail.com@gmail.com',NULL,NULL),(20,'Eyethu','followme303030@gmail.com','Heyyyyyy','eyethugwacela457@gmail.com',NULL,NULL),(21,'Jazz','followme303030@gmail.com','New request','eyethugwacela457@gmail.com',NULL,NULL),(22,'Jazz','followme303030@gmail.com','New request','eyethugwacela457@gmail.com',NULL,NULL),(23,'Jazz','followme303@gmail.com','New request','eyethugwacela457@gmail.com',NULL,NULL),(24,'Eyethu','Matt@gmail.com','Hi','eyethugwacela457@gmail.com',NULL,NULL);
/*!40000 ALTER TABLE `prayer_request` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-20 21:57:34
