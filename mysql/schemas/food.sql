CREATE TABLE diet.food (
    `food_id` INT UNSIGNED AUTO_INCREMENT NOT NULL,
    `name` varchar(200) NOT NULL,
    `calories` INT UNSIGNED NOT NULL,

    `created_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY(`food_id`),
    UNIQUE KEY(`name`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=COMPRESSED;