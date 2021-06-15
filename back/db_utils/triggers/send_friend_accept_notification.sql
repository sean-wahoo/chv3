DELIMITER $ CREATE TRIGGER send_friend_accept_notification
AFTER
UPDATE
  ON friends FOR EACH ROW BEGIN DECLARE accepter_username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
IF OLD.status = "pending"
  AND NEW.status = "accepted" THEN
SELECT
  username INTO accepter_username
FROM
  users
WHERE
  user_id = NEW.recieve_user_id;
INSERT INTO
  notifications (
    notification_id,
    user_id,
    notification_text,
    notification_type,
    notification_link
  )
VALUES(
    UUID(),
    NEW.send_user_id,
    CONCAT(
      accepter_username,
      " accepted your friend request!"
    ),
    'friend',
    CONCAT("/friends/#", NEW.recieve_user_id)
  );
END IF;
END $