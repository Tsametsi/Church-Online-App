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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `logged_in_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Guitar',1200.00,'pictures/guitar.jpeg','Music Instruments',NULL),(2,'Grand Piano',2999.00,'pictures/grand_piano.jpeg','Music Instruments',NULL),(3,'Drum Sets & Set Components',8495.00,'pictures/drum_sets.jpeg','Music Instruments',NULL),(4,'Wood Tambourine',185.00,'pictures/wood_tambourine.jpeg','Music Instruments',NULL),(5,'Traditional Drum',900.00,'pictures/traditional_drum.jpeg','Music Instruments',NULL),(6,'Microphone',649.00,'pictures/microphone.jpeg','Music Instruments',NULL),(7,'Pair of Dual 15\" PA DJ Speaker',3500.00,'pictures/pa_dj_speaker.jpeg','Music Instruments',NULL),(8,'My Creative Bible',500.00,'pictures/my_creative_bible.jpeg','Books',NULL),(9,'Holy Bible',300.00,'pictures\\WhatsApp Image 2024-07-24 at 12.43.46 (1).jpeg','Books',NULL),(10,'Diary',80.00,'pictures/diary.jpeg','Books',NULL),(11,'Black Holy Bible',260.00,'pictures/black_holy_bible.jpeg','Books',NULL),(12,'God is God Cap',160.00,'pictures/god_is_god_cap.jpeg','Clothes',NULL),(13,'Cross Cap',160.00,'pictures/cross_cap.jpeg','Clothes',NULL),(14,'Golf Shirt',250.00,'pictures/golf_shirt.jpeg','Clothes',NULL),(15,'Yahweh Sweater',400.00,'pictures/yahweh_sweater.jpeg','Clothes',NULL),(16,'Jesus Calling Sweater',400.00,'pictures/jesus_calling_sweater.jpeg','Clothes',NULL),(17,'nd',54456546.00,'chat_icon.png','electronic',NULL),(18,'dnf',435.00,'chat_icon.png','Clothes',NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-17 21:28:53
