import { DialogueManager } from "../../../main.js";

export const UpdatePromptText = (type, payload) => {
    switch (type) {
        case "INIT":
            DialogueManager.elements.promptText.classList = ["prompt-text"]
            break;
        case "ADD":
            DialogueManager.elements.promptText.classList.add(payload)
            break;
        case "UPDATE":
            DialogueManager.elements.promptText.classList.replace(payload.current, payload.next)
            break;
        case "DELETE":
            DialogueManager.elements.promptText.classList.remove(payload)
            break;
        default:
            console.error("invalid type")
            break;
    }
}