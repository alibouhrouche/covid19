var express = require("express");
var async  = require('express-async-await');
var fetch = require('node-fetch');
const { createProxyMiddleware } = require('http-proxy-middleware');
var countries = require('./list.js');
var app = express();

const options = {
  target: 'https://cdn.glitch.com/', // target host
  changeOrigin: true, // needed for virtual hosted sites
  ws: false, // proxy websockets
  pathRewrite: {
    '^/favicon.ico': '/f2f5091a-5f0a-4796-94fa-c7393a3b1aae/favicon.ico?v=1584540676955', // rewrite path
    '^/api/remove/path': '/path' // remove base path
  },
  router: {
    // when request.headers.host == 'dev.localhost:3000',
    // override target 'http://www.example.org' to 'http://localhost:8000'
    'dev.localhost:3000': 'http://localhost:8000'
  }
};

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
app.get("/favicon.ico",async (req, res, next) => {
  function foundData(){
       return fetch("https://cdn.glitch.com/f2f5091a-5f0a-4796-94fa-c7393a3b1aae/favicon.ico?v=1584540676955")
  }
  const processData = async () => {
  const Data = await foundData()
  var ResponseData = await Data.buffer()
  res.set('Content-Type', 'image/x-icon')
  res.send(ResponseData);
  }
  processData()
});
app.get("/flags",async (req, res, next) => {
  function foundData(){
       return fetch("https://cdn.glitch.com/f2f5091a-5f0a-4796-94fa-c7393a3b1aae/flagSprite60.png?v=1584651917190")
  }
  const processData = async () => {
  const Data = await foundData()
  var ResponseData = await Data.buffer() 
  res.set('Content-Type', 'image/png')
  res.send(ResponseData);
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
