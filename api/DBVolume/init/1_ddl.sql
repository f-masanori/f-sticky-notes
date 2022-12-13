CREATE DATABASE IF NOT EXISTS sticky_notes;
CREATE TABLE IF NOT EXISTS sticky_notes.sticky_notes(
  `id` varchar NOT NULL,
  `value` varchar NOT NULL,
  `int` varchar NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;