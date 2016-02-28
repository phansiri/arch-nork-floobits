/**
 * Created by lit_phansiri on 2/26/16.
 */

"use strict";

class Inventory {
    constructor(navigator) {
        this.nav = navigator;
    }

    // fencepost way of concatenating the list of items together and returns it
    inventoryList(inventoryItem) {
        if (inventoryItem.length === 0) {
            return "empty";
        } else {
            var result = inventoryItem[0];
            for (var i = 1; i < inventoryItem.length; i++) {
                result = result + ', ' + inventoryItem[i];
            }
            return result;
        }
    }

    // takes the specific item specified from the user
    takeItem(room, item, callback) {
        if (room.items) {
            for (let i = 0; i < room.items.length; i++) {
                if (item === room.items[i]) {
                    callback(room.items[i]);
                } else {
                    callback(undefined);
                }
            }
        } else {
            callback(undefined);
        }
    }

    useItem(item, room, inventoryItem, callback) {
        if (inventoryItem.length === 0) {
            callback(undefined); //'you have no items to use';
        } else {
            if (room.uses[0]) { // if room.uses exist in obj
                console.log('room.uses[0] exists');
                for (let useIndex = 0; useIndex < room.uses.length; useIndex++) {
                    if (room.uses[useIndex].item === item) {
                        console.log(`${item} can be used in ${room.id}`);
                        console.log(`${room.uses[useIndex].effect.consumed}`);
                        if (room.uses[useIndex].effect.consumed !== true) {
                            room.uses[useIndex].effect.consumed = true;
                            console.log(`consumed? ${room.uses[useIndex].effect.consumed}`);
                            callback(room.uses[useIndex].item);
                        } else {
                            console.log('has been used already');
                            callback(undefined);
                        }
                        // room[useIndex].consumed = true; //finds out if the use has already been done (needs access to world object)
                        // send item back so that it can be removed from the inventory
                        // send the modified world back to set the global world object
                    } else {
                        callback(undefined);
                    }
                }
            } else {
                console.log('room.uses[0] does not exists');
                callback(undefined);
            }
        }
    }

    //this method take the item from the inventoryItem once you use it.  this is different from take item where it takes it from the world
    removeItem(inventoryItem, item) {
        let result = [];
        for (let i = 0; i < inventoryItem.length; i++) {
            if (inventoryItem[i] !== item) {
                result.push(inventoryItem[i]);
            }
        }
        return result;
    }
}

module.exports.Inventory = Inventory;