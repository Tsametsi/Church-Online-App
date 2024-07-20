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
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(2,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(3,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(4,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(5,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(6,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(7,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(8,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(9,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(10,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(11,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(12,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(13,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(14,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(15,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(16,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(17,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(18,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(19,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(20,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(21,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(22,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(23,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(24,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(25,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(26,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(27,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(28,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(29,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(30,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(31,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(32,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(33,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(34,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(35,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(36,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(37,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(38,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(39,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(40,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(41,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(42,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(43,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(44,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(45,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(46,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(47,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(48,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(49,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(50,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(51,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(52,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(53,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(54,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(55,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(56,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(57,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(58,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(59,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(60,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(61,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(62,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(63,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(64,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(65,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(66,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(67,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(68,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(69,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(70,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(71,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(72,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(73,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(74,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(75,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(76,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(77,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(78,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(79,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(80,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(81,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(82,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(83,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(84,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(85,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(86,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(87,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(88,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(89,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(90,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(91,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(92,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(93,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(94,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(95,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg'),(96,'Product 1',19.99,'Description for Product 1','https://example.com/product1.jpg'),(97,'Product 2',24.99,'Description for Product 2','https://example.com/product2.jpg'),(98,'Product 3',14.99,'Description for Product 3','https://example.com/product3.jpg'),(99,'Product 4',29.99,'Description for Product 4','https://example.com/product4.jpg'),(100,'Product 5',9.99,'Description for Product 5','https://example.com/product5.jpg');
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

-- Dump completed on 2024-07-20 21:57:34
