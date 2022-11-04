import { DialogueManager } from "../../../main.js"

export const UpdateDialogueContainer = (type, payload) => {
    switch (type) {
        case "INIT":
            DialogueManager.elements.dialogueContainer.classList = ["dialogue-container"];
            break;
        case "ADD":
            DialogueManager.elements.dialogueContainer.classList.add(payload)
            break;
        case "UPDATE":
            DialogueManager.elements.dialogueContainer.classList.replace(payload.current, payload.next)
            break;
        case "DELETE":
            DialogueManager.elements.dialogueContainer.classList.remove(payload)
            break;
        default:
            console.error("invalid type")
            break;
    }
}