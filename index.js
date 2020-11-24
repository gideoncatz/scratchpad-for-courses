const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 3010;

let db = new sqlite3.Database("./my-company.db", (err) => {
  if (err) {
    console.error(err.message);
  }

  db.run(
    `CREATE TABLE IF NOT EXISTS users (
    user_id varchar(20) PRIMARY KEY,
       user_secret varchar(30)
  );`,
    (result, err) => {
      if (err) {
        console.log("Error: ", err);
      } else {
        console.log("Table creation result: ", result);
      }
    }
  );

  console.log("Connected to the company database.");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users/create/:userId", (req, res) => {
  // console.log(req.params.userId);
  const userSecret = Math.random() * 1000;
  db.run(
    `INSERT INTO users (user_id, user_secret) VALUES ('${req.params.userId}', '${userSecret}');`,
    (result, err) => {
      if (err) {
        console.log("Insertion error: ", err);
        res.send("Error");
      } else {
        console.log("Insertion result: ", result);
        res.send("Registered " + req.params.userId);
      }
    }
  );

  // TODO: Send secret as cookie to client
});

app.get("/users", (req, res) => {
  // console.log(req.params.userId);
  db.all("SELECT * FROM users;", [], (err, rows) => {
    if (err) {
      console.log("Querying error: ", err);
    } else {
      const allUsersHtml = rows.map((row) => `<li>${row.user_id}</li>`);
      res.send("<ul>" + allUsersHtml + "</ul>");
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
