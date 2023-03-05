import { Component } from "../component.js";
import { Wire, ListenerReference } from "../wire.js";

export class Input extends Component {
    private wire: Wire<string>;
    private listenerReference?: ListenerReference;
    private inputElement?: HTMLInputElement;

    constructor(wire: Wire<string>, value: string = "", placeholder: string = "") {
        super();
        this.wire = wire;

        this.template`
            <input placeholder="${placeholder}" value=${value}>
                
            </input>
        `;
    }

    onPostRender(): void {
        // @ts-ignore
        this.inputElement = this.container.querySelector("input");
        if(!this.inputElement) {
            throw new Error("Input element not found (postRender)");
        }

        this.listenerReference = this.wire.listen((value) => {
            if(!this.inputElement) {
                throw new Error("Input element not found (write)");
            }
            this.inputElement.value = value;
            console.log("Input value changed to: " + value)
        });

        // @ts-ignore
        this.inputElement.addEventListener("input", (event: InputEvent) => {
            if(!this.inputElement) {
                throw new Error("Input element not found (input)");
            }
            this.wire.send(this.inputElement.value as string);
        } );
    }

    onRemove(): void {
        if(!this.listenerReference) {
            throw new Error("Listener reference not found");
        }
        this.wire.unlisten(this.listenerReference);
    }



}