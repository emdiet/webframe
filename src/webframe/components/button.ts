import { Component } from "../component.js";
import { Wire } from "../wire.js";

export class Button extends Component {
    private buttonElement?: HTMLButtonElement;
    public constructor(
        private wire: Wire<string>,
        private options: {
            text?: string;
            signal?: string | ((value: string) => string);
        }
    ) {
        super();
        this.template`
            <button>
                ${options.text || "button"}
            </button>
        `;
    }

    onPostRender(): void {
        this.buttonElement = (this as any).container.querySelector("button");
        if (!this.buttonElement) {
            throw new Error("Button element not found (postRender)");
        }

        this.buttonElement.addEventListener("click", () => {
            if(typeof this.options.signal === "function") {
                this.wire.send(this.options.signal(this.wire.getLatestMessage() || ""));
            } else {
                this.wire.send(this.options.signal || "buttonClicked");
            }
        });

    }
    onRemove(): void {}
}