import { Component } from "../webframe/component.js";
import { Button } from "../webframe/components/button.js";
import { ClassObserver } from "../webframe/components/classobserver.js";
import { Input } from "../webframe/components/input.js";
import { Observer } from "../webframe/components/observer.js";
import { Wire } from "../webframe/wire.js";
const webframe = document.querySelector('webframe');
class Demo extends Component {
    constructor() {
        super();
        const inputWire = new Wire("");
        const upperCaseWire = inputWire.map((value) => value.toUpperCase());
        const classObserverWire = new Wire("light");
        this.template `
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
    onPostRender() { }
    onRemove() { }
}
new Demo().register(webframe);
