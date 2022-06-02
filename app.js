var express = require("express");
var mongoose = require("mongoose");
var app = express();
var port = process.env.PORT || 5000;
var sl_route =  require('./routes/signup_login');



app.use(sl_route);



app.get("/", (req, res) => {
  res.send("this is the home route");
});

app.listen(port,()=> {
    console.log('server started at port ' + port);
});
