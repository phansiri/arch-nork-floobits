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
        if (inventoryItem.length === 0 || inventoryItem === undefined) {
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
                    room.items[i] = undefined;
                } else {
                    callback(undefined);
                }
            }
        } else {
            callback(undefined);
        }
    }

    useItem(item, room, inventoryItem, callback) {
        if (inventoryItem.length !== 0 && room.uses[0] && room.uses[0].effect.consumed === false) { // if room.uses exist in obj
            for (let useIndex = 0; useIndex < room.uses.length; useIndex++) {
                if (room.uses[useIndex].item === item && room.uses[useIndex].effect.consumed !== true) {
                    room.uses[useIndex].effect.consumed = true;
                    callback(room.uses[useIndex].item); //item is used
                } else {
                    callback(undefined); //item cannot be used here
                }
            }
        } else {
            callback(undefined); //item does not exist or has already been used
        }
    }

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