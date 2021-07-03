REST API Service for Node JS (Express js) with MySQL
===========

## Install
* Download repository https://github.com/Paklosha/express-api.git
* Run `npm install` - install node dependencies
* Create MySQL Database
* Run following sql requests to create tables (file in db directory)
~~~~ sql
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

~~~~
* open .env file and set configurations:
    * HOST=localhost
    * DB_USER=paklosha
    * DB_PASS=password
    * DB_DATABASE=test_dbs
    * TOKEN_LIFE=600000
    * REFRESH_TOKEN_LIFE=3600000
    * PORT=3000
    * SECRET_JWT=supersecret
    * SECRET_REFRESH_JWT=hypersecret
* run `npm run start` - run application

I use Postman (https://www.postman.com) software to test API

## Задача:
Сделать сервис с REST API. 
*	Авторизация по bearer токену (/info, /latency, /logout, /file(все роуты) );
*	Настроить CORS для доступа с любого домена;
*	DB – Mysql;
*	Токен создавать при каждом заходе, действителен 10 минут. Продлевать при любом запросе пользователя (кроме signin) с помощью refresh токена;
*	Реализовать на основе фреймворка express js;
*   API:
    * /signin [POST] - запрос bearer токена по id и паролю;
    * /signin/new_token [POST]  - обновление bearer токены по refresh токену
    * /signup [POST] - регистрация нового пользователя;
    * Поля id и password, id - номер телефона или email;
    * /file/upload [POST] - добавление нового файла в систему и запись параметров файла в базу (название, расширение, MIME type, размер, дата загрузки
    * /file/list [GET]  выводит список файлов и их параметров из базы с использованием пагинации с размером страницы, указанного в передаваемом параметре list_size, по умолчанию 10 записей на страницу, если параметр пустой. Номер страницы указан в параметре page, по умолчанию 1, если не задан. 
    * /file/delete/:id [DELETE] - удаляет документ из базы и локального хранилища
    * /file/:id [GET] - вывод информации о выбранном файле. 
    * /file/download/:id [GET] - скачивание конкретного файла. 
    * /file/update/:id [PUT] - обновление текущего документа на новый в базе и локальном хранилище
*	При удачной регистрации вернуть пару  bearer токен и refresh токен;
    * /info [GET] - возвращает id пользователя 
    * /logout [GET] - выйти из системы;
*	После выхода необходимо получить новый токен;
*	Старый должен перестать работать;

## API Reference
* /signin [POST] - выдает Access и Refresh токены в ответ на email и пароль зарегистрированного пользователя
    * принимает в теле запроса:
        * user - email пользователя
        * password - пароль пользователя
    * отдает:
        * access_token
        * refresh_token
* /signin/new_token [POST] - выдает новый Access токен в ответ на Refresh токен
    * принимает в теле запроса:
        * refresh_token
    * выдает:
        * новый access_token
* /signup [POST] - выдает Access и Refresh токены в ответ на email и пароль нового пользователя
    * принимает в теле запроса:
        * user - email пользователя
        * password - пароль пользователя
    * отдает:
        * access_token
        * refresh_token
* /info [GET] - возвращает id пользователя, если пользователь авторизован
    * принимает в заголовках
        * Authorization - Bearer vjaOCvRBOnqPAIwB37p3go1osICXrv1EyOSRHqVowG0= (Bearer токен)
    * отдает
        * userId
* /logout [GET] - заносит токен пользователя в blacklist. С ним уже авторизоваться нельзя
    * принимает в заголовках Bearer токен, выданный при signin или signup
            * Authorization - Bearer vjaOCvRBOnqPAIwB37p3go1osICXrv1EyOSRHqVowG0= (Bearer токен)
* /file/upload [POST] - загружает новый файл в систему
    * принимает в files запроса:
        * file
    * принимает в заголовках Bearer токен, выданный при signin или signup
            * Authorization - Bearer vjaOCvRBOnqPAIwB37p3go1osICXrv1EyOSRHqVowG0= (Bearer токен)
* /file/delete/:id [DELETE] - удаляет файл с заданным id
    * принимает в заголовках Bearer токен, выданный при signin или signup
        * Authorization - Bearer vjaOCvRBOnqPAIwB37p3go1osICXrv1EyOSRHqVowG0= (Bearer токен)
* /file/:id [GET] - вывод информации о выбранном файле. 
    * принимает в заголовках Bearer токен, выданный при signin или signup
                * Authorization - Bearer vjaOCvRBOnqPAIwB37p3go1osICXrv1EyOSRHqVowG0= (Bearer токен)
    * отдает информацию о файле:
        * mime-type
        * ext
        * filename
        * uploadedTimestamp
* /file/update/:id [PUT] - обновление текущего документа на новый в базе и локальном хранилище
    * принимает в files запроса:
        * file
    * принимает в заголовках Bearer токен, выданный при signin или signup
        * Authorization - Bearer vjaOCvRBOnqPAIwB37p3go1osICXrv1EyOSRHqVowG0= (Bearer токен)
* /file/download/:id [GET] - скачивание конкретного файла. 
    * принимает в заголовках Bearer токен, выданный при signin или signup
        * Authorization - Bearer vjaOCvRBOnqPAIwB37p3go1osICXrv1EyOSRHqVowG0= (Bearer токен)
    * отдает - файл
* /file/list [GET]  выводит список файлов и их параметров из базы с использованием пагинации с размером страницы, указанного в передаваемом параметре list_size, по умолчанию 10 записей на страницу, если параметр пустой. Номер страницы указан в параметре page, по умолчанию 1, если не задан.
    * принимает в теле запроса:
        * list_size - количество записей в выдаче. По умолчанию 10
        * page - номер страницы выдачи. По умолчанию 1
    * принимает в заголовках Bearer токен, выданный при signin или signup
        * Authorization - Bearer vjaOCvRBOnqPAIwB37p3go1osICXrv1EyOSRHqVowG0= (Bearer токен)
    * отдает
        * files - массив со списком файлов 
