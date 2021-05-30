function sumbmit_login() {
  fetch("/submit_login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("username").value,
      password: document.getElementById("password").value,
    }),
  })
    .then((res) => res.json())
    .then((data) => login_response(data));
}

function login_response(resp) {
  if (resp.success) window.location.replace("/");
  else alert(resp.reason);
}

// var sql_calls = {
//   active_sessions: {
//     del_ex: "DELETE FROM ACTIVE_SESSIONS WHERE UID = '$UID'",
//     add_ses: "INSERT INTO ACTIVE_SESSIONS VALUES ($UID, '$key')",
//   },
//   job_posts: {},
//   login_users: {
//     check_log:
//       "SELECT * FROM LOGIN_USERS WHERE (UserName='?' OR Email='?') AND PSWD='?'",
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
