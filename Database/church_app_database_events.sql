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
  `ticket_url` varchar(255) DEFAULT NULL,
  `trending` tinyint(1) DEFAULT '0',
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Sunday Service','Join us for our weekly service.','2024-08-18 10:33:00','https://example.com/sunday-service',0,'2024-08-18 08:05:40',NULL,0,NULL),(2,'Youth Fellowship','A gathering for young adults.','2024-07-25 18:00:00','https://example.com/youth-fellowship',0,'2024-07-17 13:45:40',NULL,0,NULL),(3,'Bible Study','Weekly study of scriptures.','2024-07-22 19:00:00','https://example.com/bible-study',0,'2024-07-17 13:45:40',NULL,0,NULL),(4,'Prayer Meeting','Community prayer session.','2024-07-24 20:00:00',NULL,0,'2024-07-17 13:45:40',NULL,0,NULL),(5,'Guest Speaker Event','Special event with guest speakers.','2024-07-28 14:00:00','https://example.com/guest-speaker-event',1,'2024-07-17 13:45:40',NULL,0,NULL),(13,'lkx',',kxs','2024-11-08 11:54:00',NULL,0,'2024-10-06 09:55:04',NULL,0,NULL),(14,'fd','df','2024-10-06 12:08:00',NULL,0,'2024-10-06 10:06:16',NULL,0,NULL),(15,'kdm','nked','2024-10-17 12:11:00',NULL,0,'2024-10-06 10:09:22',NULL,0,NULL),(16,'nvhjvm','  vbvjv ','2024-10-16 18:32:00',NULL,0,'2024-10-07 16:32:59',NULL,0,NULL),(17,'nvhjvm','  vbvjv ','2024-10-16 18:32:00',NULL,0,'2024-10-07 16:32:59',NULL,0,NULL),(18,'dfs','sdf','2024-10-09 13:44:00',NULL,0,'2024-10-09 11:44:32',NULL,0,NULL),(19,'ddc','sdc','2024-10-09 13:48:00',NULL,0,'2024-10-09 11:48:54',NULL,0,NULL),(20,'cake','cake','2024-10-09 13:56:00',NULL,0,'2024-10-09 11:56:40','https://claude.ai/chat/866fbdf1-3aba-4649-a74c-c638dab4b93b',0,NULL),(21,'muffins','muffins','2024-10-09 13:58:00','https://claude.ai/chat/866fbdf1-3aba-4649-a74c-c638dab4b93b',0,'2024-10-09 11:57:42','https://claude.ai/chat/866fbdf1-3aba-4649-a74c-c638dab4b93b',0,NULL),(22,'jnj','jsd','2024-10-10 16:14:00','https://claude.ai/chat/866fbdf1-3aba-4649-a74c-c638dab4b93b',0,'2024-10-10 14:15:08','https://claude.ai/chat/866fbdf1-3aba-4649-a74c-c638dab4b93b',0,NULL),(23,'fgfd','fdhsfd','2024-10-11 09:57:00',NULL,0,'2024-10-11 07:57:19','https://claude.ai/chat/866fbdf1-3aba-4649-a74c-c638dab4b93b',0,NULL),(24,'ghf','gf','2024-10-11 10:42:00',NULL,0,'2024-10-11 08:42:28','https://claude.ai/chat/866fbdf1-3aba-4649-a74c-c638dab4b93b',0,NULL);
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

-- Dump completed on 2024-10-16 13:34:11
