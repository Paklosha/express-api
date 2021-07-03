DROP DATABASE IF EXISTS test_dbs;   
CREATE DATABASE IF NOT EXISTS test_dbs;   
USE test_dbs; 

DROP TABLE IF EXISTS user; 
DROP TABLE IF EXISTS blacklist; 
DROP TABLE IF EXISTS file; 

CREATE TABLE IF NOT EXISTS user 
  ( 
     id         VARCHAR(50) NOT NULL, 
     password   CHAR(60) NOT NULL
  ); 

  CREATE TABLE IF NOT EXISTS blacklist 
  ( 
     id         VARCHAR(50) NOT NULL, 
     token   CHAR(200) NOT NULL
  ); 

    CREATE TABLE IF NOT EXISTS file 
  ( 
      id          int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name        varchar(255) NOT NULL,
      extension   varchar(255) NOT NULL,
      type        varchar(100) NOT NULL,
      size        int(11) NOT NULL,
      updated_at  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
  ); 