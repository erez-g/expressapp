
# Song CRUD Interface

Learning to use Node, Express, Sequelize, and React hooks


## Project management

- [TODOs Kanban(Airtable)](https://airtable.com/shrJfd4PVABGeYG2d/tbl1ykzEoqysY8oHv)


## Run Locally

Go to the project directory

```bash
  cd express-app
```

Install dependencies

```bash
  npm install
```


Start a docker container for the MySQL service:
```bash
docker run --rm --name mysql -p 3306:3306 -e MYSQL_USER=user -e MYSQL_ROOT_PASSWORD=pw -e MYSQL_PASSWORD=dev -e MYSQL_DATABASE=db -d 
mysql:latest
```

Start MySQL\*:
```bash
 docker exec -it mysql mysql -u root -p
```
\*may throw permissions error for root@localhost, if so start mysql via 'bash' first

--- 

(Manually ATM) upload dummy data from CSV files via MySQL client under /csv/

---

Start the server (uses nodemon)

```bash
 npm run server
```

Start the client 
```bash
 cd client
 npm start
```