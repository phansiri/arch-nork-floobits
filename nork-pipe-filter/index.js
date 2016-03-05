/**
 * Created by lit_phansiri on 3/1/16.
 */
'use strict';
//adapted from https://strongloop.com/strongblog/new-io-js-features-you-may-not-be-using/
var stream = require('stream');
var readline = require('readline');
var fs = require('fs');
var world = JSON.parse(fs.readFileSync('../common/world.json', 'utf8'));

let io = readline.createInterface({ //call the interface "io"
    input: process.stdin, //input comes from the terminal ("standard in")
    output: process.stdout //output goes to the terminal ("standard out")
});

var rws = new stream.Transform;
var curRoom = world.rooms[0];
var inventory = [];

console.log(curRoom.description);
io.question('What do you want to do?', function(response) {
    let splitAction = response.toLowerCase().split(' '); //configure input string

    rws.push(responseToJSON(splitAction[0], splitAction[1]));
    rws.pipe(navigationFilter);

    //rws.pipe(navigationFilter)*/.pipe(menuFilter).pipe(infoFilter)*/;
    //let filterResponse = rws.read().toString();
});

rws.on('data', function() {
    console.log(curRoom.description);

    io.question('What do you want to do?', function(response) {
        let splitAction = response.toLowerCase().split(' '); //configure input string

        this.push(responseToJSON(splitAction[0], splitAction[1]));
        this.pipe(navigationFilter);

        //rws.pipe(navigationFilter)*/.pipe(menuFilter).pipe(infoFilter)*/;
        //let filterResponse = rws.read().toString();
    });
});

var navigationFilter = new stream.Transform({
   objectMode: true,   //include any existing constructor options

   transform (chunk, encoding, done) { // This is the _transform method
        var data = chunk.toString(); //read in data
        let gameData = JSON.parse(data);

        // logic to move room
        if (gameData.command === 'go') {
            let targetRoom;

            // defines the current and target rooms and saves into variables
            if(curRoom !== null && curRoom.exits !== undefined && curRoom.exits[gameData.value] !== undefined) {
                for(var roomIndex = 0; roomIndex < world.rooms.length; roomIndex++){
                    if(world.rooms[roomIndex].id === curRoom.exits[gameData.value].id){
                        targetRoom = world.rooms[roomIndex];
                        { break };
                    }
                }
            }

            if(targetRoom !== undefined){
                console.log("here");
                curRoom = targetRoom;
                this.push(JSON.stringify(gameData));
            } else {
                console.log('Cannot go that way');
                this.push(data); //pipe out data
            }
        } else {
            this.push(data); //pipe out data
        }
   },

   flush(done) { // This is the _flush method
       //any final processing occurs here
       done();
   }
});

var menuFilter = new stream.Transform({
   objectMode: true,   //include any existing constructor options

   transform (chunk, encoding, done) { // This is the _transform method
        var data = chunk.toString(); //read in data
        let gameData = JSON.parse(data);

        // logic to move room
        if(gameData.command === 'take') {
            if(curRoom.items) {
                for (let i = 0; i < curRoom.items.length; i++) {
                    if (gameData.value === curRoom.items[i]) {
                        inventory.push(curRoom.items[i]);
                        curRoom.items[i] = undefined;
                    }
                }
            }
        } else if(gameData.command === 'use') {
            if (inventory.length !== 0 && curRoom.uses !== undefined) { // if room.uses exist in obj
                for (let useIndex = 0; useIndex < curRoom.uses.length; useIndex++) {
                    if (curRoom.uses[useIndex].item === gameData.value && curRoom.uses[useIndex].effect.consumed !== true) {
                        curRoom.uses[useIndex].effect.consumed = true;

                        for(var roomIndex = 0; roomIndex < world.rooms.length; roomIndex++){
                            if(world.rooms[roomIndex].id === curRoom.uses[useIndex].effect.goto){
                                curRoom = world.rooms[roomIndex];
                                { break };
                            }
                        }
                    }
                }
            }
        }

        this.push(JSON.stringify(gameData)); //pipe out data
   },

   flush(done) { // This is the _flush method
       //any final processing occurs here
       done();
   }
});

var infoFilter = new stream.Transform({
    objectMode: true,   //include any existing constructor options

    transform (chunk, encoding, done) { // This is the _transform method
        var data = chunk.toString(); //read in data
        let gameData = JSON.parse(data);

        if(gameData.command === 'help') {
            console.log('Commands: "GO", "TAKE", "USE", "INVENTORY"\n');
        } else if(gameData.command === 'inventory') {
            if (gameData.inventory.length === 0 || gameData.inventory === undefined) {
                console.log('empty!\n');
            } else {
                for (var i = 1; i < gameData.inventory.length; i++) {
                    console.log(gameData.inventory[i] + '\n');
                }
            }
        }

        this.push(data);
    },

    flush(done) { // This is the _flush method
       //any final processing occurs here
       done();
    }
});

function responseToJSON(command, value) {
    let data = {};
    data.command = command;
    data.value = value;

    return JSON.stringify(data);
}