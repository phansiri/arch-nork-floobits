/**
 * user interaction as the client over plain text
 */

'use strict';

//dependencies
let net = require('net');
let readline = require('readline');
let _ = require('./../common/common.js');

let io = readline.createInterface({ //call the interface "io"
    input: process.stdin, //input comes from the terminal ("standard in")
    output: process.stdout //output goes to the terminal ("standard out")
});

//make the client
var client = new net.Socket();

//Initially starts the game logic
client.on('data', function(data) { //when we get data
    let message = JSON.parse('' + data);

    console.log(message.text);

    if(message.prompt) {
    	io.question('What do you want to do? ', function(response) { // prompts user for a response
	    	client.write(response); // send response to server
	    })
    }
});

//ends the connection
client.on('end', function() {
	console.log('');
});

//close the connection
client.on('close', function() { //when connection closed
    console.log('Connection closed');
});

//connect to the server
client.connect(_.PORT, _.HOST, function() {
    console.log('Connected to: ' + _.HOST + ' : ' + _.PORT + '\n');
});