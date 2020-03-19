var express = require("express");
var async  = require('express-async-await');
var fetch = require('node-fetch');
var countries = require('./list.js');
var app = express();

function checkHttps(req, res, next) {
  // protocol check, if http, redirect to https

  if (req.get("X-Forwarded-Proto").indexOf("https") != -1) {
    console.log("https, yo");
    return next();
  } else {
    console.log("just http");
    res.redirect("https://" + req.hostname + req.url);
  }
}

app.all("*", checkHttps);
app.use(express.static("public"));
app.get("/list",(req,res)=>{
  res.json(countries);
});
app.get("/flag/:name", async (req, res, next) => {
    
    function foundData(){
        return fetch(`https://www.countryflags.io/${req.params.name}/shiny/64.png`);
    }
    const processData = async () => {
    const Data = await foundData()
    var ResponseData = await Data.arrayBuffer()

    }
    processData()
});
app.get("/data",async (request, response, next) => {
  function foundData(){
      return fetch("https://coronavirus-19-api.herokuapp.com/countries")
  }
  const processData = async () => {
  const Data = await foundData()
  var ResponseData = await Data.json()
  var ResData = [
    {
      "country": "All",
      "code": false,
      "cases": 0,
      "todayCases": 0,
      "deaths": 0,
      "todayDeaths": 0,
      "recovered": 0,
      "critical": 0
    }
  ];
  for (let i = 0; i < ResponseData.length; i++) {
    const e = ResponseData[i];
    ResData[0]['cases'] += e['cases'];
    ResData[0]['todayCases'] += e['todayCases'];
    ResData[0]['deaths'] += e['deaths'];
    ResData[0]['todayDeaths'] += e['todayDeaths'];
    ResData[0]['recovered'] += e['recovered'];
    ResData[0]['critical'] += e['critical'];
    var cntry = countries.find(({ name }) => name === e.country);
    ResData.push({
      "country": e['country'],
      "code": (cntry && cntry.code) ? cntry.code : false,
      "cases": e['cases'],
      "todayCases": e['todayCases'],
      "deaths": e['deaths'],
      "todayDeaths": e['todayDeaths'],
      "recovered": e['recovered'],
      "critical": e['critical']
    });
  }
  response.json(ResData);
  }
  processData()
});
app.listen(process.env.PORT);
