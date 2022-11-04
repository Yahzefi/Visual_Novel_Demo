import { StartEvent } from "../Events/Event.js";
import { UpdateStyle } from "./Styles/Style.js";

export class Elements {
    constructor () {
        this.elementList = [{}];
    }

    init(initArr) {
        initArr.forEach((element) => this.updateList(element, "initElements"));
    }

    addElement (type, className, id, parent, category, textContent) {
        let newElement = document.createElement(type);
        className != null && newElement.setAttribute("class", className);
        id != null && newElement.setAttribute("id", id);
        if (textContent != null) { newElement.textContent = textContent; }
        this.updateList(newElement, category);
        if (parent != null) {
            document.getElementById(parent).appendChild(newElement);
        } else {
            document.getElementById("app").appendChild(newElement);
        }
    }

    removeElements (idArray) {
        let newArray = [];
        idArray.forEach((id) => {
            newArray = this.elementList.filter((element) => element.id !== id);
            this.elementList = newArray;
            document.getElementById(id).remove();
        })
    }

    updateList (newElement, categoryName) {
        this.elementList.push({
            element: newElement,
            id: newElement.id,
            category: categoryName
        })
    }

    toggleHide (payload) {
        return new Promise ( async (resolve) => {
            if (payload != null) {
                for (let i = 0; i < payload.length; i++) {
                    UpdateStyle(payload[i].type, { element: payload[i].element, type: payload[i].method.type, styles: payload[i].method.style })
                    payload[i].addPause != null && await StartEvent("SCENE", { type: "PAUSE", eventData: payload[i].addPause })
                }
                resolve();
            } else {
                console.error("parameter value is null.")
            }
        })
    }
}