import { Component } from "./component.js";


export abstract class Prefab extends Component {
    private content: HTMLElement;
    protected constructor(template: HTMLElement) {
        super();

        

        // make sure the template is a webframe tag
        if (template.tagName !== "WEBFRAME") {
            throw new Error("Prefab template must be a webframe tag");
        }

        this.content = template;

        (this as any).rendered = true;
        (this as any).container = template.parentElement;

        this.transform(this.content);
    }

    abstract transform(priorContent : HTMLElement): void;


    static register(name: string){
        
        window.addEventListener("load", () => {
            // find all the webframe tags with the given class name
            const templates = document.querySelectorAll(`webframe.${name}`);
            templates.forEach((template) => {
                // create the component
                // @ts-ignore
                const component = new this(template);

                template.classList.add("loaded");

                // when the template is removed, remove the component

                const oldRemove = template.remove;
                template.remove = () => {
                    oldRemove.call(template);
                    component.onRemove();
                }
            });
        });
        
    }
}