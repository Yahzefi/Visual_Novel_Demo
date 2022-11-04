import { DialogueManager } from "../../../main.js";

export const UpdateSpeakerText = (type, payload) => {
    switch (type) {
        case "INIT":
            DialogueManager.elements.speakerText.classList = ["default-speaker speakerText-default"]
            break;
        case "ADD":
            DialogueManager.elements.speakerText.classList.add(payload)
            break;
        case "UPDATE":
            DialogueManager.elements.speakerText.classList.replace(payload.current, payload.next)
            break;
        case "DELETE":
            DialogueManager.elements.speakerText.classList.remove(payload)
            break;
        default:
            console.error("invalid type")
            break;
    }
}