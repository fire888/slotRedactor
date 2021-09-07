var SPECTOR = require("spectorjs");

export class SpectorJsIniter {
    constructor () {
        var spector = new SPECTOR.Spector();
        spector.displayUI();
    }
}