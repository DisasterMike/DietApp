CREATE TABLE data.user (
    'username' VARCHAR(45) NOT NULL,
    'email' TEXT NOT NULL,
    'password' TEXT NOT NULL,
    'first_name' VARCHAR(45) DEFAULT NULL,
    'last_name' VARCHAR(45) DEFAULT NULL,
    'dob' DATE DEFAULT NULL,
    'gender' VARCHAR(45) DEFAULT NULL, -- INT?
    'weight' VARCHAR(45) DEFAULT NULL,
    'height' VARCHAR(45) DEFAULT NULL,
    'activiy_level' INT DEFAULT NULL,

    `created_datetime` datetime DEFAULT CURRENT_TIMESTAMP,
	`updated_datetime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY(username, email)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=COMPRESSED

-- activity_level:
-- 0 - Sedentary	            1.2	Office worker, little/no exercise
-- 1 - Lightly Active	        1.375	Light exercise (1-3 days/week)
-- 2 - Moderately Active	    1.55	Moderate exercise (3-5 days/week)
-- 3 - Very Active	            1.725	Hard exercise (6-7 days/week)
-- 4 - Super Active	            1.9	Athletes, physical labor jobs
    -- or just store the amount????