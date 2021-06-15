DELIMITER $ CREATE TRIGGER send_comment_notification
AFTER
INSERT
  ON comments FOR EACH ROW BEGIN DECLARE replied_to_user_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DECLARE reply_author_username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DECLARE commented_on_user_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DECLARE post_author_user_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DECLARE comment_author_username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
IF NEW.is_reply = true THEN -- GET USER_ID OF USER WHO WAS REPLIED TO
SELECT
  user_id INTO replied_to_user_id
FROM
  comments
WHERE
  comment_id = NEW.reply_id COLLATE utf8mb4_unicode_ci;
SELECT
  username INTO reply_author_username
FROM
  users
WHERE
  user_id = NEW.user_id COLLATE utf8mb4_unicode_ci;
IF NEW.user_id <> replied_to_user_id THEN
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
    replied_to_user_id,
    CONCAT(
      reply_author_username,
      " left a reply to your comment!"
    ),
    "reply",
    CONCAT("/posts/", NEW.post_id)
  );
END IF;
END IF;
IF NEW.is_reply = false THEN
SELECT
  posts.user_id INTO post_author_user_id
FROM
  posts
  INNER JOIN comments ON comments.post_id = posts.post_id
WHERE
  comments.comment_id = NEW.comment_id COLLATE utf8mb4_unicode_ci;
SELECT
  user_id INTO commented_on_user_id
FROM
  posts
WHERE
  post_id = NEW.post_id;
SELECT
  username INTO comment_author_username
FROM
  users
WHERE
  user_id = NEW.user_id COLLATE utf8mb4_unicode_ci;
IF NEW.user_id <> commented_on_user_id THEN
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
    commented_on_user_id,
    CONCAT(
      comment_author_username,
      " left a comment on your post!"
    ),
    "comment",
    CONCAT("/posts/", NEW.post_id)
  );
END IF;
END IF;
END $