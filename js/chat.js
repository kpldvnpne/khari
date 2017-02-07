var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000,()=>{
	console.log("listening on port 3000 at localhost");
});

var clients = 0;

var users = [];

io.on("connection",(socket)=>{
	console.log("a user connected");

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

	socket.on("disconnect",()=>{
		console.log("a user disconnected");
		// remember to clear the username after a user disconnects
	});
});