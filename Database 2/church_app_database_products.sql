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
  `title` varchar(255) NOT NULL,
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `sizes` json NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (11,'Bible','https://i.etsystatic.com/20056619/r/il/eb5418/2168595219/il_fullxfull.2168595219_mns0.jpg',29.99,100,'[\"S\", \"M\", \"L\"]'),(12,'Hymnal Book','https://i5.walmartimages.com/asr/8c7cb5c2-f3fe-4f5a-ac65-788eec440366_1.c765fdc1f1c5012ebf6e3ee7f2bce427.jpeg?odnWidth=612&odnHeight=612&odnBg=ffffff',19.99,150,'[\"M\", \"L\"]'),(13,'T-Shirt with Church Logo','d06a8f38-8790-4bc8-a060-118185821f11.jpg',24.99,75,'[\"S\", \"M\", \"L\", \"XL\"]'),(14,'Prayer Journal','https://lirp.cdn-website.com/26c186a7/dms3rep/multi/opt/website+photo+front-1920w.jpg',14.99,200,'[\"One Size\"]'),(15,'Cross Pendant Necklace','https://i5.walmartimages.com/asr/52c4c1b1-b6e1-476f-a94c-857e314f386d_1.51d71fdd2e0c1f85299a9ae2099fb6a3.jpeg',9.99,300,'[\"One Size\"]'),(16,'Christian Art Print','https://via.placeholder.com/150?text=Christian+Art',39.99,50,'[\"One Size\"]'),(17,'Church Mug','https://via.placeholder.com/150?text=Church+Mug',12.99,120,'[\"One Size\"]'),(18,'Devotional Book','https://via.placeholder.com/150?text=Devotional+Book',15.99,80,'[\"One Size\"]'),(19,'Church Calendar','https://via.placeholder.com/150?text=Church+Calendar',10.99,200,'[\"One Size\"]'),(20,'Bible Study Guide','https://via.placeholder.com/150?text=Study+Guide',29.99,60,'[\"One Size\"]');
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

-- Dump completed on 2024-08-12 21:42:14
