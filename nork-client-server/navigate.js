"use strict";

let fs = require('fs');

class Navigator {
	constructor(worldPath) {
		this.world = JSON.parse(fs.readFileSync(worldPath, 'utf8'));
	}

	goTo(direction, curRoom, callback){
		let targetRoom;

		// defines the current and target rooms and saves into variables
		if(curRoom.exits[direction] !== undefined){
			//targetRoom = resolveRoom(this, curRoom.exits[direction].id);

			targetRoom = this._resolveRoom(curRoom.exits[direction].id);
		}

		if(targetRoom !== undefined){
			callback(targetRoom);
		} else {
			callback(curRoom);
		}
	}

	//Reads the current room object and parses the information into a description
	//the user can read.
	getDescription(curRoom, callback) {
		let description = "You are in the " + curRoom.id.replace('_', ' ') + ". ";

		// checks to see if there are any items in the roo
		if (curRoom.items !== undefined) {
			curRoom.items.forEach(function (item) {
				description += "There is a " + item + " in the room. ";
			});
		}

		// adds to description if north direction exists
	    if(curRoom.exits.north !== undefined) {
	        description += "To the North is the " + curRoom.exits.north.id.replace('_', ' ') + ". ";
	    }

		// adds to description if north direction exists
	    if(curRoom.exits.south !== undefined) {
	        description += "To the South is the " + curRoom.exits.south.id.replace('_', ' ') + ". ";
	    }

		// adds to description if north direction exists
	    if(curRoom.exits.east !== undefined) {
	        description += "To the east is the " + curRoom.exits.east.id.replace('_', ' ') + ". ";
	    }

		// adds to description if north direction exists
	    if(curRoom.exits.west !== undefined) {
	        description += "To the West is the " + curRoom.exits.west.id.replace('_', ' ') + ". ";
	    }

	    return (description.trim() + '\n');
	}

	//Resolves a room object given a string name. Returns room object if found and
	//returns null if not found.
	//Should be treated as a private method.
	_resolveRoom(roomId) {
		for(var roomIndex = 0; roomIndex < this.world.rooms.length; roomIndex++){
			if(this.world.rooms[roomIndex].id === roomId){
				return this.world.rooms[roomIndex];
			}
		}
		return undefined;
	}
}

//Function exports for this module.
module.exports.Navigator = Navigator;


