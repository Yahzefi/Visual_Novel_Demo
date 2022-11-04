import { DialogueManager } from "../../../../main.js";

export const UpdateTextContainer = (type, payload) => {
    switch (type) {
        case "INIT":
            DialogueManager.elements.dialogueText.classList = ["dText-normal"]
            break;
        case "ADD":
            DialogueManager.elements.dialogueText.classList.add(payload)
            break;
        case "UPDATE":
            DialogueManager.elements.dialogueText.classList.replace(payload.current, payload.next)
            break;
        case "DELETE":
            DialogueManager.elements.dialogueText.classList.remove(payload)
            break;
        default:
            console.error("invalid type")
            break;
    }
}