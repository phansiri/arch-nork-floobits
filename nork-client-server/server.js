/**
 * game's world state and engine running as a server
 */

'use strict';

// dependencies
let net = require('net'); //import socket module
let _ = require('./../common/common.js');
let nav = require('../common/navigate.js');
let menu = require('../common/menu.js');

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

    socket.write(messageToJSON('Welcome to NORK -- A Text Based Adventure Game!\n' +
        'To Navigate to a different room use the command "GO"\nTo take an item use the command "TAKE"\n' +
        'To use and item use the command "USE"\nTo check your inventory use the command "INVENTORY"\n' +
        'You can find the list of commands at any time by typing "HELP"\n\n' +curRoom.description +
        '\n', true));

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
                // ends the game if room status is defined
                if(message !== undefined) {
                    curRoom = room;
                    inventoryItem = inv;

                    if (curRoom.status !== undefined) {
                       socket.end(messageToJSON(message + '\n\nYou ' + curRoom.status + '!', false)); // game o
                    } else {
                       socket.write(messageToJSON(message + '\n', true));
                    }
                }
            });
        }
    });

    socket.on('error', function() { console.log("User disconnected abruptly"); });
});

/**
 * moves the player to the requested room based on a direction.
 * @param {object} curRoom - current room the user is in
 * @param {string} response - players response to the prompt
 * @param {array} inventoryItem - current player's inventory
 * @callback sends back current room, inventory, and a message to the user
 */
function promptUser(curRoom, response, inventoryItem, callback){
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
                inventoryItem = inventory.removeItem(inventoryItem, item);

                callback(curRoom, inventoryItem, `\nUsing one time use item ${item}...${prevRoom.uses[0].description} ${curRoom.description}`);
            } else {
                callback(curRoom, inventoryItem, `Could not use ${splitAction[1]} in ${curRoom.id.replace('_', ' ')}.\n`);
            }
        });
    } else if (splitAction[0] === 'inventory') {
        callback(curRoom, inventoryItem, '\nInventory: ' + inventory.inventoryList(inventoryItem) + '');
    } else if (splitAction[0] === 'help') {
        callback(curRoom, inventoryItem, 'Commands: "GO", "TAKE", "USE", "INVENTORY"\n');
    } else {
        callback(curRoom, inventoryItem, 'Command not recognized...\n');
    }
}

/**
 * creates a json string to send over the socket.
 * @param {string} text - message to be sent to the player
 * @param {boolean} prompt - should the user be prompted for another response.
 * @return stringified json
 */
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

