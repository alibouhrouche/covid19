var countries = [
    "China",
    "Italy",
    "Iran",
    "Spain",
    "Germany",
    "S. Korea",
    "France",
    "USA",
    "Switzerland",
    "UK",
    "Netherlands",
    "Norway",
    "Austria",
    "Belgium",
    "Sweden",
    "Denmark",
    "Japan",
    "Diamond Princess",
    "Malaysia",
    "Canada",
    "Australia",
    "Portugal",
    "Qatar",
    "Czechia",
    "Greece",
    "Israel",
    "Brazil",
    "Finland",
    "Ireland",
    "Slovenia",
    "Singapore",
    "Iceland",
    "Pakistan",
    "Bahrain",
    "Poland",
    "Estonia",
    "Romania",
    "Chile",
    "Egypt",
    "Philippines",
    "Thailand",
    "Indonesia",
    "Saudi Arabia",
    "Hong Kong",
    "Iraq",
    "India",
    "Luxembourg",
    "Kuwait",
    "Lebanon",
    "San Marino",
    "Peru",
    "Russia",
    "UAE",
    "Ecuador",
    "Turkey",
    "Slovakia",
    "South Africa",
    "Mexico",
    "Bulgaria",
    "Armenia",
    "Taiwan",
    "Serbia",
    "Panama",
    "Croatia",
    "Argentina",
    "Vietnam",
    "Colombia",
    "Algeria",
    "Latvia",
    "Brunei",
    "Albania",
    "Hungary",
    "Costa Rica",
    "Cyprus",
    "Faeroe Islands",
    "Morocco",
    "Sri Lanka",
    "Palestine",
    "Jordan",
    "Andorra",
    "Malta",
    "Belarus",
    "Azerbaijan",
    "Georgia",
    "Bosnia and Herzegovina",
    "Cambodia",
    "Oman",
    "Kazakhstan",
    "Venezuela",
    "North Macedonia",
    "Moldova",
    "Uruguay",
    "Senegal",
    "Lithuania",
    "Tunisia",
    "Afghanistan",
    "Dominican Republic",
    "Liechtenstein",
    "Martinique",
    "Burkina Faso",
    "Ukraine",
    "Macao",
    "Maldives",
    "New Zealand",
    "Bolivia",
    "Jamaica",
    "French Guiana",
    "Uzbekistan",
    "Bangladesh",
    "Cameroon",
    "Monaco",
    "Paraguay",
    "Réunion",
    "Guatemala",
    "Honduras",
    "Guyana",
    "Ghana",
    "Rwanda",
    "Channel Islands",
    "Ethiopia",
    "Guadeloupe",
    "Cuba",
    "Guam",
    "Mongolia",
    "Puerto Rico",
    "Trinidad and Tobago",
    "Ivory Coast",
    "Kenya",
    "Seychelles",
    "Nigeria",
    "Aruba",
    "Curaçao",
    "DRC",
    "French Polynesia",
    "Gibraltar",
    "St. Barth",
    "Barbados",
    "Liberia",
    "Montenegro",
    "Namibia",
    "Saint Lucia",
    "Saint Martin",
    "U.S. Virgin Islands",
    "Cayman Islands",
    "Sudan",
    "Nepal",
    "Antigua and Barbuda",
    "Bahamas",
    "Benin",
    "Bhutan",
    "CAR",
    "Congo",
    "Equatorial Guinea",
    "Gabon",
    "Greenland",
    "Guinea",
    "Vatican City",
    "Mauritania",
    "Mayotte",
    "St. Vincent Grenadines",
    "Somalia",
    "Suriname",
    "Eswatini",
    "Tanzania",
    "Togo"
];
var sel = document.getElementById('country');
var list = document.getElementById('country-list');
for(var c in countries){
    var e = document.createElement('option');
    e.value = e.innerText = countries[c];
    list.appendChild(e);
}
function err(){
    document.getElementById('country').innerText = "❓";
    document.getElementById('cases').innerText = "❓";
    document.getElementById('todayCases').innerText = "❓";
    document.getElementById('deaths').innerText = "❓";
    document.getElementById('todayDeaths').innerText = "❓";
    document.getElementById('recovered').innerText = "❓";
    document.getElementById('critical').innerText = "❓";
}
function all(){
fetch("https://corona.lmao.ninja/all")
  .then(
    function(response) {
      if (response.status !== 200) {
        err();
        return;
      }
      // Examine the text in the response
      response.json().then(function(data) {
        sel.value = "All";
        document.getElementById('cases').innerText = data['cases'];
        document.getElementById('todayCases').innerText = "❓";
        document.getElementById('deaths').innerText = data['deaths'];
        document.getElementById('todayDeaths').innerText = "❓";
        document.getElementById('recovered').innerText = data['recovered'];
        document.getElementById('critical').innerText = "❓";
      });
    }
  )
  .catch(function(err) {
    err();
  });
}
function hashChange(){
var country = location.hash.slice(2);
if(country){
    fetch(`https://corona.lmao.ninja/countries/${country}`)
    .then(
        function(response) {
        if (response.status !== 200) {
            all();
            return;
        }

        // Examine the text in the response
        response.json().then(function(data) {
            sel.value = data['country'];
            document.getElementById('cases').innerText = data['cases'];
            document.getElementById('todayCases').innerText = data['todayCases'];
            document.getElementById('deaths').innerText = data['deaths'];
            document.getElementById('todayDeaths').innerText = data['todayDeaths'];
            document.getElementById('recovered').innerText = data['recovered'];
            document.getElementById('critical').innerText = data['critical'];
        });
        }
    )
    .catch(function(err) {
        all();
    });
    }else{
        all();
    }
}
window.addEventListener('hashchange', function (e) {
    e.preventDefault();
    hashChange();
});
hashChange();

sel.addEventListener("change",()=>{
    if(sel.value == "All"){
        location.hash = "";
    }else{
        location.hash = "#/" + sel.value;
    }
});