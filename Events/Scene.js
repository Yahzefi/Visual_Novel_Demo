import { SceneManager } from "../main.js";

export const StartSceneEvent = (type, payload) => {
    return new Promise ( async (resolve) => {
        switch (type) {
            case "PAUSE":
                setTimeout(resolve, payload)
                break;
            case "UPDATE_TITLES":
                await SceneManager.UpdateTitles(payload.allegory, payload.tale)
                resolve();
                break;
            case "NEXT_SCENE":
                await SceneManager.NextScene(payload)
                resolve();
                break;
            default:
                resolve();
                break;
        }
    })
}