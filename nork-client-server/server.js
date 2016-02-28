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
    socket.write('Welcome to NORK -- A Text Based Adventure Game!\n');
    socket.write('To Navigate to a different room use the command "GO"\n');
    socket.write('To take an item use the command "TAKE"\n');
    socket.write('To use and item use the command "USE"\n');
    socket.write('To check your inventory use the command "INVENTORY"\n');
    socket.write('You can find the list of commands at any time by typing "HELP"\n\n');

    socket.write(curRoom.description + '\n');

    /* when a socket is connected... */

    //notify on data received event
    socket.on('data', function(data) {
        socket.on('disconnect', function(){
            console.log('User disconnected');
        });

        //process data
        var echo = data.toString().toLowerCase();

        if(echo === 'EXIT') { // have to type "go exit"
            socket.write("Goodbye!");
            socket.end;
        } else {
           curRoom = promptUser(socket, curRoom, echo, inventoryItem);

           if(curRoom === undefined) {
                socket.end;
           }
        }
    });

    socket.on('error', function() { console.log("User disconnected abruptly"); });

    // close the connection
    socket.end;
});

function promptUser(socket, curRoom, response, inventoryItem){
    let splitAction = response.split(' ');

    if (splitAction[0] === 'go') {
        navigator.goTo(splitAction[1], curRoom, function(room) {
            socket.write(`\nYou go ${splitAction[1]}` + '...\n\n' + room.description + '\n');
            // I added this because the world would not save the new room
            curRoom = room;

            if(room.status !== undefined) {
                socket.write('You ' + room.status + '!\n');
                return undefined;
            } else {
                return curRoom;
            }
        });
    } else if (splitAction[0] === 'take') {
        inventory.takeItem(curRoom, splitAction[1], function(itemFound) {
            if (itemFound !== undefined) {
                inventoryItem.push(itemFound);
                // need to implement a removeItem from the room
                socket.write(itemFound + ' added to inventory.\n');
            } else {
                socket.write('Could not find "' + splitAction[1] + '" in ' + curRoom.id.replace('_', ' ') + '.\n');
            }
        });
    } else if (splitAction[0] === 'use') {
        //console.log(curRoom);
        inventory.useItem(splitAction[1], curRoom, inventoryItem, function(item) {
            if (item !== undefined) {
                socket.write(`Using one time use item ${item}...\n`);
                socket.write(curRoom.uses[0].description);
                inventoryItem = inventory.removeItem(inventoryItem, item);
                curRoom = navigator.resolveRoom(curRoom.uses[0].effect.goto);
                socket.write(curRoom.description + '\n');
                return curRoom;
            } else {
                socket.write(`Could not use ${splitAction[1]} in ${curRoom.id.replace('_', ' ')}.\n`)
            }
        });
    } else if (splitAction[0] === 'inventory') {
        socket.write('Inventory: ' + inventory.inventoryList(inventoryItem) + '\n');
    } else if (splitAction[0] === 'help') {
        socket.write('Commands: "GO", "TAKE", "USE", "INVENTORY"\n');
    } else {
        socket.write('Command not recognized...\n');
    }

    return curRoom;
}

//when we start "listening" for connections
server.on('listening', function() {
    //get address info
    var addr = server.address();

    //print the info
    console.log('server listening on port %d', addr.port);
});

server.listen(_.PORT); //listen on port 3000

