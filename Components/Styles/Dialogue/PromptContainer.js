import { DialogueManager } from "../../../main.js";

export const UpdatePromptContainer = (type, payload) => {
    switch (type) {
        case "INIT":
            DialogueManager.elements.promptContainer.classList = ["prompt-container"]
            break;
        case "ADD":
            DialogueManager.elements.promptContainer.classList.add(payload)
            break;
        case "UPDATE":
            DialogueManager.elements.promptContainer.classList.replace(payload.current, payload.next)
            break;
        case "DELETE":
            DialogueManager.elements.promptContainer.classList.remove(payload)
            break;
        default:
            console.error("invalid type")
            break;
    }
}