-- MariaDB dump 10.19  Distrib 10.5.10-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: chv3_testing
-- ------------------------------------------------------
-- Server version	10.5.10-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `chv3_testing`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `chv3_testing` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `chv3_testing`;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `comment_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `post_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_reply` tinyint(1) NOT NULL DEFAULT 0,
  `reply_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `num_likes` int(11) NOT NULL DEFAULT 0,
  `num_replies` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES ('77hn427OVDAc','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','6BWS1wzJKcN5',0,NULL,'heres a comment',0,6,'2021-06-10 04:13:48'),('7fuziqkZWZD-','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','6BWS1wzJKcN5',1,'77hn427OVDAc','heres a comment',0,0,'2021-06-10 05:35:51'),('HvkKchZpRNEr','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','6BWS1wzJKcN5',1,'77hn427OVDAc','heres a comment',0,0,'2021-06-10 05:33:07'),('k8PIWQGCxAh5','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','6BWS1wzJKcN5',1,'77hn427OVDAc','heres a comment',0,0,'2021-06-10 05:34:43'),('ownjpx3dPnCz','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','6BWS1wzJKcN5',1,'77hn427OVDAc','heres a comment',0,0,'2021-06-10 05:35:08'),('THqtjT1uRIDy','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','6BWS1wzJKcN5',1,'77hn427OVDAc','heres a comment',0,0,'2021-06-10 05:35:11'),('Ul2yiTaogTpb','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','6BWS1wzJKcN5',1,'77hn427OVDAc','heres a comment',0,0,'2021-06-10 05:35:26');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friends` (
  `friendship_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `send_user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recieve_user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'sent',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`friendship_id`),
  KEY `send_user_id` (`send_user_id`),
  KEY `recieve_user_id` (`recieve_user_id`),
  CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`send_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`recieve_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `likes` (
  `like_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `post_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`like_id`),
  KEY `user_id` (`user_id`),
  KEY `post_id` (`post_id`),
  KEY `comment_id` (`comment_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `likes_ibfk_3` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `post_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `num_comments` int(11) NOT NULL DEFAULT 0,
  `num_likes` int(11) NOT NULL DEFAULT 0,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES ('6BWS1wzJKcN5','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','title lol','content lol',0,0,'category lol','2021-06-10 03:48:30'),('7ab32a1d-0674-4a0b-a40a-42392c4053ad','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','title lol','content lol',0,0,'category lol','2021-06-10 03:34:52'),('mx01i0603-ao','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','title lol','content lol',0,0,'category lol','2021-06-10 03:43:07');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isGoogle` tinyint(1) NOT NULL DEFAULT 0,
  `bio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `num_posts` int(11) NOT NULL DEFAULT 0,
  `num_comments` int(11) NOT NULL DEFAULT 0,
  `num_correct_answers` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('47e6980a-6a70-42e5-93e0-3f3a978bd22e','sean5','trumpinson@gmail.com','$2b$10$pgjLtX9OuI.P8IMmYjR5MOfLr6gqFdvieMFDTRyL9U/l6/xkngeJm',0,NULL,0,0,0,'2021-06-09 23:32:06','0000-00-00 00:00:00'),('498b358b-fff7-476f-939d-1ccff5428327','moneyman','moneyman4949yahoo@gmail.com',NULL,1,NULL,0,0,0,'2021-06-09 23:32:06','0000-00-00 00:00:00'),('4eba8c01-f130-4653-8f19-a8bad900b585','sean','test@email.com','$2b$10$LBf7f3Zqd2IVu41qIJuMu.GorrWrvaXk53LX5EDa17yawhjR0/EGi',0,NULL,0,0,0,'2021-06-09 23:32:06','0000-00-00 00:00:00'),('8b76819a-5f27-4c0b-b26f-ec6c512a87f4','sean2','test@email2.com','$2b$10$Y/TiT4xnwKHU7gk4WP9sMOCZsCJYaT4Z4zx7KCkseQ3ZMVY1GXjzW',0,NULL,0,0,0,'2021-06-09 23:32:06','0000-00-00 00:00:00'),('a00c48d3-6fd9-4e90-901a-2f8fbb23a927','sean3','test3@email.com','$2b$10$2B/Gul9XWCybbMoIrfYw4uAtlCC9EHbsoOXO/xmEwdF1AEL1Z02xC',0,NULL,0,0,0,'2021-06-09 23:32:06','0000-00-00 00:00:00'),('fd224b38-df3c-483e-9532-8e7d9e04a43e','sean4','test@email4.com','$2b$10$S7qSC1oWMuuCCSU5LIAwxOMOOdCAC/VVRM3MK6p/UCV5fCN0FAw/a',0,NULL,0,0,0,'2021-06-09 23:32:06','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-11  0:16:22
