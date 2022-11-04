import { DialogueManager } from "../../../main.js";

export const UpdateDialogueBox = (type, payload) => {
    switch (type) {
        case "INIT":
            DialogueManager.elements.dialogueBox.classList = ["dialogue-box box-normal dialogue-close"]
            break;
        case "ADD":
            DialogueManager.elements.dialogueBox.classList.add(payload)
            break;
        case "UPDATE":
            DialogueManager.elements.dialogueBox.classList.replace(payload.current, payload.next)
            break;
        case "DELETE":
            DialogueManager.elements.dialogueBox.classList.remove(payload)
            break;
        default:
            console.error("invalid type")
            break;
    }
}