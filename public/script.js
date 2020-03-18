var countries = [];
var sel = document.getElementById('country');
var list = document.getElementById('country-list');
var flag = document.getElementById('flag');
var errimg = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
var Data = [];
var allData = {
  "country": "All",
  "cases": 0,
  "todayCases": 0,
  "deaths": 0,
  "todayDeaths": 0,
  "recovered": 0,
  "critical": 0
};
var allCountries = [];
var count = 0;
function fixcountry(country){
  switch (country){
    case 'S. Korea':
      return 'Korea (Republic of)';
    default:
      return country;
  }
}
function getalpha2Code(country){
  country = fixcountry(country);
  for (let i = 0; i < allCountries.length; i++) {
    const element = allCountries[i];
    if((element.name == country)){
      return element.alpha2Code;
    }else{
      for (let i = 0; i < element.altSpellings.length; i++) {
        const e1 = element.altSpellings[i];
        if(e1 == country){
          return element.alpha2Code;
        }
      }
    }
  }
  return false;
}
function getallcountries(next){
  fetch("https://restcountries.eu/rest/v2/all?fields=name;altSpellings;alpha2Code")
  .then(
      function(response) {
      if (response.status !== 200) {

          return;
      }
      // Examine the text in the response
      response.json().then(function(data) {
          allCountries = data;
          if(typeof(next) == "function"){
            next();
          }
      });
      }
  )
  .catch(function(err) {
      
  });
}
function getData(next){
  fetch("https://coronavirus-19-api.herokuapp.com/countries")
  .then(
      function(response) {
      if (response.status !== 200) {
          err();
          return;
      }
      // Examine the text in the response
      response.json().then(function(data) {
          Data = data;
          countries = ["All"];
          for(var c in Data){
            countries.push(Data[c]["country"]);
          }
          for (let i = 0; i < Data.length; i++) {
            const e = Data[i];
            allData['cases'] += e['cases'];
            allData['todayCases'] += e['todayCases'];
            allData['deaths'] += e['deaths'];
            allData['todayDeaths'] += e['todayDeaths'];
            allData['recovered'] += e['recovered'];
            allData['critical'] += e['critical'];
          }
          autocomplete(sel, countries);
          getallcountries(next?next:NULL);
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
                location.hash = "#" + sel.value;
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

flag.addEventListener("error", function(){
  flag.src = errimg;
});
flag.addEventListener("click", function(){
  getall(hashChange);
});
function setflag(country){
    var alpha2Code = getalpha2Code(country);
    if(alpha2Code){
      flag.src = "https://www.countryflags.io/" + alpha2Code + "/shiny/64.png";
    }else{
      flag.src = errimg;
    }
}
function err(){
    document.getElementById('country').innerText = "❓";
    document.getElementById('cases').innerText = "❓";
    document.getElementById('todayCases').innerText = "❓";
    document.getElementById('deaths').innerText = "❓";
    document.getElementById('todayDeaths').innerText = "❓";
    document.getElementById('recovered').innerText = "❓";
    document.getElementById('critical').innerText = "❓";
    flag.src = errimg;
}
function all(){
    flag.src = errimg;
    sel.value = "All";
    document.getElementById('cases').innerText = allData['cases'];
    document.getElementById('todayCases').innerText = allData['todayCases'];
    document.getElementById('deaths').innerText = allData['deaths'];
    document.getElementById('todayDeaths').innerText = allData['todayDeaths'];
    document.getElementById('recovered').innerText = allData['recovered'];
    document.getElementById('critical').innerText = allData['critical'];
  }
function hashChange(){
  var country = decodeURI(location.hash.slice(1));
  if((country == "All")||(country == "")){
    all();
  }else if((country)&&(countries.indexOf(country))>0){
    flag.src = errimg;
    data = Data[countries.indexOf(country)-1];
    setflag(data['country']);
    sel.value = data['country'];
    document.getElementById('cases').innerText = data['cases'];
    document.getElementById('todayCases').innerText = data['todayCases'];
    document.getElementById('deaths').innerText = data['deaths'];
    document.getElementById('todayDeaths').innerText = data['todayDeaths'];
    document.getElementById('recovered').innerText = data['recovered'];
    document.getElementById('critical').innerText = data['critical'];
    }else{
        err();
    }
}
window.addEventListener('hashchange', function (e) {
    e.preventDefault();
    hashChange();
});
getData(hashChange);
