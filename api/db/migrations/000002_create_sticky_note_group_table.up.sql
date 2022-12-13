CREATE TABLE IF NOT EXISTS sticky_note_groups(
    `id` varchar(50) NOT NULL PRIMARY KEY,
    `group_id` varchar(50) NOT NULL DEFAULT "",
    `uid` varchar(50) NOT NULL,
    `label` varchar(50) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8;