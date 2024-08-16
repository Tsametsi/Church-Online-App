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
-- Table structure for table `logged_in_users`
--

DROP TABLE IF EXISTS `logged_in_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logged_in_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT 'default-profile.png',
  `profile_picture` varchar(255) DEFAULT NULL,
  `logged_in` tinyint DEFAULT '0',
  `church_id` int DEFAULT NULL,
  `branch_name` varchar(255) DEFAULT NULL,
  `subscription_status` enum('free','basic','premium') DEFAULT 'free',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `fk_church` (`church_id`),
  CONSTRAINT `fk_church` FOREIGN KEY (`church_id`) REFERENCES `churches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logged_in_users`
--

LOCK TABLES `logged_in_users` WRITE;
/*!40000 ALTER TABLE `logged_in_users` DISABLE KEYS */;
INSERT INTO `logged_in_users` VALUES (1,'Eyethu','Gwacela30#','eyethugwacela457@gmail.com','default-profile.png',NULL,1,NULL,NULL,'premium'),(2,'Jazz','Jazz#',NULL,'default-profile.png',NULL,1,NULL,NULL,'premium'),(3,'Matt','Matt@','Matt@gmail.com','default-profile.png',NULL,1,NULL,NULL,'premium'),(4,'James','James@','James@gmail.com','default-profile.png',NULL,1,NULL,NULL,'free'),(5,'mahlogonolo','mahlogonolo@','ramathetje00@gmail.com','default-profile.png',NULL,1,NULL,NULL,'free'),(16,'VHS','vhs@','vhs@gmail.com','default-profile.png',NULL,1,21,'Soweto','free'),(17,'Jamal','Jamal@','Jamal@gmail.com','default-profile.png',NULL,1,10,'Soweto','free'),(18,'Sing','Sing@','Singl@gmail.com','default-profile.png',NULL,0,20,'Jozi','free');
/*!40000 ALTER TABLE `logged_in_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-12 21:42:10
