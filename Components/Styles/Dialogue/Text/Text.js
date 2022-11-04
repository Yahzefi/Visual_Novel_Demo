import { DialogueManager } from "../../../../main.js";

export const UpdateTextContent = (type, index, payload) => {
    switch (type) {
        case "INIT":
            DialogueManager.data.currentText[index].classList = ["text-normal"];
            break;
        case "ADD":
            payload.forEach((style) => DialogueManager.data.currentText[index].classList.add(style))
            break;
        case "UPDATE":
            DialogueManager.data.currentText[index].classList.replace(payload.current, payload.next);
            break;
        case "DELETE":
            DialogueManager.data.currentText[index].classList.remove(payload);
            break;
        default:
            console.error("invalid type")
            break;
    }
}