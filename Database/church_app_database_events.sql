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
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `event_date` datetime NOT NULL,
  `virtual_url` varchar(255) DEFAULT NULL,
  `notification_on` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Sunday Service','Join us for our weekly service.','2024-08-18 10:33:00','https://example.com/sunday-service',0,'2024-08-18 08:05:40'),(2,'Youth Fellowship','A gathering for young adults.','2024-07-25 18:00:00','https://example.com/youth-fellowship',0,'2024-07-17 13:45:40'),(3,'Bible Study','Weekly study of scriptures.','2024-07-22 19:00:00','https://example.com/bible-study',0,'2024-07-17 13:45:40'),(4,'Prayer Meeting','Community prayer session.','2024-07-24 20:00:00',NULL,0,'2024-07-17 13:45:40'),(5,'Guest Speaker Event','Special event with guest speakers.','2024-07-28 14:00:00','https://example.com/guest-speaker-event',1,'2024-07-17 13:45:40'),(7,'m','kn','2024-08-18 10:37:00',NULL,0,'2024-08-18 08:38:08'),(8,'kcxnv','jnsd','2024-08-18 10:39:00',NULL,0,'2024-08-18 08:38:33'),(9,'sc','sdc','2024-08-18 10:42:00',NULL,0,'2024-08-18 08:41:07'),(10,'Test','Test','2024-09-03 12:19:00',NULL,0,'2024-08-29 12:10:21'),(11,'Myy','Myyy','2024-09-14 12:28:00',NULL,0,'2024-09-14 10:27:11'),(12,'dfg','fdga','2024-09-14 13:54:00',NULL,0,'2024-09-14 11:53:42');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-17 21:28:57
