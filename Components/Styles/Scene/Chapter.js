import { SceneManager } from "../../../main.js";

export const UpdateChapter = (type, payload) => {
    switch (type) {
        case "INIT":
            SceneManager.elements.sceneChapter.classList = ["scene-chapter"]
            break;
        case "ADD":
            SceneManager.elements.sceneChapter.classList.add(payload)
            break;
        case "UPDATE":
            SceneManager.elements.sceneChapter.classList.replace(payload.current, payload.next)
            break;
        case "DELETE":
            SceneManager.elements.sceneChapter.classList.remove(payload)
            break;
        default:
            console.error("invalid type")
            break;
    }
}