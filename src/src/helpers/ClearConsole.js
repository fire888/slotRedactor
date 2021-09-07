export class ClearConsole {
    constructor () {
        if (!window.console) window.console = {};
        const methods = [
            "log",
            //  "debug",
            //  "warn",
            //  "info"
        ]
        for (let i = 0; i < methods.length; i++) {
            console[methods[i]] = function(){}
        }
    }
}