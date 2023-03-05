type ComponentReference = {
    component?: Component;
    parentHook: HTMLElement;
}
export abstract class Component {
    private static _idCounter = 0;
    public readonly id: string;

    protected __unanchored = false; // used for pseudo components

    private rendered = false;
    private container?: HTMLElement;
    private _template?: string[] | TemplateStringsArray;
    private _children?: (Component | string)[];
    protected parent?: Component;

    public constructor(id = `webframe-component-${Component._idCounter++}`) {
        this.id = id;
    }

    public template(strings: string[] | TemplateStringsArray, ...values: (Component | string)[]) {
        this._template = strings;
        this._children = values;

        // expect the number of children to be one less than the number of strings
        if (this._children.length !== this._template.length - 1) {
            throw new Error("Invalid template");
        }
    }

    public register(parent: Element | null) {
        if (parent === null) {
            throw new Error("Parent element not found");
        }
        this._render(parent as HTMLElement);
    }


    private _render(parent: HTMLElement | ComponentReference): void {
        if(this.rendered) {
            throw new Error("Component already rendered");
        }
        
        if(parent instanceof HTMLElement) {
            const container = document.createElement("webframe-component");
            container.id = this.id;
            parent.appendChild(container);
            parent = {parentHook: container};
        }

        this.container = parent.parentHook;

        // make sure template() has been called
        if (!this._template || !this._children) {
            throw new Error("Template not defined");
        }

        // prepare the template with component containers
        const template = this._template.map((string, index) => {
            // @ts-ignore
            if (index === this._template.length - 1) {
                return string;
            }
            const child = this._children![index];
            if(typeof child === "string") {
                return string + this._children![index];
            }
            if(child.__unanchored) {
                // render right here
                if(!child._template) {	
                    throw new Error("Unanchored components must have a template at this point");
                }
                if(child._template.length > 1) {
                    throw new Error("Unanchored components cannot have more than one template string");
                }
                return string + child._template[0];
            }

            // @ts-ignore
            return string + `<webframe-component id="${this._children![index].id}"></webframe-component>`;
        }).join("");

        // render the template
        parent.parentHook.innerHTML = template;

        // render the children
        this._children.forEach((child, index) => {
            if(typeof child === "string") {
                return;
            }
            if(!child.__unanchored) {
                child._render({
                    parentHook: (parent as ComponentReference ).parentHook.querySelector(`webframe-component[id="${(this._children![index] as Component).id}"]`) as HTMLElement,
                    component: this
                });
            }
            child.parent = this;
            child.onPostRender!();
        });


    }

    abstract onPostRender?(): void;
    abstract onRemove?(): void;

    readonly remove = () => {
        this.onRemove!();
        this.container?.remove();
    }
}
