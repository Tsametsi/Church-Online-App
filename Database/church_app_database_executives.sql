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
-- Table structure for table `executives`
--

DROP TABLE IF EXISTS `executives`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `executives` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `position` varchar(100) DEFAULT NULL,
  `bio` text,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `executives`
--

LOCK TABLES `executives` WRITE;
/*!40000 ALTER TABLE `executives` DISABLE KEYS */;
INSERT INTO `executives` VALUES (1,'Justin','Doe','Pastor','John has been the lead pastor for over 10 years...','john.doe@example.com','123-456-7890','pictures\\WhatsApp Image 2024-07-24 at 12.43.54 (1).jpeg'),(3,'Jane','Smith','Associate Pastor','Jane focuses on community outreach and pastoral care.','jane.smith@example.com','555-0101','WhatsApp Image 2024-07-24 at 12.43.54.jpeg'),(4,'Emily','Johnson','Youth Pastor','Emily is dedicated to working with the youth and helping them grow spiritually.','emily.johnson@example.com','555-0102','pictures\\WhatsApp Image 2024-07-24 at 12.43.54.jpeg'),(5,'Michael','Williams','Music Director','Michael oversees the music ministry and leads worship services.','michael.williams@example.com','555-0103','WhatsApp Image 2024-07-24 at 12.43.54.jpeg'),(6,'Linda','Brown','Administrative Assistant','Linda manages the church office and coordinates events.','linda.brown@example.com','555-0104','WhatsApp Image 2024-07-24 at 12.43.55.jpeg'),(7,'John','Doe','Senior Pastor','John has been leading our church for over 15 years with dedication and passion.','john.doe@example.com','555-0100','https://via.placeholder.com/150?text=John+Doe'),(8,'Jane','Smith','Associate Pastor','Jane focuses on community outreach and pastoral care.','jane.smith@example.com','555-0101','https://via.placeholder.com/150?text=Jane+Smith'),(9,'Emily','Johnson','Youth Pastor','Emily is dedicated to working with the youth and helping them grow spiritually.','emily.johnson@example.com','555-0102','https://via.placeholder.com/150?text=Emily+Johnson'),(10,'Michael','Williams','Music Director','Michael oversees the music ministry and leads worship services.','michael.williams@example.com','555-0103','https://via.placeholder.com/150?text=Michael+Williams'),(11,'Linda','Brown','Administrative Assistant','Linda manages the church office and coordinates events.','linda.brown@example.com','555-0104','https://via.placeholder.com/150?text=Linda+Brown');
/*!40000 ALTER TABLE `executives` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-17 21:28:54
