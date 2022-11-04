import { StartDialogueEvent } from "./Dialogue.js";
import { StartSceneEvent } from "./Scene.js";
import { StartCharacterEvent } from "./Character.js";

export const StartEvent = async (type, payload) => {
    switch (type) {
        case "DIALOGUE":
            await StartDialogueEvent(payload.type, payload.eventData);
            break;
        case "SCENE":
            await StartSceneEvent(payload.type, payload.eventData)
            break;
        case "CHARACTER":
            await StartCharacterEvent(payload.type, payload.eventData)
            break;
        default:
            break;
    }
}