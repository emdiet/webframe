import { Component } from "../webframe/component.js";
import { Button } from "../webframe/components/button.js";
import { ClassObserver } from "../webframe/components/classobserver.js";
import { Input } from "../webframe/components/input.js";
import { Observer } from "../webframe/components/observer.js";
import { Wire } from "../webframe/wire.js";

// grab the webframe element
const webframe = document.querySelector('webframe');

// create a new component
class Demo extends Component {
    public constructor() {
        super();

        const inputWire = new Wire<string>("");
        const upperCaseWire = inputWire.map((value) => value.toUpperCase());
        const classObserverWire = new Wire<string>("light");

        this.template`
            <div ${new ClassObserver(classObserverWire)}>
                <h2>this is a demo component</h2>
                ${new Input(inputWire, "hello1", "placholderA")}
                ${new Input(inputWire, "hello2", "placehoderB")}
                ${new Observer(inputWire)}
                ${new Observer(upperCaseWire)}

                <br>

                ${new Button(inputWire, {
                    text: "buttonAText",
                    signal: "buttonASignal"
                })}
                ${new Button(inputWire, {
                    text: "buttonBText",
                    signal: "buttonBSignal"
                })}
                ${new Button(classObserverWire, {
                    text: "classToggle",
                    signal: (value) => value === "light" ? "dark" : "light"
                })}
                ${new Observer(classObserverWire)}


            </div>
        `;
    }

    onPostRender(): void {}
    onRemove(): void {}
}

// register the component
new Demo().register(webframe);