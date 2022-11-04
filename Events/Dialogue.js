import { Line } from "../Components/Line.js";
import { ChoiceManager, DataManager, DialogueManager, ScriptManager } from "../main.js";

export const StartDialogueEvent = (type, payload) => {
    return new Promise ( async (resolve) => {
        switch (type) {
            case "PROMPT":
                let response = prompt(payload.message, payload.placeholder);
                if (payload.placeholder === "Jay") {
                    DataManager.playerInfo.name = response;
                }

                resolve();
                break;
            case "CHOICE":
                let runEvent = () => {
                    return new Promise ( async (resolve) => {
                        setTimeout( async () => {
                            if (!ChoiceManager.isActive) {
                                await ChoiceManager.Init(payload);
                                await runEvent();
                                resolve();
                            } else {
                                if (ChoiceManager.isWaiting) {
                                    await runEvent();
                                    resolve()
                                } else {
                                    await ChoiceManager.SelectChoice();
                                    !ChoiceManager.isActive ? resolve() : await runEvent();
                                    resolve();
                                }
                            }
                        }, 500)
                        
                    })
                }
                
                !ChoiceManager.hasStarted && await runEvent();

                resolve();
                break;
            case "TALK": 
                DialogueManager.data.isWaiting = true;
                await DialogueManager.Talk(payload)
                resolve();
                break;
            case "CHANGE_SPEAKER":
                DialogueManager.ChangeSpeaker(payload.current, payload.next);
                resolve();
                break;
            case "RESIZE_BOX":
                DialogueManager.ResizeBox(payload)
                resolve();
                break;
            default:
                resolve();
                break;
        }
    })
}