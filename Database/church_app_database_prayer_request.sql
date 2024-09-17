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
  `email` varchar(255) NOT NULL,
  `prayer_request` text NOT NULL,
  `pastor_email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prayer_request`
--

LOCK TABLES `prayer_request` WRITE;
/*!40000 ALTER TABLE `prayer_request` DISABLE KEYS */;
INSERT INTO `prayer_request` VALUES (60,'eyethugwacela457@gmail.com','xcv','eyethugwacela457@gmail.com','EYETHU GWACELA'),(61,'eyethugwacela457@gmail.com','sd','eyethugwacela457@gmail.com','EYETHU GWACELA'),(62,'eyethugwacela457@gmail.com','Hi','eyethugwacela457@gmail.com','EYETHU GWACELA'),(63,'eyethugwacela457@gmail.com','momomom','eyethugwacela457@gmail.com','momom'),(64,'eyethugwacela457@gmail.com','kjnfvd','eyethugwacela457@gmail.com','dsv'),(65,'eyethugwacela457@gmail.com','kjnfvd','eyethugwacela457@gmail.com','dsv'),(66,'eyethugwacela457@gmail.com','kjnfvd','eyethugwacela457@gmail.com','dsv'),(67,'eyethugwacela457@gmail.com','kjnfvd','eyethugwacela457@gmail.com','dsv'),(68,'eyethugwacela457@gmail.com','kjnfvd','eyethugwacela457@gmail.com','dsv'),(69,'eyethugwacela457@gmail.com','kjnfvd','eyethugwacela457@gmail.com','dsv'),(70,'eyethugwacela457@gmail.com','kjnfvd','eyethugwacela457@gmail.com','dsv'),(71,'eyethugwacela457@gmail.com','kjnfvd','eyethugwacela457@gmail.com','dsv'),(72,'eyethugwacela457@gmail.com','kjnfvd','eyethugwacela457@gmail.com','dsv'),(73,'eyethugwacela457@gmail.com','kjnfvd','eyethugwacela457@gmail.com','dsv'),(74,'eyethugwacela457@gmail.com','kjnfvd','eyethugwacela457@gmail.com','dsv'),(75,'Sammy@gmail.com','HI new request her','eyethugwacela457@gmail.com','dsv');
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

-- Dump completed on 2024-09-17 21:28:59
