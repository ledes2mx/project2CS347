DROP DATABASE IF EXISTS weather_log;
DROP USER IF EXISTS weather_log_user@localhost;

CREATE DATABASE weather_log CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER weather_log_user@localhost IDENTIFIED WITH mysql_native_password BY 'Ledesma235';
GRANT ALL PRIVILEGES ON weather_log.* TO weather_log_user@localhost;