const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cookieParser = require("cookie-parser");
const af = require("./modules/functions.js");
const fs = require("fs");
const e = require("express");

const POST_RESP_AMOUNT = 10;

var current_last_usr = 0;
var valid_languages = ["English", "Russian", "Latvian"];

let db = new sqlite3.Database("./db/MAIN.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the chinook database.");
  db.all("SELECT MAX(UID) FROM LOGIN_USERS", [], (err, rows) => {
    if (err) throw err;
    current_last_usr = rows[0]["MAX(UID)"] + 1;
  });
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

app.get("/post_full_info", (req, res) => {
  check_if_logged_in(req, res, (req, res, uid) => {
    var post_info_sql = `SELECT * FROM POSTS_MAIN WHERE UrlID="${req.query.postid}"`;
    var resp_obj = {};
    db.all(post_info_sql, [], (err, rows) => {
      if (err) throw err;
      resp_obj = rows[0];
      resp_obj["interests"] = [];
      var post_interests_sql = `SELECT * FROM POSTS_INTERESTS WHERE UPID=${uid}`;
      db.all(post_interests_sql, [], (err, rows) => {
        if (err) throw err;

        rows.forEach((el) => {
          resp_obj.interests.push(el.Interest);
        });

        res.json(resp_obj);
      });
    });
  });
});

app.get("/full_inf", (req, res) => {
  res.sendFile("/full_inf.html", { root: "views" });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/login", (req, res) => {
  res.sendFile("login.html", { root: "views" });
});

app.get("/register", (req, res) => {
  res.sendFile("register.html", { root: "views" });
});

app.get("/loggedin", (req, res) => {
  check_if_logged_in(req, res, loggedin_callback);
});

app.post("/get_posts", (req, res) => {
  const body = req.body;
  if ("old_time" in body) {
    var req_sql = `SELECT POSTS_PREV.UPID, POSTS_PREV.Desc, POSTS_PREV.Img, POSTS_MAIN.Time, POSTS_MAIN.UrlID, POSTS_MAIN.Heading, POSTS_MAIN.Price, POSTS_MAIN.Difficulty FROM POSTS_PREV INNER JOIN POSTS_MAIN ON POSTS_PREV.UPID=POSTS_MAIN.UPID ORDER BY POSTS_MAIN.Time DESC;`;

    db.all(req_sql, [], (err, rows) => {
      if (err) throw err;
      compile_posts_resp(rows, body.old_time, res);
    });
  } else {
    res.status("404").json({ success: false, reason: "Invalid Time!" });
  }
});

app.get("/postinf/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(req.query));
});

app.post("/submit_login", (req, res) => {
  const body = req.body;
  let log_sql = `SELECT * FROM LOGIN_USERS WHERE (UserName="${body.name}" OR Email="${body.name}") AND PSWD="${body.password}"`; // get all users with following name/password

  res.setHeader("Content-Type", "application/json");

  db.all(log_sql, [], (err, rows) => {
    if (err) throw err;

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

app.post("/submit_register", function (req, res) {
  const body = req.body;

  if (!af.validateEmail(body.email)) {
    res.json({ success: false, reason: "Invalid email!" });
    return;
  }

  var us_bd_check = `SELECT * FROM LOGIN_USERS WHERE UserName="${body.username}" OR Email="${body.email}"`; // check if name or email exists in db

  db.all(us_bd_check, [], (err, rows) => {
    if (rows.length != 0) {
      res.json({
        success: false,
        reason: "User with following email or username allredy exists",
      });
      return;
    }

    var cur_uid = current_last_usr++;

    var add_log_sql = `INSERT INTO LOGIN_USERS VALUES (${cur_uid}, "${body.username}", "${body.email}", "${body.password}");`; // add user to db
    var add_usr_sql = `INSERT INTO USERS_DATA VALUES (${cur_uid}, "${body.name}", "${body.surname}", "${body.location}");`; // add user to db

    db.all(add_log_sql);
    db.all(add_usr_sql);

    for (var i in body.languages)
      if (valid_languages.includes(body.languages[i]))
        db.all(
          `INSERT INTO USER_LANGUAGES VALUES (${cur_uid}, "${body.languages[i]}");` // add langueages
        );

    res.json({ success: true });
  });
});

function loggedin_callback(req, res, uid) {
  var get_name_sql = `SELECT * FROM USERS_DATA WHERE UID=${uid}`;
  db.all(get_name_sql, [], (err, rows) => {
    if (err) throw err;

    res.json({
      success: true,
      loggedin: true,
      name: rows[0].Name,
      surname: rows[0].SurName,
    });
  });
}

function check_if_logged_in(req, res, callback) {
  if ("bruhWorkrememberLogin" in req.cookies) {
    var check_log_sql = `SELECT * FROM ACTIVE_SESSIONS WHERE Key='${req.cookies.bruhWorkrememberLogin}'`;
    db.all(check_log_sql, [], (err, rows) => {
      if (err) throw err;

      if (rows.length == 0) res.json({ success: true, loggedin: false });
      else callback(req, res, rows[0].UID);
    });
  } else res.json({ success: true, loggedin: false });
}

async function compile_posts_resp(rows, old_time, res) {
  // function to create response object for posts redering
  var ret_obj = {};

  var l = 0,
    r = rows.length - 1;
  var c = Math.floor((r - l) / 2);
  while (l < r) {
    if (rows[c].Time < old_time) r = c;
    else l = c;
    c = l + Math.floor((r - l) / 2);
  }
  var cur_obj = {};
  var response_now =
    l + POST_RESP_AMOUNT > rows.length ? rows.length - l : POST_RESP_AMOUNT;
  for (
    var i = l;
    i <
    (l + POST_RESP_AMOUNT > rows.length ? rows.length : l + POST_RESP_AMOUNT);
    i++
  ) {
    var cur_obj = {
      interests: [],
      desc: rows[i].Desc,
      img: rows[i].Img,
      time: rows[i].Time,
      price: rows[i].Price,
      diff: rows[i].Difficulty,
      heading: rows[i].Heading,
      url: rows[i].UrlID,
    };
    ret_obj[rows[i].UPID] = cur_obj;
    var interests_sql = `SELECT * FROM POSTS_INTERESTS WHERE UPID=${rows[i].UPID}`;

    db.all(interests_sql, [], (err, rows) => {
      if (err) throw err;

      rows.forEach((row) => {
        ret_obj[row.UPID].interests.push(row.Interest);
      });
      response_now--;

      if (response_now == 0)
        // Means all promises fired, response to user
        res.json(ret_obj);
    });
  }
}
