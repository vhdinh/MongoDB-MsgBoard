
// Set up app
var express = require("express");

var app = express();

var path = require("path");

var Bodyparser = require("body-parser");

app.set("view engine", "ejs");

// Setting up static folder directory
app.use(express.static(path.join(__dirname, "./static")));


app.set("views", path.join(__dirname,"./views"));

app.use(Bodyparser.urlencoded({extended:true}));

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/msgboard");

// Models
var Schema =  mongoose.Schema;




var MessageSchema = new Schema({
	name: {type: String, required : true},
	message: {type: String, required: true },
	comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]

}, {timestamps: true})

mongoose.model("Message", MessageSchema)

var CommentSchema = new Schema({
	name: {type: String, required : true},
	comment: {type: String, required: true },
	_message: {type: Schema.Types.ObjectId, ref:"Message"}
}, {timestamps: true})

mongoose.model("Comment", CommentSchema);



var Message = mongoose.model("Message")

var Comment = mongoose.model("Comment")


// Routes
app.get("/", function(req, res) {
	// find all the messages, add comments to messages, exec throws them together
	Message.find({}).populate("comments").exec(function(err,messages){
		if(err){
			res.json(err)
		}
		else{
			// if we find messages, we display them (linke to comments)
			console.log(messages)
			res.render('index', {messages : messages})
		}
	})
})

app.post("/create_message", function(req, res) {
	var message = new Message(req.body)
	message.save(function(err){
		if(err){
			res.json(err)
		}
		else{
			res.redirect('/')
		}
	})
	
})

app.post("/create_comment/:id", function(req, res) {

	// two ways to do this
	// var comment - new Comment(req.body)
	// comment._message = req.params.id
	// other way is:


	// find one message to link the comment to the actual message
	Message.findOne({_id: req.params.id}, function(err,message){
		if(err){
			res.json(err)
		}
		else{
			// if we nave no error
			console.log(message)
			// create new comment, link comment to message
			var comment = new Comment({
				name: req.body.name, 
				comment: req.body.comment,
				_message: message._id
			})

			// save the comment
			comment.save(function(err){
				if(err){
					res.json(err)
				}
				else{
					// if we correctly saved the comment, push comment id in message comment attribute and save
					message.comments.push(comment._id);
					message.save(function(err){
						if(err){
							res.json(err)
						}
						else{
							// if we correctly save the message, we redirect
						res.redirect("/")
						}						
					})
				}
			})
		}
	})
})



var port = 8000
app.listen(port, function(){
	console.log("listening to port 8000")
})
