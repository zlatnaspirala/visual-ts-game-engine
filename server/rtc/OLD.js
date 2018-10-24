/////////////////////////////////////////////////////
// Developer : Nikola Lukic zlatnaspirala@gmail.com 
// MIT Licence
/////////////////////////////////////////////////////
/*
 * GAME SERVER FOR VISUAL JS 2
 * visual ts game engine
*/

var fs = require("fs");
var express = require("express");
var app = express();
var http = require('http');
var https = require('https');

function include(f) { eval.apply(global, [read(f)]); }
function read(f) { return fs.readFileSync(f).toString(); }

// NO SECURE - HTTP 
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(1243);
console.log('Socket server listening on port: ', 1243);

var usernames = {};

// Validate every signal in account view
io.sockets.on('connection', function (socket) {

	console.log("-------------------------------------------------------------");
	console.log("CONNECTED WITH GAME SERVER Visual ts game engine ");
	console.log("-------------------------------------------------------------");

	// GLOBAL PUBLIC CHAT - USE FOR ANY STAFF
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'realtime' with 2 parameters
		var private_email = socket.email;
		if (typeof socket.email != 'undefined' && data.length < 150) {
			console.log("COMMON :" + data)
			io.sockets.emit('realtime', private_email, data);
		}

	});

	//REGISTER EVENT
	socket.on('register', function (email, password) {

		//if (validateEmail(email) == true) {
		// socket.email = email;
		// console.log("This email already exist : ", email);
		// io.sockets.emit('realtime', "registerFeild", "Email already exist " + email);
		// io.sockets.emit('realtime', "registerDoneMailVerification", "Just goto your email and click on confirmation link.");
		//	}
		//else {
		socket.emit('realtime', "registerDoneMailVerification", "Your email is not valid. You faild both verifycation (client and server) .");
		//	}

	});

	socket.on('activateAccount', function (token_) {

		console.log("Activate new user with token : ", token_);

	});

	socket.on('fast_login', function (email, accesstoken) {

		console.log("FAST LOGIN", accesstoken, " email ", email);

	});


	socket.on('login', function (email, password) {

	});

	socket.on('newpass', function (email) {

	});

	socket.on('disconnect', function () {


		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('realtime', 'SERVER', socket.username + ' has disconnected');

	});



	///////////////////////////////////////////////////////////////////
	// closing session after 20 sec if user are not on some of web pages
	///////////////////////////////////////////////////////////////////
	function DELAY_SESSION_DEAD(data, edata) {

		setTimeout(function () {

			console.log("Delay session die", data);

		}, 20000);

	}

});

