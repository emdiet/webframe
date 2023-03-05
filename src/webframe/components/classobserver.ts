import { Component } from "../component.js";
import { ListenerReference, Wire } from "../wire.js";

export class ClassObserver extends Component{
    private static classObserverCount = 0;
    private classObserverId = 'class-observer-' + ClassObserver.classObserverCount++;
    private elementReference?: HTMLElement;
    private listenerReference?: ListenerReference;
    private class$: Wire<string>;
    private lastClass: string = "";

    
    public constructor(class$: Wire<string>) {
        super();
        this.__unanchored = true;
        this.template([`
            id="${this.classObserverId}"
        `]);
        this.class$ = class$;
    }

    onPostRender(): void {
        if(!this.parent){
            throw new Error("Parent not found");
        }
        this.elementReference = (this.parent as any).container.querySelector('#' + this.classObserverId);
        if(!this.elementReference) {
            throw new Error("Element reference not found (pseudoComponent postRender)");
        }
        this.elementReference.classList.add(this.class$.getLatestMessage() || "");
        
        this.listenerReference = this.class$.listen((value) => {
            if(!this.elementReference) {
                throw new Error("Element reference not found (pseudoComponent write)");
            }
            this.elementReference.classList.toggle(this.lastClass);
            this.elementReference.classList.toggle(value);
            this.lastClass = value;
        });
        this.elementReference.classList.add(this.class$.getLatestMessage() || "");
        this.lastClass = this.class$.getLatestMessage() || "";

    }
    onRemove(): void {
        if(!this.listenerReference) {
            throw new Error("Listener reference not found");
        }
        this.class$.unlisten(this.listenerReference);
    }

}