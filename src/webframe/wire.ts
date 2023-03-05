export type ListenerReference = string;

export class Wire<T>{
    private listeners: Map<ListenerReference, (message: T)=>void> = new Map();
    private desrtroyListeners: Map<ListenerReference, ()=>void> = new Map();
    private static idCounter = 0;
    private lastMessage?: T;
    private open = true;

    constructor(message?: T) {
        if(message) {
            this.lastMessage = message;
        }
    }

    send(message: T): void {
        if(!this.open) {
            throw new Error("Wire is closed");
        }
        this.lastMessage = message;
        this.listeners.forEach(listener => listener(message));
        console.log("fired");
    }
    listen(listener: (message: T) => void, destroyListener?: ()=>void): ListenerReference {
        if(!this.open) {
            throw new Error("Wire is closed");
        }
        const id = "wire-"+Wire.idCounter++;
        this.listeners.set(id, listener);
        if(destroyListener) {
            this.desrtroyListeners.set(id, destroyListener);
        }
        return id;
    }
    unlisten(listenerReference: ListenerReference): void {
        if(!this.open) {
            throw new Error("Wire is closed");
        }
        this.listeners.delete(listenerReference);
        this.desrtroyListeners.delete(listenerReference);
    }
    destroy(): void {
        this.desrtroyListeners.forEach(destroyListener => destroyListener());
        this.listeners.clear();
        this.desrtroyListeners.clear();

    }

    getLatestMessage(): T | undefined {
        return this.lastMessage;
    }

    map<U>(transform: (message: T)=>U): Wire<U> {
        const wire = new Wire<U>();
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