DROP TABLE IF EXISTS logs;
CREATE TABLE logs(
    id SERIAL PRIMARY KEY,
    day VARCHAR(100),
    temp INT,
    weather VARCHAR(50),
    is_deleted INT DEFAULT 0
);