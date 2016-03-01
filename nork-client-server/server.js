/**
 * game's world state and engine running as a server
 */

'use strict';

// dependencies
let net = require('net'); //import socket module
let _ = require('./../common/common.js');
let nav = require('./navigate.js');
let menu = require('./menu.js');

// instance Variables
let server = net.createServer(); //create socket server
let navigator = new nav.Navigator('../common/world.json'); //Initialize world and navigation functionality
let inventory = new menu.Inventory(); //Initializes new inventory manager.

// notify (via observer!) when a connection occurs
server.on('connection', function(socket) {
    //we've established a socket to use

    let curRoom = navigator.world.rooms[0]; // holds the current room
    let inventoryItem = []; // array to hold items with examples

    // send a message to the socket
    console.log('User Connected');

    // intro for connecting user
    //socket.write(messageToJSON('Welcome to NORK -- A Text Based Adventure Game!\n', false));
    //socket.write(messageToJSON('To Navigate to a different room use the command "GO"\n', false));
    //socket.write(messageToJSON('To take an item use the command "TAKE"\n', false));
    //socket.write(messageToJSON('To use and item use the command "USE"\n', false));
    //socket.write(messageToJSON('To check your inventory use the command "INVENTORY"\n', false));
    //socket.write(messageToJSON('You can find the list of commands at any time by typing "HELP"\n\n', false));

    socket.write(messageToJSON(curRoom.description + '\n', true));

    /* when a socket is connected... */
    //notify on data received event
    socket.on('data', function(data) {
        socket.on('disconnect', function(){
            console.log('User disconnected');
        });

        //process data
        var echo = data.toString().toLowerCase();


        if(echo === 'exit') {
            socket.write("Goodbye!");
            socket.end('');
        } else {
           promptUser(socket, curRoom, echo, inventoryItem, function(room, inv, message) {
               //console.log(message);
                // ends the game if room status is defined
               if(message !== undefined) {
                   //console.log(message);
                   curRoom = room;
                   inventoryItem = inv;
                   if (curRoom.status !== undefined) {
                       //console.log( `inside you...`)
                       //console.log(`status is not equal to undefined`);
                       socket.end(messageToJSON(message + '\n\nYou ' + curRoom.status + '!\n', false));
                   } else {
                       //console.log(`status is equal to undefined.`);
                       socket.write(messageToJSON(message + '\n', true));

                   }
               }
           });
        }
    });

    socket.on('error', function() { console.log("User disconnected abruptly"); });
});

function promptUser(socket, curRoom, response, inventoryItem, callback){
    let splitAction = response.split(' ');

    if (splitAction[0] === 'go') {
        navigator.goTo(splitAction[1], curRoom, function(room) {
            curRoom = room;

            callback(curRoom, inventoryItem, `\nYou go ${splitAction[1]}` + '...\n\n' + room.description);
        });
    } else if (splitAction[0] === 'take') {
        inventory.takeItem(curRoom, splitAction[1], function(itemFound) {
            if (itemFound !== undefined) {
                inventoryItem.push(itemFound);
                callback(curRoom, inventoryItem, '\n' + itemFound + ' added to inventory.');
            } else {
                callback(curRoom, inventoryItem, 'Could not find "' + splitAction[1] + '" in ' + curRoom.id.replace('_', ' ') + '.\n');
            }
        });
    } else if (splitAction[0] === 'use') {
        inventory.useItem(splitAction[1], curRoom, inventoryItem, function(item) {
            if (item !== undefined) {
                let prevRoom = curRoom;
                curRoom = navigator.resolveRoom(curRoom.uses[0].effect.goto);
                //socket.write(messageToJSON(`\nUsing one time use item ${item}...${prevRoom.uses[0].description} ${curRoom.description}`, true));
                inventoryItem = inventory.removeItem(inventoryItem, item);

                callback(curRoom, inventoryItem, `\nUsing one time use item ${item}...${prevRoom.uses[0].description} ${curRoom.description}`);
            } else {
                socket.write(messageToJSON(`Could not use ${splitAction[1]} in ${curRoom.id.replace('_', ' ')}.\n`))
            }
        });
    } else if (splitAction[0] === 'inventory') {
        callback(curRoom, inventoryItem, 'Inventory: ' + inventory.inventoryList(inventoryItem) + '\n');
        //socket.write(messageToJSON('Inventory: ' + inventory.inventoryList(inventoryItem) + '\n', true));
    } else if (splitAction[0] === 'help') {
        //socket.write('Commands: "GO", "TAKE", "USE", "INVENTORY"\n');

        callback(curRoom, inventoryItem, 'Commands: "GO", "TAKE", "USE", "INVENTORY"\n');
        //socket.write(messageToJSON('Commands: "GO", "TAKE", "USE", "INVENTORY"\n', true));
    } else {
        callback(curRoom, inventoryItem, 'Command not recognized...\n');
        //socket.write('Command not recognized...\n');
    }

    callback(curRoom, inventoryItem);
}

function messageToJSON(text, prompt) {
    var jsonData = {};
    jsonData.prompt = prompt;
    jsonData.text = text;
    return JSON.stringify(jsonData);
}

//when we start "listening" for connections
server.on('listening', function() {
    //get address info
    var addr = server.address();

    //print the info
    console.log('server listening on port %d', addr.port);
});

server.listen(_.PORT); //listen on port 3000

