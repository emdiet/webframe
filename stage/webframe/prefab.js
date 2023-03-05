import { Component } from "./component.js";
export class Prefab extends Component {
    content;
    constructor(template) {
        super();
        if (template.tagName !== "WEBFRAME") {
            throw new Error("Prefab template must be a webframe tag");
        }
        this.content = template;
        this.rendered = true;
        this.container = template.parentElement;
        this.transform(this.content);
    }
    static register(name) {
        window.addEventListener("load", () => {
            const templates = document.querySelectorAll(`webframe.${name}`);
            templates.forEach((template) => {
                const component = new this(template);
                template.classList.add("loaded");
                const oldRemove = template.remove;
                template.remove = () => {
                    oldRemove.call(template);
                    component.onRemove();
                };
            });
        });
    }
}
