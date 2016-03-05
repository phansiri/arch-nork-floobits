/**
 * Created by lit_phansiri on 2/26/16.
 */

"use strict";

class Inventory {
    /**
     * created a new Inventory object.
     * @constructor
     * @param {object} navigator - allows the inventory to modify the world.
     */
    constructor(navigator) {
        this.nav = navigator;
    }

    /**
     * returns the list of items in the inventory
     * @param {array} inventoryItem - current users inventory
     * @return inventory list as a formatted string
     */
    inventoryList(inventoryItem) {
        if (inventoryItem.length === 0 || inventoryItem === undefined) {
            return "empty"; // no items found in the inventory
        } else {
            var result = inventoryItem[0];
            for (var i = 1; i < inventoryItem.length; i++) {
                result = result + ', ' + inventoryItem[i]; // adding another item to the result string
            }
            return result;
        }
    }

    /**
     * takes an item from the current room.
     * @param {object} room - the current room the player is in
     * @param {string} item - the item the player it trying to take
     * @callback sends back the item used.
     */
    takeItem(room, item, callback) {
        if (room.items) {
            for (let i = 0; i < room.items.length; i++) {
                if (item === room.items[i]) {
                    callback(room.items[i]);
                    room.items[i] = undefined; // makes it so that the item cannot be grabbed again.
                } else {
                    callback(undefined); // item not found
                }
            }
        } else {
            callback(undefined); // no items in the room
        }
    }

    /**
     * uses the specified item
     * @param {string} item - the item the player plans on using
     * @param {object} room - the current room the player is in
     * @param {array} inventoryItem - the list that holds items
     * @callback sends back the item used
     */
    useItem(item, room, inventoryItem, callback) {
        if (inventoryItem.length !== 0 && room.uses[0] && room.uses[0].effect.consumed === false) { // if room.uses exist in obj
            for (let useIndex = 0; useIndex < room.uses.length; useIndex++) {
                if (room.uses[useIndex].item === item && room.uses[useIndex].effect.consumed !== true) {
                    room.uses[useIndex].effect.consumed = true; // this item can no longer be used
                    callback(room.uses[useIndex].item); //item is used
                } else {
                    callback(undefined); //item cannot be used here
                }
            }
        } else {
            callback(undefined); //item does not exist or has already been used
        }
    }

    /**
     * removes the item from the players inventory
     * @param {array} inventoryItem - current users inventory
     * @param {string} item - item to be removed
     * @return resulting inventory
     */
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

/**
 * Exports the class Inventory
 * @type {object} Inventory - Inventory commands besides navigation
 */
module.exports.Inventory = Inventory;