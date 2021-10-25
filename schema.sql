DROP TABLE IF EXISTS logs;
CREATE TABLE logs(
    id SERIAL PRIMARY KEY,
    day INT,
    month VARCHAR(9),
    year INT,
    temp INT,
    weather TEXT,
    is_deleted INT DEFAULT 0
);