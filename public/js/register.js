function submit_register() {
  var reg_obj = {};
  var fields_to_check = [
    "username",
    "name",
    "surname",
    "age",
    "email",
    "password",
  ];
  for (var field in fields_to_check) {
    var cur_key = fields_to_check[field];
    reg_obj[cur_key] = document.getElementById(cur_key).value;
    if (!reg_obj[cur_key]) {
      console.log("Please fill all fields!");
      return;
    }
  }

  if (5 > reg_obj.age > 100) {
    console.log("Please eneter your real age");
    return;
  }

  if (document.getElementById("male").checked) reg_obj["gender"] = "male";
  else if (document.getElementById("female").checked)
    reg_obj["gender"] = "female";
  else reg_obj["gender"] = "None";

  reg_obj["languages"] = [];
  document.getElementsByName("lang").forEach((el) => {
    if (el.checked) reg_obj["languages"].push(el.id);
  });

  fetch("/submit_register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reg_obj),
  })
    .then((res) => res.json())
    .then((data) => login_response(data));
}

function login_response(resp) {
  if (resp.success) window.location.replace("/login");
  else alert(resp.reason);
}
