export class EventEmitter {
    constructor() {
        this.events = {}
    }
    
    emit(eventName, data) {
        if (!this.events[eventName]) return;

        for (let i = 0; i < this.events[eventName].length; i++) {
            this.events[eventName][i](data)
        }
    }
    
    subscribe(eventName, fn) {
        !this.events[eventName] && (this.events[eventName] = [])
        this.events[eventName].push(fn)
        return () =>
            this.events[eventName] = this.events[eventName].filter(eventFn => fn !== eventFn)
    }
    
    showEvents () {
        console.log(this.events)
    }
}