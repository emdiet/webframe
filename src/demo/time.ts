import { Prefab } from "../webframe/prefab.js";

class Time extends Prefab{
    private interval?: number;

    transform(priorContent: HTMLElement) {
        const time = document.createElement("time");
        time.innerText = new Date().toLocaleTimeString();
        priorContent.appendChild(time);

        this.interval = setInterval(() => {
            time.innerText = new Date().toLocaleTimeString();
        }, 1000);
    }

    onPostRender(): void {}

    onRemove(): void {
        clearInterval(this.interval);
    }


}
Time.register("Time");

console.log("heeeeya");