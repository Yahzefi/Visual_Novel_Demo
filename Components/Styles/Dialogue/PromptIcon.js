import { DialogueManager } from "../../../main.js";

export const UpdatePromptIcon = (type, payload) => {
    switch (type) {
        case "INIT":
            DialogueManager.elements.promptIcon.classList = ["prompt-icon"]
            break;
        case "ADD":
            DialogueManager.elements.promptIcon.classList.add(payload)
            break;
        case "UPDATE":
            DialogueManager.elements.promptIcon.classList.replace(payload.current, payload.next)
            break;
        case "DELETE":
            DialogueManager.elements.promptIcon.classList.remove(payload)
            break;
        default:
            console.error("invalid type")
            break;
    }
}