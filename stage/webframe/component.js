export class Component {
    static _idCounter = 0;
    id;
    __unanchored = false;
    rendered = false;
    container;
    _template;
    _children;
    parent;
    constructor(id = `webframe-component-${Component._idCounter++}`) {
        this.id = id;
    }
    template(strings, ...values) {
        this._template = strings;
        this._children = values;
        if (this._children.length !== this._template.length - 1) {
            throw new Error("Invalid template");
        }
    }
    register(parent) {
        if (parent === null) {
            throw new Error("Parent element not found");
        }
        this._render(parent);
    }
    _render(parent) {
        if (this.rendered) {
            throw new Error("Component already rendered");
        }
        if (parent instanceof HTMLElement) {
            const container = document.createElement("webframe-component");
            container.id = this.id;
            parent.appendChild(container);
            parent = { parentHook: container };
        }
        this.container = parent.parentHook;
        if (!this._template || !this._children) {
            throw new Error("Template not defined");
        }
        const template = this._template.map((string, index) => {
            if (index === this._template.length - 1) {
                return string;
            }
            const child = this._children[index];
            if (typeof child === "string") {
                return string + this._children[index];
            }
            if (child.__unanchored) {
                if (!child._template) {
                    throw new Error("Unanchored components must have a template at this point");
                }
                if (child._template.length > 1) {
                    throw new Error("Unanchored components cannot have more than one template string");
                }
                return string + child._template[0];
            }
            return string + `<webframe-component id="${this._children[index].id}"></webframe-component>`;
        }).join("");
        parent.parentHook.innerHTML = template;
        this._children.forEach((child, index) => {
            if (typeof child === "string") {
                return;
            }
            if (!child.__unanchored) {
                child._render({
                    parentHook: parent.parentHook.querySelector(`webframe-component[id="${this._children[index].id}"]`),
                    component: this
                });
            }
            child.parent = this;
            child.onPostRender();
        });
    }
    remove = () => {
        this.onRemove();
        this.container?.remove();
    };
}
