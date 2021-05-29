const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

let db = new sqlite3.Database("./db/MAIN.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the chinook database.");
});

const app = express();
const port = 3000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("/main.html", { root: "views" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/submit_login", function (req, res) {
  res.send("POST request to the homepage");
});

app.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "views" });
});

app.get("/postinf/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(req.query));
});
