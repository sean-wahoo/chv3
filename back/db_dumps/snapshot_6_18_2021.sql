-- MySQL dump 10.13  Distrib 8.0.25, for Linux (x86_64)
--
-- Host: localhost    Database: chv3_testing
-- ------------------------------------------------------
-- Server version	8.0.25-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `post_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_reply` tinyint(1) NOT NULL DEFAULT '0',
  `reply_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `num_likes` int NOT NULL DEFAULT '0',
  `num_replies` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
INSERT INTO `comments` VALUES ('0_nBQignHor4','47e6980a-6a70-42e5-93e0-3f3a978bd22e','6BWS1wzJKcN5',1,'HvkKchZpRNEr','testing notifications on replies',0,0,'2021-06-13 21:19:47'),('35itDiNHepOQ','fd224b38-df3c-483e-9532-8e7d9e04a43e','6BWS1wzJKcN5',0,NULL,'testing notifications on replies',0,0,'2021-06-14 05:53:57'),('77hn427OVDAc','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','6BWS1wzJKcN5',0,NULL,'heres a comment',0,6,'2021-06-10 04:13:48'),('7fuziqkZWZD-','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','6BWS1wzJKcN5',1,'77hn427OVDAc','heres a comment',0,0,'2021-06-10 05:35:51'),('7mXYLjfVNccC','47e6980a-6a70-42e5-93e0-3f3a978bd22e','6BWS1wzJKcN5',1,'HvkKchZpRNEr','testing notifications on replies',0,0,'2021-06-13 21:19:10'),('a3i7iXt6AkPD','47e6980a-6a70-42e5-93e0-3f3a978bd22e','6BWS1wzJKcN5',1,'HvkKchZpRNEr','testing notifications on replies',0,0,'2021-06-13 21:16:41'),('at6JbFSCV65Z','47e6980a-6a70-42e5-93e0-3f3a978bd22e','6BWS1wzJKcN5',1,'HvkKchZpRNEr','testing notifications on replies',0,0,'2021-06-13 21:17:17'),('AxY8y1p3Cz3U','47e6980a-6a70-42e5-93e0-3f3a978bd22e','6BWS1wzJKcN5',1,'HvkKchZpRNEr','testing notifications on replies',0,0,'2021-06-13 20:50:04'),('B3vro14ERZ33','fd224b38-df3c-483e-9532-8e7d9e04a43e','6BWS1wzJKcN5',0,NULL,'testing notifications on replies',0,0,'2021-06-14 05:11:54'),('c1m406y_MPxr','47e6980a-6a70-42e5-93e0-3f3a978bd22e','6BWS1wzJKcN5',1,'HvkKchZpRNEr','testing notifications on replies',0,0,'2021-06-13 21:15:58'),('HvkKchZpRNEr','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','6BWS1wzJKcN5',1,'77hn427OVDAc','heres a comment',0,13,'2021-06-10 05:33:07'),('jlhpnKnOmM_y','47e6980a-6a70-42e5-93e0-3f3a978bd22e','6BWS1wzJKcN5',1,'HvkKchZpRNEr','testing notifications on replies',0,0,'2021-06-13 21:20:19'),('k8PIWQGCxAh5','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','6BWS1wzJKcN5',1,'77hn427OVDAc','heres a comment',0,0,'2021-06-10 05:34:43'),('nFcQSqaVP4B7','47e6980a-6a70-42e5-93e0-3f3a978bd22e','6BWS1wzJKcN5',1,'HvkKchZpRNEr','testing notifications on replies',0,0,'2021-06-13 21:18:49'),('Np5M9JXDxm1p','47e6980a-6a70-42e5-93e0-3f3a978bd22e','6BWS1wzJKcN5',1,'HvkKchZpRNEr','testing notifications on replies',0,0,'2021-06-13 20:49:47'),('ownjpx3dPnCz','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','6BWS1wzJKcN5',1,'77hn427OVDAc','heres a comment',0,0,'2021-06-10 05:35:08'),('P2EsO5KZwE_J','47e6980a-6a70-42e5-93e0-3f3a978bd22e','6BWS1wzJKcN5',0,NULL,'testing notifications on replies',0,0,'2021-06-14 05:10:50'),('PTWGo72Xaox6','47e6980a-6a70-42e5-93e0-3f3a978bd22e','6BWS1wzJKcN5',1,'HvkKchZpRNEr','testing notifications on replies',0,0,'2021-06-14 05:08:59'),('THqtjT1uRIDy','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','6BWS1wzJKcN5',1,'77hn427OVDAc','heres a comment',0,0,'2021-06-10 05:35:11'),('TNhp1vosCGWP','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','6BWS1wzJKcN5',0,NULL,'testing notifications on replies',0,0,'2021-06-14 05:54:43'),('uEQE5k3xqs0Q','VsSq54OWHG5w6XPssX9DE','6BWS1wzJKcN5',1,'ouBtIGN4kIWy','here is some reply content',0,0,'2021-06-16 22:14:26'),('Ul2yiTaogTpb','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','6BWS1wzJKcN5',1,'77hn427OVDAc','heres a comment',0,0,'2021-06-10 05:35:26'),('VO8aMRbjD8KO','47e6980a-6a70-42e5-93e0-3f3a978bd22e','6BWS1wzJKcN5',1,'HvkKchZpRNEr','testing notifications on replies',0,0,'2021-06-14 05:10:26'),('WPdnIA7WYXdi','VsSq54OWHG5w6XPssX9DE','6BWS1wzJKcN5',0,NULL,'here is a comment',0,0,'2021-06-16 22:10:25'),('z2l6FwOC6ZnW','47e6980a-6a70-42e5-93e0-3f3a978bd22e','6BWS1wzJKcN5',1,'HvkKchZpRNEr','testing notifications on replies',0,0,'2021-06-13 21:19:13'),('zwXw8-OUx45q','47e6980a-6a70-42e5-93e0-3f3a978bd22e','6BWS1wzJKcN5',1,'HvkKchZpRNEr','testing notifications on replies',0,0,'2021-06-13 20:49:50');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`sean`@`%`*/ /*!50003 TRIGGER `send_comment_notification` AFTER INSERT ON `comments` FOR EACH ROW BEGIN
        DECLARE replied_to_user_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        DECLARE reply_author_username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        DECLARE commented_on_user_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

        DECLARE post_author_user_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        DECLARE comment_author_username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        IF NEW.is_reply = true THEN

            
            SELECT user_id INTO replied_to_user_id FROM comments WHERE comment_id = NEW.reply_id COLLATE utf8mb4_unicode_ci;
            SELECT username INTO reply_author_username FROM users WHERE user_id = NEW.user_id COLLATE utf8mb4_unicode_ci; 
            IF NEW.user_id <> replied_to_user_id THEN
                INSERT INTO notifications (notification_id, user_id, notification_text, notification_type, notification_link) VALUES (UUID(), replied_to_user_id, CONCAT(reply_author_username, " left a reply to your comment!"), "reply", CONCAT("/posts/", NEW.post_id));
            END IF;
        END IF;
        IF NEW.is_reply = false THEN
            SELECT posts.user_id INTO post_author_user_id FROM posts INNER JOIN comments ON comments.post_id = posts.post_id WHERE comments.comment_id = NEW.comment_id COLLATE utf8mb4_unicode_ci;

            SELECT user_id INTO commented_on_user_id FROM posts WHERE post_id = NEW.post_id; 
            SELECT username INTO comment_author_username FROM users WHERE user_id = NEW.user_id COLLATE utf8mb4_unicode_ci;
            IF NEW.user_id <> commented_on_user_id THEN
                INSERT INTO notifications (notification_id, user_id, notification_text, notification_type, notification_link) VALUES (UUID(), commented_on_user_id, CONCAT(comment_author_username, " left a comment on your post!"), "comment", CONCAT("/posts/", NEW.post_id));
            END IF;
        END IF;
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friends` (
  `friendship_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `send_user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `recieve_user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
INSERT INTO `friends` VALUES ('wNA-qHjC4JPC','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','47e6980a-6a70-42e5-93e0-3f3a978bd22e','accepted','2021-06-14 06:19:39','2021-06-14 06:31:28');
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`sean`@`%`*/ /*!50003 TRIGGER `send_friend_request_notification` AFTER INSERT ON `friends` FOR EACH ROW BEGIN DECLARE sender_username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SELECT
  username INTO sender_username
FROM
  users
WHERE
  user_id = NEW.send_user_id;
INSERT INTO
  notifications (
    notification_id,
    user_id,
    notification_text,
    notification_type,
    notification_link
  )
VALUES
  (
    UUID(),
    NEW.recieve_user_id,
    CONCAT(
      sender_username,
      " has sent you a friend request!"
    ),
    "friend",
    CONCAT('/friends/#', NEW.send_user_id)
  );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`sean`@`%`*/ /*!50003 TRIGGER `send_friend_accept_notification` AFTER UPDATE ON `friends` FOR EACH ROW BEGIN 
DECLARE accepter_username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    IF OLD.status = "pending" AND NEW.status = "accepted" THEN
        
        SELECT username INTO accepter_username FROM users WHERE user_id = NEW.recieve_user_id;
        INSERT INTO notifications (notification_id, user_id, notification_text, notification_type, notification_link) VALUES(UUID(), NEW.send_user_id, CONCAT(accepter_username, " accepted your friend request!"), 'friend', CONCAT("/friends/#", NEW.recieve_user_id) );

    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `like_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `post_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
INSERT INTO `likes` VALUES ('R5mQesld7Ty7','47e6980a-6a70-42e5-93e0-3f3a978bd22e',NULL,'k8PIWQGCxAh5','2021-06-14 07:07:40'),('vlTH9Kh2sfuq','47e6980a-6a70-42e5-93e0-3f3a978bd22e','mx01i0603-ao',NULL,'2021-06-14 06:59:38');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`sean`@`%`*/ /*!50003 TRIGGER `send_like_notifications` AFTER INSERT ON `likes` FOR EACH ROW BEGIN

    DECLARE post_author_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    DECLARE post_author_username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    DECLARE comment_author_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    DECLARE comment_author_username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

    DECLARE comment_post_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

    DECLARE liker_username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    
    IF ISNULL(NEW.comment_id) THEN 

        SELECT users.user_id INTO post_author_id FROM users INNER JOIN posts ON posts.user_id = users.user_id WHERE posts.post_id = NEW.post_id;
        SELECT username INTO liker_username FROM users WHERE user_id = NEW.user_id;
        INSERT INTO notifications (notification_id, user_id, notification_text, notification_type, notification_link) VALUES (UUID(), post_author_id, CONCAT(liker_username, " liked your post!"), "like", CONCAT("/posts/", NEW.post_id) );

    ELSE 

        SELECT posts.user_id, posts.post_id INTO comment_author_id, comment_post_id FROM posts INNER JOIN comments ON comments.post_id = posts.post_id WHERE comments.comment_id = NEW.comment_id;

        SELECT username INTO liker_username FROM users WHERE user_id = NEW.user_id;

        INSERT INTO notifications (notification_id, user_id, notification_text, notification_type, notification_link) VALUES (UUID(), comment_author_id, CONCAT(liker_username, " liked your comment!"), "like", CONCAT("/posts/", comment_post_id) );

    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `message_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `send_user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recieve_user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `friendship_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`message_id`),
  KEY `friendship_id` (`friendship_id`),
  KEY `recieve_user_id` (`recieve_user_id`),
  KEY `send_user_id` (`send_user_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`friendship_id`) REFERENCES `friends` (`friendship_id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`recieve_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`send_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES ('iaRWyggO0UgRBCvhnD','47e6980a-6a70-42e5-93e0-3f3a978bd22e','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','i really hope it did',0,'2021-06-14 07:39:40','wNA-qHjC4JPC');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`sean`@`%`*/ /*!50003 TRIGGER `send_message_notification` AFTER INSERT ON `messages` FOR EACH ROW BEGIN 

    DECLARE sender_username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

    SELECT username INTO sender_username FROM users WHERE user_id = NEW.send_user_id;

    INSERT INTO notifications (notification_id, user_id, notification_text, notification_type, notification_link) VALUES (UUID(), NEW.recieve_user_id, CONCAT(sender_username, " sent you a message!"), "message", CONCAT("/messages/", NEW.send_user_id));

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notification_text` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notification_link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notification_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('06209275-ceea-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:30:08','comment'),('0865db39-ceeb-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:37:21','comment'),('0d6e9b5a-cee8-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:16:01','comment'),('0f512c5c-ceea-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:30:23','comment'),('10826604-ced3-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 18:45:47','comment'),('1581e77a-ccde-11eb-ae5a-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','sean5 liked your post!','/posts/mx01i0603-ao','2021-06-14 06:59:38','like'),('187a265e-ceef-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 22:06:26','comment'),('264e620b-ccda-11eb-ae5a-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','sean5 accepted your friend request!','/friends/#47e6980a-6a70-42e5-93e0-3f3a978bd22e','2021-06-14 06:31:28','friend'),('27a66a97-ceef-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 22:06:52','comment'),('2bf63e64-ceea-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:31:12','comment'),('2c75cee5-cfe0-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-18 02:52:09','comment'),('34d05576-ccdf-11eb-ae5a-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','sean5 liked your comment!','/posts/6BWS1wzJKcN5','2021-06-14 07:07:40','like'),('36000c4e-cef0-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 22:14:25','comment'),('3f304d99-cef0-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 22:14:41','comment'),('49ac2a23-cef0-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 22:14:58','comment'),('54850260-cef0-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 22:15:17','comment'),('57a4ff79-ceee-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 22:01:03','comment'),('58eb81ad-cef0-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 22:15:24','comment'),('681dfa0c-cee9-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:25:43','comment'),('765d6855-ceeb-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:40:26','comment'),('7d349db6-cee9-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:26:18','comment'),('7fbc3f93-ceeb-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:40:42','comment'),('83d5ed93-cee9-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:26:29','comment'),('86f53442-ceeb-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:40:54','comment'),('89d33b5b-ceee-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 22:02:27','comment'),('9396cc7b-cee9-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:26:56','comment'),('94f52235-ceea-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:34:08','comment'),('951099ea-ceec-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:48:27','comment'),('972a396b-cee9-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:27:02','comment'),('9c459816-ceee-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 22:02:58','comment'),('9c891d56-ceea-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:34:20','comment'),('a28af031-ceea-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:34:30','comment'),('a492f4ec-cce3-11eb-ae5a-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','sean2 has sent you a friend request!','/friends/#8b76819a-5f27-4c0b-b26f-ec6c512a87f4','2021-06-14 07:39:25','friend'),('a6b90f95-ceef-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 22:10:25','comment'),('a74abefa-ceef-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 22:10:26','comment'),('a7f13e6b-ceea-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:34:40','comment'),('ad70f6fd-cce3-11eb-ae5a-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','sean5 sent you a message!','/messages/47e6980a-6a70-42e5-93e0-3f3a978bd22e','2021-06-14 07:39:40','message'),('afb3eff9-ceea-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:34:53','comment'),('b3b9c897-ceea-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:34:59','comment'),('b55e0a5a-cee7-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:13:34','comment'),('b91e38ed-cee9-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:27:59','comment'),('c97442c2-cee7-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:14:07','comment'),('d2309896-cee9-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:28:41','comment'),('da8e27e6-ceed-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:57:33','comment'),('dd4a0a75-cee7-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:14:41','comment'),('e20f6b72-cee9-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:29:08','comment'),('e867024a-cee9-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:29:18','comment'),('edf64315-cee9-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:29:27','comment'),('f699172d-cee9-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:29:42','comment'),('f964304c-cee9-11eb-835c-9848274001a0','8b76819a-5f27-4c0b-b26f-ec6c512a87f4','testuser1 left a comment on your post!','/posts/6BWS1wzJKcN5','2021-06-16 21:29:47','comment');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `post_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `num_comments` int NOT NULL DEFAULT '0',
  `num_likes` int NOT NULL DEFAULT '0',
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isGoogle` tinyint(1) NOT NULL DEFAULT '0',
  `bio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `num_posts` int NOT NULL DEFAULT '0',
  `num_comments` int NOT NULL DEFAULT '0',
  `num_correct_answers` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('3_B7GOupwxIO5MkJYOyZq','testuser2','testing2@email.com','$2b$10$KmOtdyemHyfgCYg4XYTcPeCWttfQH5IEhONP4gF3KEJQjL21rU1NG',0,NULL,0,0,0,'2021-06-16 03:53:27','2021-06-16 03:53:27'),('47e6980a-6a70-42e5-93e0-3f3a978bd22e','sean5','trumpinson@gmail.com','$2b$10$pgjLtX9OuI.P8IMmYjR5MOfLr6gqFdvieMFDTRyL9U/l6/xkngeJm',0,NULL,0,0,0,'2021-06-09 23:32:06','0000-00-00 00:00:00'),('498b358b-fff7-476f-939d-1ccff5428327','moneyman','moneyman4949yahoo@gmail.com',NULL,1,NULL,0,0,0,'2021-06-09 23:32:06','0000-00-00 00:00:00'),('4eba8c01-f130-4653-8f19-a8bad900b585','sean','test@email.com','$2b$10$LBf7f3Zqd2IVu41qIJuMu.GorrWrvaXk53LX5EDa17yawhjR0/EGi',0,NULL,0,0,0,'2021-06-09 23:32:06','0000-00-00 00:00:00'),('8b76819a-5f27-4c0b-b26f-ec6c512a87f4','sean2','test@email2.com','$2b$10$Y/TiT4xnwKHU7gk4WP9sMOCZsCJYaT4Z4zx7KCkseQ3ZMVY1GXjzW',0,NULL,0,0,0,'2021-06-09 23:32:06','0000-00-00 00:00:00'),('a00c48d3-6fd9-4e90-901a-2f8fbb23a927','sean3','test3@email.com','$2b$10$2B/Gul9XWCybbMoIrfYw4uAtlCC9EHbsoOXO/xmEwdF1AEL1Z02xC',0,NULL,0,0,0,'2021-06-09 23:32:06','0000-00-00 00:00:00'),('fd224b38-df3c-483e-9532-8e7d9e04a43e','sean4','test@email4.com','$2b$10$S7qSC1oWMuuCCSU5LIAwxOMOOdCAC/VVRM3MK6p/UCV5fCN0FAw/a',0,NULL,0,0,0,'2021-06-09 23:32:06','0000-00-00 00:00:00'),('VsSq54OWHG5w6XPssX9DE','testuser1','testing@email.com','$2b$10$/JO4Nt2xoh4txwPKJn3uIOdnvJGa6bAoUVYRqZ7q9SuaFkuvANaky',0,NULL,0,0,0,'2021-06-16 03:53:14','2021-06-16 03:53:14');
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

-- Dump completed on 2021-06-18  0:19:08
