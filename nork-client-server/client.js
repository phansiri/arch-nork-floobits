/**
 * user interaction as the client over plain text
 */

'use strict';

let net = require('net');
let readline = require('readline');
let _ = require('./../common/common.js');

let io = readline.createInterface({ //call the interface "io"
    input: process.stdin, //input comes from the terminal ("standard in")
    output: process.stdout //output goes to the terminal ("standard out")
});

//make the client
var client = new net.Socket();

client.on('data', function(data) { //when we get data
	console.log('' + data, 'game-over');
	if('' + data !== 'game-over') {
		console.log('' + data);
	    io.question('What do you want to do? ', function(response) { // prompts user for a response
	    	client.write(response); // send response to server
	    });
	}
});

client.on('close', function() { //when connection closed
    console.log('Connection closed');
});


//var HOST = '127.0.0.1';
//var PORT = 3000;
//connect to the server
client.connect(_.PORT, _.HOST, function() {
    console.log('Connected to: ' + _.HOST + ' : ' + _.PORT + '\n');

    //send message to server
    //client.write("Hello server, I'm the client!");
});