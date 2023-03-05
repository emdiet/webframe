export class Wire {
    listeners = new Map();
    desrtroyListeners = new Map();
    static idCounter = 0;
    lastMessage;
    open = true;
    constructor(message) {
        if (message) {
            this.lastMessage = message;
        }
    }
    send(message) {
        if (!this.open) {
            throw new Error("Wire is closed");
        }
        this.lastMessage = message;
        this.listeners.forEach(listener => listener(message));
        console.log("fired");
    }
    listen(listener, destroyListener) {
        if (!this.open) {
            throw new Error("Wire is closed");
        }
        const id = "wire-" + Wire.idCounter++;
        this.listeners.set(id, listener);
        if (destroyListener) {
            this.desrtroyListeners.set(id, destroyListener);
        }
        return id;
    }
    unlisten(listenerReference) {
        if (!this.open) {
            throw new Error("Wire is closed");
        }
        this.listeners.delete(listenerReference);
        this.desrtroyListeners.delete(listenerReference);
    }
    destroy() {
        this.desrtroyListeners.forEach(destroyListener => destroyListener());
        this.listeners.clear();
        this.desrtroyListeners.clear();
    }
    getLatestMessage() {
        return this.lastMessage;
    }
    map(transform) {
        const wire = new Wire();
        const listenerReference = this.listen((message) => {
            wire.send(transform(message));
        }, () => {
            wire.destroy();
        });
        wire.desrtroyListeners.set("map-constructor", () => {
            this.unlisten(listenerReference);
        });
        return wire;
    }
}
