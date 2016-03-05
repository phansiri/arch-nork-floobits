"use strict";

let fs = require('fs');


class Navigator {
	/**
	 * created a new navigator object.
	 * @constructor
	 * @param {string} worldPath - takes in a path and parses the world file into an object.
	 */
	constructor(worldPath) {
		this.world = JSON.parse(fs.readFileSync(worldPath, 'utf8'));
	}

	/**
	 * moves the player to the requested room based on a direction.
	 * @param {string} direction - which way the player would like to go on the map.
	 * @param {object} curRoom - object version of the room the player is currently in.
	 * @callback sends back current room.
	 */
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
			callback(targetRoom); //room was found
		} else {
			callback(curRoom); //room was not found
		}
	}

	/**
	 * returns the object form of the requested room.
	 * @param {string} roomId - id for the requested room.
	 * @return room object
	 */
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


