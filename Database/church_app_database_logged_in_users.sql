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
  `logged_in` tinyint DEFAULT '0',
  `church_id` int DEFAULT NULL,
  `branch_name` varchar(255) DEFAULT NULL,
  `subscription_status` enum('free','basic','premium') DEFAULT 'free',
  `caption` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `fk_church` (`church_id`),
  CONSTRAINT `fk_church` FOREIGN KEY (`church_id`) REFERENCES `churches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logged_in_users`
--

LOCK TABLES `logged_in_users` WRITE;
/*!40000 ALTER TABLE `logged_in_users` DISABLE KEYS */;
INSERT INTO `logged_in_users` VALUES (3,'Matt','Matt@','Matt@gmail.com','chat_icon.png',1,NULL,NULL,'premium',NULL,'2024-09-17 13:17:14'),(4,'James','James@','James@gmail.com','chat_icon.png',1,NULL,NULL,'free',NULL,'2024-09-17 13:17:14'),(5,'mahlogonolo','mahlogonolo@','ramathetje00@gmail.com','chat_icon.png',1,NULL,NULL,'free',NULL,'2024-09-17 13:17:14'),(21,'Thakgo','thakgo@','thakgo@1','chat_icon.png',1,15,'Mohlaletse ','free',NULL,'2024-09-17 13:17:14'),(22,'Sammy','$2b$10$pYpgpg2AKP.wTkAayLLYueK9oLq0BoInHYirCrFYyh/zlfWpzKwhm','Sammy@gmail.com','chat_icon.png',1,21,'Midrand','free',NULL,'2024-09-17 13:17:14'),(23,'Eyethu','$2b$10$5lfKrN0bRnLgTK2MOTikbODYpDsNIm1SeDyRjItSLhEglcMpEXaNK','eyethu@gmail.com','chat_icon.png',1,19,'Midrand','free',NULL,'2024-09-17 13:17:14'),(24,'Mpho','$2b$10$rZiKvLxpv.t9YGbSFAc7heSTltdhTZF6U2BVPvmWab7LwQUPtEtzm','Mpho@gmail.com','default-profile.png',1,18,'Midrand','free',NULL,'2024-09-17 13:17:14'),(25,'qwerty','$2a$10$MB3tMNJUOC1GvRevU/VR0ewxFhdmsKZ3uPr5.desYArlCqPxdA.06','qwerty@gmail.com','default-profile.png',1,19,'Midrand','free',NULL,'2024-09-17 13:17:14'),(26,'Max','$2b$10$KpfE/VKLyufGVeW2/rKBw.BQ/rROO8h7UhollJBu2g.8oWcfWTpdW','Max@gmail.com','default-profile.png',1,10,'Midrand','free',NULL,'2024-09-17 13:17:14'),(27,'john_doe','password123','john@example.com','john_profile.png',1,NULL,NULL,'premium','Just a debate enthusiast.','2024-09-17 13:30:37'),(28,'jane_smith','password456','jane@example.com','jane_profile.png',1,NULL,NULL,'basic','Love discussing current events.','2024-09-17 13:30:37'),(29,'alice_jones','password789','alice@example.com','alice_profile.png',0,NULL,NULL,'free','Tech lover and debater.','2024-09-17 13:30:37');
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

-- Dump completed on 2024-09-17 21:29:00
