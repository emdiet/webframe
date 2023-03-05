import { Component } from "../component.js";
import { ListenerReference, Wire } from "../wire.js";

export class Observer extends Component {
    private wire: Wire<string>;
    private listenerReference?: ListenerReference;
    private observerElement?: HTMLElement;

    constructor(wire: Wire<string>) {
        super();
        this.wire = wire;

        this.template`
            <observer>

            </observer>
        `;
    }

    onPostRender(): void {
        // @ts-ignore
        this.observerElement = this.container.querySelector("observer");
        if(!this.observerElement) {
            throw new Error("Observer element not found (postRender)");
        }

        this.listenerReference = this.wire.listen((value) => {
            if(!this.observerElement) {
                throw new Error("Observer element not found (write)");
            }
            this.observerElement.innerHTML = value;
        });
        this.observerElement.innerHTML = this.wire.getLatestMessage() || "";
    }

    onRemove(): void {
        if(!this.listenerReference) {
            throw new Error("Listener reference not found");
        }
        this.wire.unlisten(this.listenerReference);
    }



}