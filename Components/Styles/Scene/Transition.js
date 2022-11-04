import { SceneManager } from "../../../main.js";

export const UpdateTransition = (type, payload) => {
    switch (type) {
        case "INIT":
            SceneManager.elements.sceneTransition.classList = ["scene-transition"]
            break;
        case "ADD":
            SceneManager.elements.sceneTransition.classList.add(payload)
            break;
        case "UPDATE":
            SceneManager.elements.sceneTransition.classList.replace(payload.current, payload.next)
            break;
        case "DELETE":
            SceneManager.elements.sceneTransition.classList.remove(payload)
            break;
        default:
            console.error("invalid type")
            break;
    }
}