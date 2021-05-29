const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;

const send_amount = 150;

app.get("/", (req, res) => {
  res.sendFile("/main.html", { root: "views" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/public/js/index.js", (req, res) => {
  res.sendFile("/js/index.js", { root: "public" });
});

app.get("/public/css/main.css", (req, res) => {
  res.sendFile("/css/main.css", { root: "public" });
});
