-- JOIN table for foods and users
CREATE TABLE diet.food_eaten (
    `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `food_id` INT UNSIGNED NOT NULL,

    `eaten_at` DATETIME NOT NULL, -- YYYY-MM-DD

    `created_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`food_id`) REFERENCES `food`(`food_id`) ON DELETE CASCADE,
    PRIMARY KEY(`id`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=COMPRESSED;







-- SELECT
--     CONSTRAINT_NAME,
--     TABLE_NAME,
--     COLUMN_NAME,
--     REFERENCED_TABLE_NAME,
--     REFERENCED_COLUMN_NAME
-- FROM
--     INFORMATION_SCHEMA.KEY_COLUMN_USAGE
-- WHERE
--     TABLE_SCHEMA = 'diet'
--     AND TABLE_NAME = 'food_eaten'
--     AND REFERENCED_TABLE_NAME IS NOT NULL;
