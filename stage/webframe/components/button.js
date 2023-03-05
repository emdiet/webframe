import { Component } from "../component.js";
export class Button extends Component {
    wire;
    options;
    buttonElement;
    constructor(wire, options) {
        super();
        this.wire = wire;
        this.options = options;
        this.template `
            <button>
                ${options.text || "button"}
            </button>
        `;
    }
    onPostRender() {
        this.buttonElement = this.container.querySelector("button");
        if (!this.buttonElement) {
            throw new Error("Button element not found (postRender)");
        }
        this.buttonElement.addEventListener("click", () => {
            if (typeof this.options.signal === "function") {
                this.wire.send(this.options.signal(this.wire.getLatestMessage() || ""));
            }
            else {
                this.wire.send(this.options.signal || "buttonClicked");
            }
        });
    }
    onRemove() { }
}
