var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var path = require('path');

app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));

server.listen(3000,()=>{
	console.log("listening at port 3000");
});

app.get("/",(req, res)=>{
	res.sendFile(__dirname + "/views/index.html");
});

app.get("/stu",(req, res)=>{
	res.sendFile(__dirname + "/views/student.html");
});

app.get("/chat",(req, res)=>{
	res.sendFile(__dirname + "/views/chat.html");
});

//////////////// CHAT variables ///////////////////////
var clients = 0;
var users = [];


//////////////////// CANVAS //////////////////////////////

var line_history = [];

io.on('connection', function (socket) {
	console.log("a user connected");

	// first send the history to the new client
	for (var i in line_history) {
	  socket.emit('draw_line', { line: line_history[i].line, color: line_history[i].color } );
	}

	// add handler for message type "draw_line".
	socket.on('draw_line', function (data) {
	  // add received line to history 
	  line_history.push(data);
	  // send line to all clients
	  io.sockets.emit('draw_line', { line: data.line , color: data.color});
	});

	socket.on("clear",()=>{
		line_history = [];
		io.sockets.emit("clear");
	});

	/////////////// Chat ////////////////////////

	socket.on("verify", (data)=>{
		console.log("name to be verified");
		if (users.indexOf(data) > -1){
			// username already exists
			socket.emit("userExists", data + " is already taken please choose another");
		}else{
			users.push(data);
			socket.emit("userSet", data);
		}
	});

	socket.on("chat",(data)=>{
		console.log("chat is sent");
		io.sockets.emit('newmsg', data);
	});

	/////////////// Chat end ////////////////////


	socket.on("disconnect",()=>{
		console.log("a user disconnected");
	});
  });

////////////////////////////////////////////////////////