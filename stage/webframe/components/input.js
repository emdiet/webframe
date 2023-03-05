import { Component } from "../component.js";
export class Input extends Component {
    wire;
    listenerReference;
    inputElement;
    constructor(wire, value = "", placeholder = "") {
        super();
        this.wire = wire;
        this.template `
            <input placeholder="${placeholder}" value=${value}>
                
            </input>
        `;
    }
    onPostRender() {
        this.inputElement = this.container.querySelector("input");
        if (!this.inputElement) {
            throw new Error("Input element not found (postRender)");
        }
        this.listenerReference = this.wire.listen((value) => {
            if (!this.inputElement) {
                throw new Error("Input element not found (write)");
            }
            this.inputElement.value = value;
            console.log("Input value changed to: " + value);
        });
        this.inputElement.addEventListener("input", (event) => {
            if (!this.inputElement) {
                throw new Error("Input element not found (input)");
            }
            this.wire.send(this.inputElement.value);
        });
    }
    onRemove() {
        if (!this.listenerReference) {
            throw new Error("Listener reference not found");
        }
        this.wire.unlisten(this.listenerReference);
    }
}
