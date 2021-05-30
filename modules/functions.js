module.exports = {
  generateUID,
  validateEmail,
};

function generateUID(length) {
  var ret_val = "";
  for (var i = 0; i < length; i++)
    ret_val += String.fromCharCode(48 + Math.floor(Math.random() * 74));
  return ret_val;
}

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// var sql_calls = {
//   active_sessions: {
//     del_ex: "DELETE FROM ACTIVE_SESSIONS WHERE UID = '$uid'",
//     add_ses: "INSERT INTO ACTIVE_SESSIONS VALUES ($UID, '$key')",
//   },
//   job_posts: {},
//   login_users: {
//     check_log:
//       "SELECT * FROM LOGIN_USERS WHERE (UserName='$name' OR Email='$name') AND PSWD='$password'",
//     check_ex:
//       "SELECT * FROM LOGIN_USERS WHERE UserName = '$username' OR Email = '$email'",
//     add_new:
//       "INSERT INTO LOGIN_USERS VALUES ($cur_uid, '$username', '$email', '$password');",
//   },
//   users_data: {
//     add_new:
//       "INSERT INTO USERS_DATA VALUES ($cur_uid, '$name', '$surname', '$location');",
//   },
//   users_interests: {},
//   users_languages: {
//     add_new: "INSERT INTO USERS_LANGUEAGES VALUES ($cur_uid, '$languages');",
//   },
// };
