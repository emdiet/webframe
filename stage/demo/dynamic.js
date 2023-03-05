import { Component } from "../webframe/component.js";
export class Dynamic extends Component {
    constructor() {
        super();
        this.template `
            <div>
                <h2>this is a dynamic component</h2>
            </div>
        `;
    }
    onPostRender() { }
    onRemove() { }
}
