import { SceneManager } from "../../../main.js";

export const UpdateSceneContainer = (type, payload) => {
    switch (type) {
        case "INIT":
            SceneManager.elements.sceneContainer.classList = ["scene-container"]
            break;
        case "ADD":
            SceneManager.elements.sceneContainer.classList.add(payload)
            break;
        case "UPDATE":
            SceneManager.elements.sceneContainer.classList.replace(payload.current, payload.next)
            break;
        case "DELETE":
            SceneManager.elements.sceneContainer.classList.remove(payload)
            break;
        default:
            console.error("invalid type")
            break;
    }
}