const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cookieParser = require("cookie-parser");
const af = require("./modules/functions.js");
const fs = require("fs");

let db = new sqlite3.Database("./db/MAIN.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the chinook database.");
});

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("/main.html", { root: "views" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "views" });
});

app.get("/postinf/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(req.query));
});

app.post("/submit_login", function (req, res) {
  const body = req.body;
  let log_sql = `SELECT * FROM LOGIN_USERS WHERE (UserName="${body.name}" OR Email="${body.name}") AND PSWD="${body.password}"`; // get all users with following name/password

  res.setHeader("Content-Type", "application/json");

  db.all(log_sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    if (rows.length > 0) {
      var usr = rows[0];
      let cur_key = af.generateUID(15);
      let del_existing = `DELETE FROM ACTIVE_SESSIONS WHERE UID="${usr.UID}"`; // remove all sessions with this UID before adding new one
      let add_session_sql = `INSERT INTO ACTIVE_SESSIONS VALUES (${usr.UID}, "${cur_key}")`; // add session to db
      db.all(del_existing);
      db.all(add_session_sql);

      res.cookie("bruhWorkrememberLogin", cur_key, {
        maxAge: 900000,
        httpOnly: true,
      });

      res.json({ success: true });
    } else
      res.json({
        success: false,
        reason: "No users with this credentials",
      });
  });
});
