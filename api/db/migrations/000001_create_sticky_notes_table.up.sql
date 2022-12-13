CREATE TABLE IF NOT EXISTS sticky_notes(
    `id` varchar(50) NOT NULL PRIMARY KEY,
    `uid` varchar(50) NOT NULL,
    `value` text NOT NULL,
    `x` int NOT NULL,
    `y` int NOT NULL,
    `width` varchar(10) NOT NULL,
    `height` varchar(10) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8;