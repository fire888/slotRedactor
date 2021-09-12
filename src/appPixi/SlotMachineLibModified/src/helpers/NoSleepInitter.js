import NoSleep from 'nosleep.js'

export class NoSleepIniter {
    constructor () {
        const noSleep = new NoSleep();
        function enableNoSleep () {
            noSleep.enable();
            document.removeEventListener('touchstart', enableNoSleep, false);
        }
        document.addEventListener('touchstart', enableNoSleep, false);
    }
}