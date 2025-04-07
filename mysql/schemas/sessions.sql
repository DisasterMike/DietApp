CREATE TABLE diet.sessions (
    `user_id` INT NOT NULL,
    `token` VARCHAR(128) NOT NULL,

    `expires_at` DATETIME,
    `created_at` datetime DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`user_id`, `token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=COMPRESSED;