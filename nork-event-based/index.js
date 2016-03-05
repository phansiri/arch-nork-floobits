"use strict";

//dependencies
const EventEmitter = require('events');
const readline = require('readline');
const nav = require('../common/navigate.js');
const menu = require('../common/menu.js');

class GameManager extends EventEmitter {}
class Player extends EventEmitter {}

let gameManager = new GameManager();
let navigator = new nav.Navigator('../common/world.json'); //Initialize world and navigation functionality
let inventory = new menu.Inventory(); //Initializes new inventory manager.

// game instance variables
let curRoom = navigator.world.rooms[0];
let inventoryItem = [];

let io = readline.createInterface({ //call the interface "io"
    input: process.stdin, //input comes from the terminal ("standard in")
    output: process.stdout //output goes to the terminal ("standard out")
});

//player listening for game managers response
gameManager.on('prompt', function(text, prompt) {
    console.log(text + '\n'); // print game description

    if(prompt) {
    	io.question('What do you want to do? ', function(response) { // prompts user for a response
	    	gameManager.emit('response', response); // send response to game manager
	    })
    }
});

//game manager listening for players response
gameManager.on('response', function(response) {
	let splitAction = response.split(' ');

    if (splitAction[0] === 'go') {
        navigator.goTo(splitAction[1], curRoom, function(room) {
            curRoom = room;
            console.log(curRoom.status);

            if(curRoom.status === undefined) {
				gameManager.emit('prompt', `\nYou go ${splitAction[1]}` + '...\n\n' + room.description, true);
            } else {
                console.log(`curRoom.status is defined! ${curRoom.status}, game should end`);
            	gameManager.emit('prompt', `\nYou go ${splitAction[1]}` + '...\n\n' + room.description + '\n\nYou ' + curRoom.status + '!', false);
            }
            
        });
    } else if (splitAction[0] === 'take') {
        inventory.takeItem(curRoom, splitAction[1], function(itemFound) {
            if (itemFound !== undefined) {
                inventoryItem.push(itemFound);

                gameManager.emit('prompt', '\n' + itemFound + ' added to inventory.', true);
            } else {
            	gameManager.emit('prompt', 'Could not find "' + splitAction[1] + '" in ' + curRoom.id.replace('_', ' ') + '.\n', true);
            }
        });
    } else if (splitAction[0] === 'use') {
        inventory.useItem(splitAction[1], curRoom, inventoryItem, function(item) {
            if (item !== undefined) {
                let prevRoom = curRoom;
                curRoom = navigator.resolveRoom(curRoom.uses[0].effect.goto);
                inventoryItem = inventory.removeItem(inventoryItem, item);

                if(curRoom.status === undefined) {
                    gameManager.emit('prompt', `\nUsing one time use item ${item}...${prevRoom.uses[0].description} ${curRoom.description}`, true);
                } else {
                    gameManager.emit('prompt',  `\nYou go ${splitAction[1]}` + curRoom.status + '!', false);
                }
            } else {
            	gameManager.emit('prompt', `Could not use ${splitAction[1]} in ${curRoom.id.replace('_', ' ')}.\n`, true);
            }
        });
    } else if (splitAction[0] === 'inventory') {
    	gameManager.emit('prompt', '\nInventory: ' + inventory.inventoryList(inventoryItem) + '\n', true);
    } else if (splitAction[0] === 'help') {
    	gameManager.emit('prompt', 'Commands: "GO", "TAKE", "USE", "INVENTORY"\n', true);
    } else {
    	gameManager.emit('prompt', 'Command not recognized...\n', true);
    }
});

gameManager.emit('prompt', 'Welcome to NORK -- A Text Based Adventure Game!\n' +
        'To Navigate to a different room use the command "GO"\nTo take an item use the command "TAKE"\n' +
        'To use and item use the command "USE"\nTo check your inventory use the command "INVENTORY"\n' +
        'You can find the list of commands at any time by typing "HELP"\n\n' +curRoom.description, true); //start game*/