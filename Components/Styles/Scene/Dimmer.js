import { SceneManager } from "../../../main.js";

export const UpdateDimmer = (type, payload) => {
    switch (type) {
        case "INIT":
            SceneManager.elements.sceneDimmer.classList = ["scene-dimmer"]
            break;
        case "ADD":
            SceneManager.elements.sceneDimmer.classList.add(payload)
            break;
        case "UPDATE":
            SceneManager.elements.sceneDimmer.classList.replace(payload.current, payload.next)
            break;
        case "DELETE":
            SceneManager.elements.sceneDimmer.classList.remove(payload)
            break;
        default:
            console.error("invalid type")
            break;
    }
}