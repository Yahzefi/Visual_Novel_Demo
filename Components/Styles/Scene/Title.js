import { SceneManager } from "../../../main.js";

export const UpdateTitle = (type, payload) => {
    switch (type) {
        case "INIT":
            SceneManager.elements.sceneTitle.classList = ["scene-title"]
            break;
        case "ADD":
            SceneManager.elements.sceneTitle.classList.add(payload)
            break;
        case "UPDATE":
            SceneManager.elements.sceneTitle.classList.replace(payload.current, payload.next)
            break;
        case "DELETE":
            SceneManager.elements.sceneTitle.classList.remove(payload)
            break;
        default:
            console.error("invalid type")
            break;
    }
}