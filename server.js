var mongoose = require("mongoose");

var express = require("express");

var app = express();

var path = require("path");

var Bodyparser = require("body-parser");

app.set("view engine", "ejs");

app.set("views", path.join(__dirname,"./views"));

app.use(Bodyparser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost/msgboard");

app.get("/", function(req, res) {
	res.render("index")
})

var port = 8000
app.listen(port, function(){
	console.log("listening to port 8000")
})
