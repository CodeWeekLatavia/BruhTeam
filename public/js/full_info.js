let params = new URL(document.location).searchParams;
let postid = params.get("postid");

function load_post_info() {
  fetch("/post_full_info/?postid=" + postid)
    .then((res) => res.json())
    .then((data) => {
      if ("success" in data) alert("You must be loggedin to view job details");
      else rander_info(data);
    });
}

function rander_info(data) {
  document.getElementById("main-desc-img").src =
    "../img/posts/main/" + data.Img + ".jpg";
  document.getElementById("main-heading").textContent = data.Heading;
  document.getElementById("main-desc").textContent = data.Desc;
  document.getElementById("main-salary").textContent = data.Price;
  document.getElementById("main-diff").textContent = data.Difficulty;

  var base_node = document.getElementById("interest-container");

  data.interests.forEach((el) => {
    var cur_interes_el = document.createElement("img");
    cur_interes_el.className = "interest";
    cur_interes_el.src = "../img/Interests/" + el + ".svg";
    base_node.appendChild(cur_interes_el);
  });
}

function submit_for_job() {}
