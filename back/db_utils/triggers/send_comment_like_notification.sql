DELIMITER $ CREATE TRIGGER send_like_notifications
AFTER
INSERT
  ON likes FOR EACH ROW BEGIN DECLARE post_author_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DECLARE post_author_username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DECLARE comment_author_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DECLARE comment_author_username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DECLARE comment_post_id VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DECLARE liker_username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
IF ISNULL(NEW.comment_id) THEN -- if a post was liked
SELECT
  users.user_id INTO post_author_id
FROM
  users
  INNER JOIN posts ON posts.user_id = users.user_id
WHERE
  posts.post_id = NEW.post_id;
SELECT
  username INTO liker_username
FROM
  users
WHERE
  user_id = NEW.user_id;
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
    post_author_id,
    CONCAT(liker_username, " liked your post!"),
    "like",
    CONCAT("/posts/", NEW.post_id)
  );
  ELSE
SELECT
  posts.user_id,
  posts.post_id INTO comment_author_id,
  comment_post_id
FROM
  posts
  INNER JOIN comments ON comments.post_id = posts.post_id
WHERE
  comments.comment_id = NEW.comment_id;
SELECT
  username INTO liker_username
FROM
  users
WHERE
  user_id = NEW.user_id;
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
    comment_author_id,
    CONCAT(liker_username, " liked your comment!"),
    "like",
    CONCAT("/posts/", comment_post_id)
  );
END IF;
END $