import { SceneManager } from "../../../main.js";

export const UpdateBackground = (type, payload) => {
    switch (type) {
        case "INIT":
            SceneManager.elements.sceneBackground.classList = ["dreamscape-background scene-background"]
            break;
        case "ADD":
            SceneManager.elements.sceneBackground.classList.add(payload)
            break;
        case "UPDATE":
            SceneManager.elements.sceneBackground.classList.replace(payload.current, payload.next)
            break;
        case "DELETE":
            SceneManager.elements.sceneBackground.classList.remove(payload)
            break;
        default:
            console.error("invalid type")
            break;
    }
}