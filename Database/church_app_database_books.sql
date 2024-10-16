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
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (13,'1 Chronicles'),(46,'1 Corinthians'),(62,'1 John'),(11,'1 Kings'),(60,'1 Peter'),(9,'1 Samuel'),(52,'1 Thessalonians'),(54,'1 Timothy'),(14,'2 Chronicles'),(47,'2 Corinthians'),(63,'2 John'),(12,'2 Kings'),(61,'2 Peter'),(10,'2 Samuel'),(53,'2 Thessalonians'),(55,'2 Timothy'),(64,'3 John'),(44,'Acts'),(30,'Amos'),(51,'Colossians'),(27,'Daniel'),(5,'Deuteronomy'),(21,'Ecclesiastes'),(49,'Ephesians'),(17,'Esther'),(2,'Exodus'),(26,'Ezekiel'),(15,'Ezra'),(48,'Galatians'),(1,'Genesis'),(35,'Habakkuk'),(37,'Haggai'),(58,'Hebrews'),(28,'Hosea'),(23,'Isaiah'),(59,'James'),(24,'Jeremiah'),(18,'Job'),(29,'Joel'),(43,'John'),(32,'Jonah'),(6,'Joshua'),(65,'Jude'),(7,'Judges'),(25,'Lamentations'),(3,'Leviticus'),(42,'Luke'),(39,'Malachi'),(41,'Mark'),(40,'Matthew'),(33,'Micah'),(34,'Nahum'),(16,'Nehemiah'),(4,'Numbers'),(31,'Obadiah'),(57,'Philemon'),(50,'Philippians'),(20,'Proverbs'),(19,'Psalms'),(66,'Revelation'),(45,'Romans'),(8,'Ruth'),(22,'Song of Solomon'),(56,'Titus'),(38,'Zechariah'),(36,'Zephaniah');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-16 13:34:26
