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
-- Table structure for table `podcasts`
--

DROP TABLE IF EXISTS `podcasts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `podcasts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `youtube_link` varchar(255) DEFAULT NULL,
  `publish_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `video_url` varchar(255) DEFAULT NULL,
  `audio_file` varchar(255) DEFAULT NULL,
  `video_file` varchar(255) DEFAULT NULL,
  `like_count` int DEFAULT '0',
  `url` varchar(255) DEFAULT NULL,
  `show_id` int DEFAULT NULL,
  `dislike_count` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `show_id` (`show_id`),
  CONSTRAINT `podcasts_ibfk_1` FOREIGN KEY (`show_id`) REFERENCES `podcast_shows` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `podcasts`
--

LOCK TABLES `podcasts` WRITE;
/*!40000 ALTER TABLE `podcasts` DISABLE KEYS */;
INSERT INTO `podcasts` VALUES (1,' AFM Cape Town','Nanga Amanxeba Esandleni, Nali Elinye Ephangweni @','https://www.youtube.com/embed/yXHAl6dkHAk','2024-07-28 15:55:11',NULL,NULL,NULL,123901,NULL,NULL,7),(2,'Episode 2: The Evolution of Storytelling','Exploring how storytelling has changed over the years.','https://www.youtube.com/watch?v=3JZ_D3ELwOQ','2024-07-28 15:55:11',NULL,NULL,NULL,778901,NULL,NULL,1),(70,'Muffin','Muffin','https://www.youtube.com/embed/u96rVINbAUI','2024-10-11 10:06:57',NULL,NULL,NULL,0,NULL,NULL,2),(72,'new episode','New one',NULL,'2024-10-14 16:54:22',NULL,NULL,'/uploads/podcasts/1728917662335.mp4',0,NULL,NULL,0);
/*!40000 ALTER TABLE `podcasts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-16 13:34:24
