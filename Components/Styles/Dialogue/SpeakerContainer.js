import { DialogueManager } from "../../../main.js";

export const UpdateSpeakerContainer = (type, payload) => {
    switch (type) {
        case "INIT":
            DialogueManager.elements.speakerContainer.classList = ["speaker-container speakerBackground-default"]
            break;
        case "ADD":
            DialogueManager.elements.speakerContainer.classList.add(payload)
            break;
        case "UPDATE":
            DialogueManager.elements.speakerContainer.classList.replace(payload.current, payload.next)
            break;
        case "DELETE":
            DialogueManager.elements.speakerContainer.classList.remove(payload)
            break;
        default:
            console.error("invalid type")
            break;
    }
}