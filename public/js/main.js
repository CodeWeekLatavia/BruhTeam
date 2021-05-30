var post_el =
  '<div class="product-hidden-please-parseme">            <img src="work.jpg" />            <div class="product-info">              <h3 class="product-name"></h3>              <div class="description-holder">                <span clas="decription"></span>                <h4 class="product-price"></h4>                <h4 class="product-offer"></h4>              </div>              <div class="product-interest">                <span>Intereses loki: </span>          </div>            </div>          </div>';

var oldest_time = 99999999999999;

function load_cred() {
  fetch("/loggedin")
    .then((res) => res.json())
    .then((data) => {
      if (data.success && !data.loggedin) {
        els = document.getElementsByClassName("floating-button-hidden");
        while (els.length) {
          els[0].className = "floating-button";
        }
      } else {
        el = document.getElementsByClassName("floating-span-hidden")[0];
        el.className = "floating-button";
        el.textContent = data.name + " " + data.surname;
      }
    });
}

function laods_posts() {
  fetch("/get_posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ old_time: oldest_time }),
  })
    .then((res) => res.json())
    .then((data) => parse_resp(data));
}

function parse_resp(resp) {
  if ("success" in resp) {
    alert(resp.reason);
    return;
  }

  for (var k in resp) {
    document
      .getElementById("posts-container")
      .insertAdjacentHTML("beforeend", post_el);
    oldest_time = Math.min(resp.time, oldest_time);
    render_post(
      document.getElementsByClassName("product-hidden-please-parseme")[0],
      resp[k]
    );
  }
}

function render_post(el, data) {
  els = el.childNodes;
  els[1].src = "img/posts/preview/" + data.img + ".jpg";
  var info_node = els[3].childNodes;
  info_node[1].textContent = data.heading;
  var desc_node = info_node[3].childNodes;
  desc_node[1].textContent = data.desc;
  desc_node[3].textContent = data.price;
  desc_node[5].textContent = data.diff;

  var interests_node = info_node[5];

  data.interests.forEach((el) => {
    var cur_interes_el = document.createElement("img");
    cur_interes_el.className = "interest";
    cur_interes_el.src = "img/Interests/" + el + ".svg";
    interests_node.appendChild(cur_interes_el);
  });

  el.onclick = function () {
    on_post_click(this);
  };
  el.post_url = data.url;
  el.className = "product";
}

function on_post_click(el) {
  fetch("/loggedin")
    .then((res) => res.json())
    .then((data) => {
      if (data.success && data.loggedin) {
        window.location.replace("/full_inf/?postid=" + el.post_url);
      } else {
        alert("You must be loggedin to view detailed job info");
      }
    });
}
