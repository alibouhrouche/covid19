"use strict";
var version = "v1::00002::";
function isOnline() {
  var connectionStatus = document.getElementById("nonet");

  if (navigator.onLine) {
    connectionStatus.style.display = "none";
  } else {
    connectionStatus.style.display = "block";
  }
}
window.addEventListener("online", isOnline);
window.addEventListener("offline", isOnline);
isOnline();
var countries = [];
var sel = document.getElementById("country");
var list = document.getElementById("country-list");
var Data = [];
var out = {
  country: document.getElementById("country"),
  cases: document.getElementById("cases"),
  todayCases: document.getElementById("todayCases"),
  deaths: document.getElementById("deaths"),
  todayDeaths: document.getElementById("todayDeaths"),
  recovered: document.getElementById("recovered"),
  critical: document.getElementById("critical"),
  flag: document.getElementById("flag"),
  order: document.getElementById("order"),
  refreshbtn: document.getElementById("refreshbtn")
};
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(update)
    .catch(update);
  /*navigator.serviceWorker.onmessage = function (evt) {
    if(evt.data.fn){
      if(evt.data.fn == "data-update"){
        Data = evt.data.data;
        hashChange();
      }
  }
  }*/
} else {
  update();
}
async function update() {
  const networkPromise = fetch("/data");
  if ("caches" in window) {
    const cachedResponse = await caches.match("/data");
    if (cachedResponse) await displayUpdate(cachedResponse);
  }
  try {
    const networkResponse = await networkPromise;
    if ("caches" in window) {
      const cache = await caches.open(version + "sarscov2-data");
      cache.put("/data", networkResponse.clone());
    }
    await displayUpdate(networkResponse);
  } catch (er) {
    err();
  }
  //const networkResponse = await networkPromise;
}

async function displayUpdate(response) {
  Data = await response.json();
  countries = Data.map(({ country }) => country);
  out.order.max = document.getElementById("all").innerText = Data.length - 1;
  autocomplete(sel, countries);
  hashChange();
}
function refresh(){
  update().then(function(){
    document.body.className = '';
  });
}
out.refreshbtn.addEventListener("click", function() {
  document.body.className = 'refreshing';
  refresh();
});
let _startY;
document.body.addEventListener('touchstart', e => {
  _startY = e.touches[0].pageY;
}, {passive: true});

document.body.addEventListener('touchmove', e => {
  const y = e.touches[0].pageY;
  // Activate custom pull-to-refresh effects when at the top of the container
  // and user is scrolling up.

  if (document.scrollingElement.scrollTop === 0 && y > _startY &&
      !document.body.classList.contains('refreshing')) {
      document.body.className = 'refreshing';
      refresh();
  }
}, {passive: true});
function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
    var a,
      b,
      i,
      val = this.value;
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", function(e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          location.hash = "#!/" + sel.value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}
out.flag.addEventListener("click", function() {
  update();
});
function err() {
  sel.value = "?";
  out.cases.innerText = "?";
  out.todayCases.innerText = "?";
  out.deaths.innerText = "?";
  out.todayDeaths.innerText = "?";
  out.recovered.innerText = "?";
  out.critical.innerText = "?";
  out.flag.className = "fflag ff-xl ff-wave fflag-none";
  out.flag.title = "none";
  out.order.value = "0";
  document.title = "Track Corona Virus Spread in The World";
}
function hashChange() {
  var country = decodeURI(location.hash.slice(3));
  country = country == "" ? "All" : country;
  var i = countries.indexOf(country);
  if (country && i >= 0) {
    var data = Data[countries.indexOf(country)];
    sel.value = data["country"];
    out.cases.innerText = data["cases"];
    out.todayCases.innerText = data["todayCases"];
    out.deaths.innerText = data["deaths"];
    out.todayDeaths.innerText = data["todayDeaths"];
    out.recovered.innerText = data["recovered"];
    out.critical.innerText = data["critical"];
    out.flag.className =
      "fflag ff-xl ff-wave fflag-" + (data["code"] ? data["code"] : "none");
    out.flag.title = data["country"] != "All" ? data["country"] : "The World";
    out.order.value = i;
    document.title =
      "Track Corona Virus Spread in " +
      (data["country"] != "All" ? data["country"] : "The World");
  } else {
    err();
  }
}
out.order.addEventListener("change", function(e) {
  if (!out.order.validity.valueMissing) {
    var a = Data[out.order.value];
    if (a && a["country"]) location.hash = "#!/" + a["country"];
  }
});
window.addEventListener("hashchange", function(e) {
  e.preventDefault();
  hashChange();
});
