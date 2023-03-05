import { Component } from "../component.js";
export class Observer extends Component {
    wire;
    listenerReference;
    observerElement;
    constructor(wire) {
        super();
        this.wire = wire;
        this.template `
            <observer>

            </observer>
        `;
    }
    onPostRender() {
        this.observerElement = this.container.querySelector("observer");
        if (!this.observerElement) {
            throw new Error("Observer element not found (postRender)");
        }
        this.listenerReference = this.wire.listen((value) => {
            if (!this.observerElement) {
                throw new Error("Observer element not found (write)");
            }
            this.observerElement.innerHTML = value;
        });
        this.observerElement.innerHTML = this.wire.getLatestMessage() || "";
    }
    onRemove() {
        if (!this.listenerReference) {
            throw new Error("Listener reference not found");
        }
        this.wire.unlisten(this.listenerReference);
    }
}
