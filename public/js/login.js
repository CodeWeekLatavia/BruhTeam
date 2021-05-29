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
  else console.log(resp.reason);
}
