import { DataManager } from "../main.js";

export const StartCharacterEvent = (type, payload) => {
    return new Promise ( async (resolve) => {
        switch (type) {
            case "INIT":
                payload.character.Init();
                resolve();
                break;
            case "UPDATE_ALIAS":
                payload.character.UpdateAlias(payload.data)
                resolve();
                break;
            case "ENTER_SCENE":
                await payload.character.EnterScene(payload.data);
                resolve();
                break;
            case "MOVE":
                await payload.character.Move(payload.data);
                resolve();
                break;
            case "UPDATE_EXPRESSION":
                await payload.character.UpdateExpression(payload.data);
                resolve();
                break;
            default:
                resolve();
                break;
        }
    })
}