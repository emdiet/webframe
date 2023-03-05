import { Component } from "../component.js";
export class ClassObserver extends Component {
    static classObserverCount = 0;
    classObserverId = 'class-observer-' + ClassObserver.classObserverCount++;
    elementReference;
    listenerReference;
    class$;
    lastClass = "";
    constructor(class$) {
        super();
        this.__unanchored = true;
        this.template([`
            id="${this.classObserverId}"
        `]);
        this.class$ = class$;
    }
    onPostRender() {
        if (!this.parent) {
            throw new Error("Parent not found");
        }
        this.elementReference = this.parent.container.querySelector('#' + this.classObserverId);
        if (!this.elementReference) {
            throw new Error("Element reference not found (pseudoComponent postRender)");
        }
        this.elementReference.classList.add(this.class$.getLatestMessage() || "");
        this.listenerReference = this.class$.listen((value) => {
            if (!this.elementReference) {
                throw new Error("Element reference not found (pseudoComponent write)");
            }
            this.elementReference.classList.toggle(this.lastClass);
            this.elementReference.classList.toggle(value);
            this.lastClass = value;
        });
        this.elementReference.classList.add(this.class$.getLatestMessage() || "");
        this.lastClass = this.class$.getLatestMessage() || "";
    }
    onRemove() {
        if (!this.listenerReference) {
            throw new Error("Listener reference not found");
        }
        this.class$.unlisten(this.listenerReference);
    }
}
