DELIMITER $ CREATE TRIGGER send_friend_request_notification
AFTER
INSERT
  ON friends FOR EACH ROW BEGIN DECLARE sender_username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
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
END $