"use strict";

let fs = require('fs');

class Navigator {
	constructor(worldPath) {
		this.world = JSON.parse(fs.readFileSync(worldPath, 'utf8'));
	}

	goTo(direction, curRoom, callback){
		let targetRoom;

		// defines the current and target rooms and saves into variables
		if(curRoom !== null) {
			if(curRoom.exits !== undefined) {
				if (curRoom.exits[direction] !== undefined) {
					targetRoom = this.resolveRoom(curRoom.exits[direction].id);
				}
			}
		}

		if(targetRoom !== undefined){
			callback(targetRoom);
		} else {
			callback(curRoom);
		}
	}

	//Resolves a room object given a string name. Returns room object if found and
	//returns null if not found.
	resolveRoom(roomId) {
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


