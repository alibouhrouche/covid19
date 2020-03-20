"use strict";
function isOnline () {
  var connectionStatus = document.getElementById('nonet');

  if (navigator.onLine){
    connectionStatus.style.display = "none";
  } else {
    connectionStatus.style.display = "block";
  }
}

window.addEventListener('online', isOnline);
window.addEventListener('offline', isOnline);
isOnline();
var countries = [];
var sel = document.getElementById('country');
var list = document.getElementById('country-list');
var Data = [];
var out = {
  country : document.getElementById('country'),
  cases : document.getElementById('cases'),
  todayCases : document.getElementById('todayCases'),  
  deaths : document.getElementById('deaths'),
  todayDeaths : document.getElementById('todayDeaths'),
  recovered : document.getElementById('recovered'),
  critical : document.getElementById('critical'),
  flag : document.getElementById('flag'),
  order : document.getElementById('order')
};
function getData(next){
  fetch("/data")
  .then(
      function(response) {
      if (response.status !== 200) {
          err();
          return;
      }
      // Examine the text in the response
      response.json().then(function(data) {
          Data = data;
          countries = data.map(({ country }) => country);
          out.order.max = document.getElementById('all').innerText = data.length-1;
          autocomplete(sel, countries);
          if(typeof(next) == "function"){
            next();
          }
      });
      }
  )
  .catch(function(err) {
      err();
  });
}
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                location.hash = "#!/" + sel.value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }
out.flag.addEventListener("click", function(){
  getData(hashChange);
});
function err(){
  sel.value = '?';
  out.cases.innerText = '?';
  out.todayCases.innerText = '?';
  out.deaths.innerText = '?';
  out.todayDeaths.innerText = '?';
  out.recovered.innerText = '?';
  out.critical.innerText = '?';
  out.flag.className = "fflag ff-xl ff-wave fflag-none";
  out.flag.title = "none";
  out.order.value = "0";
  document.title = "Track Corona Virus Spread in The World";
}
function hashChange(){
  var country = decodeURI(location.hash.slice(3));
  country = (country == "") ? "All" : country;
  var i =countries.indexOf(country);
  if((country)&&(i>=0)){
    var data = Data[countries.indexOf(country)];
    sel.value = data['country'];
    out.cases.innerText = data['cases'];
    out.todayCases.innerText = data['todayCases'];
    out.deaths.innerText = data['deaths'];
    out.todayDeaths.innerText = data['todayDeaths'];
    out.recovered.innerText = data['recovered'];
    out.critical.innerText = data['critical'];
    out.flag.className = "fflag ff-xl ff-wave fflag-" + (data['code'] ? data['code']:'none');
    out.flag.title = data['code'] ? data['code']:'none';
    out.order.value = i;
    document.title = "Track Corona Virus Spread in " + (data['country'] != "All" ? data['country']: "The World");
    }else{       
      err();
    }
}
out.order.addEventListener('change', function (e){
  if (!out.order.validity.valueMissing) {
    var a = Data[out.order.value];
    if((a)&&(a['country']))
    location.hash = "#!/" + a['country'];
  }
});
window.addEventListener('hashchange', function (e) {
    e.preventDefault();
    hashChange();
});
getData(hashChange);