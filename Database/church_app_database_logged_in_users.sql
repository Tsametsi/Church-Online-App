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
  `role` enum('Pastor','Bishop','Member','Elder','Deacon','Ministry Leader','Volunteer','Youth Leader','Worship Leader','Administrative Staff','New Visitor','Church Staff','Missionary','Sunday School Teacher','Small Group Leader','Community Group Leader','Outreach Coordinator','Prayer Team Member','Event Coordinator','Media/Tech Team','Finance Committee Member','Counselor/Spiritual Advisor','Children’s Ministry Leader','Mission Trip Coordinator','Hospitality Team Member','Facilities Manager') DEFAULT 'Member',
  `subscription_status` enum('free','basic','premium') DEFAULT 'free',
  `caption` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `fk_church` (`church_id`),
  CONSTRAINT `fk_church` FOREIGN KEY (`church_id`) REFERENCES `churches` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logged_in_users`
--

LOCK TABLES `logged_in_users` WRITE;
/*!40000 ALTER TABLE `logged_in_users` DISABLE KEYS */;
INSERT INTO `logged_in_users` VALUES (1,'Sammy','$2b$10$4A1Ea/GF7j0Iei6UaVGpTeNs89HZteQcNhKgWHjeZGn0sW.CtrYMe','Sammy@gmail.com','default-profile.png',1,15,'Midrand','Member','free',NULL,'2024-09-19 10:51:40'),(2,'Eyethu','$2b$10$2lVQP6mOqCktt2JZM12xcuPYwpde1UIfU3KDqzK4DyEnw6Q/SV5j6','eyethu@gmail.com','default-profile.png',1,24,'Midrand','Member','free',NULL,'2024-09-19 10:52:30'),(3,'Man','$2b$10$mND.HcbzyW7eG/cJVpIhne.MD/senHTx8lpYc/kh1k0Iy/uf8XupK','Man@gmail.com','default-profile.png',1,25,'Midrand','Member','free',NULL,'2024-09-19 11:16:19'),(4,'qwe','$2b$10$yFG1cINDia2ARIAIyo9a2OJJEJ9epLaxFzWOQnzqsdr1t5YBcMHiG','qwe@gmail.com','default-profile.png',1,26,'Midrand','Member','free',NULL,'2024-09-23 12:57:50'),(5,'Scott','$2b$10$48O50kJHA6PtRjXeFUGr0.Ri8E0Mu5gIF99K9LJMhs6BaUVpgJCIO','Scott@gmail.com','default-profile.png',1,26,'Midrand','Member','free',NULL,'2024-10-15 08:18:51'),(7,'Smith','$2b$10$ozI9vvM9s4JGCucWtv6wDu1cBjjZhYgGPS5FM18unnNYFbLnTa26O','Smith@gmail.com','default-profile.png',0,23,'Midrand','Pastor','free',NULL,'2024-10-15 09:54:33'),(8,'Mazz','$2b$10$ukQ7SEFnRdcboDQAlpJQCu2L14nMFdQ7sIcYZnzPBB4ogFSBHvigi','Mazz@gmail.com','default-profile.png',1,25,'Midrand','Pastor','free',NULL,'2024-10-15 09:55:55');
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

-- Dump completed on 2024-10-16 13:34:23
