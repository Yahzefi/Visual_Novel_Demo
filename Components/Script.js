// Managers
import { DataManager, ChoiceManager, APIManager } from "../main.js";

import { StartEvent } from "../Events/Event.js";

export class Script {
    constructor () {
        this.data = [];
        this.currentLine = 0;
        this.currentSpeaker = null;
        this.nextSpeaker = null;
    }

    FetchLines () {
        return new Promise ( async (resolve) => {
            this.data = await APIManager.Start("SCRIPT");
            await StartEvent("SCENE", { type: "UPDATE_TITLES", eventData: await APIManager.Start("SCENE") });
            resolve();
        })
    }

    NextLine (line) {
        return new Promise ( async (resolve) => {
            let text, speaker, character; // main/primary line properties
            let activeCharacter; // pulls from Data Manager
            let speakerOptions, characterData, characterOptions, options; // primary property's options
            let sceneOptions, choiceOptions, promptOptions; // line options
            let updateScene, updateBox; // scene options
            let addCharacter, moveCharacter, changeExpression; // character options

            text = line?.text;
            speaker = line?.speaker;

            activeCharacter =  line.character != null ? DataManager.activeCharacters.find((entry) => entry.name === line.character.name) : null;
            
            
            if (line.character != null && !line.character.data.isNew && activeCharacter != null) {
                // change options to line.character.options
                activeCharacter.options =  line.character.options !== activeCharacter.options ? line.character.options : activeCharacter.options;
                activeCharacter.data.isNew = false;
                await DataManager.UpdateActiveCharacters(activeCharacter);
            }
            
            character =  line.character != null && line.character.data.isNew ? line.character : activeCharacter != null ? activeCharacter : null;
            options = line?.options;

            this.nextSpeaker = this.currentSpeaker === speaker ? null : speaker;

            speakerOptions = speaker?.options;
            characterData = character != null ? character.data : null;
            characterOptions = character != null ? character.options : null;

            sceneOptions = options?.scene;
            choiceOptions = options?.choice;
            promptOptions = options?.prompt;

            updateScene = sceneOptions?.updateScene;
            updateBox = sceneOptions?.updateBox;

            addCharacter = character != null ? characterOptions?.addCharacter:  null;
            moveCharacter = character != null ? characterOptions?.moveCharacter : null;

            changeExpression = characterOptions != null ? characterOptions.changeExpression : null;

            changeExpression != null && await StartEvent("CHARACTER", { type: "UPDATE_EXPRESSION", eventData: { character: character, data: { current: changeExpression.current, next: line?.character?.options?.changeExpression.next } } })

            if (speaker != null) {
                if (characterData != null && characterData.alias != speaker.alias) {
                    await StartEvent("CHARACTER", { type: "UPDATE_ALIAS", eventData: { character: character, data: { current: this.currentSpeaker, next: this.nextSpeaker } } })
                }
                if (this.currentSpeaker != speaker && this.nextSpeaker != null) {
                    await StartEvent("DIALOGUE", { type: "CHANGE_SPEAKER", eventData: { current: this.currentSpeaker, next: this.nextSpeaker } })
                    this.currentSpeaker = this.nextSpeaker;
                    this.nextSpeaker = null;
                }
            }
            
            ChoiceManager.isActive && resolve();

            StartEvent("DIALOGUE", { type: "TALK", eventData: text })
            .then ( async () => {
                // prompt options
                promptOptions != null && await StartEvent("DIALOGUE", { type: "PROMPT", eventData: promptOptions })
                // choice options
                if (choiceOptions != null) {
                    await StartEvent("DIALOGUE", { type: "CHOICE", eventData: choiceOptions })
                }
                // character options
                if (character != null) {
                    characterData == null && console.error("Error: character name not assigned.")
                    if (characterData.isNew) {
                        // DataManager.activeCharacters.push(character);
                        await StartEvent("CHARACTER", { type: "INIT", eventData: { character: character, data: null } })
                    }
                    if (characterOptions != null) {
                        addCharacter != null && await StartEvent("CHARACTER", { type: "ENTER_SCENE", eventData: { character: character, data: addCharacter } })
                        moveCharacter != null && await StartEvent("CHARACTER", { type: "MOVE", eventData: { character: character, data: moveCharacter } })
                    }
                    
                    await DataManager.UpdateActiveCharacters(character)
                }
                // scene options
                if (sceneOptions != null) {
                    updateScene != null && await StartEvent("SCENE", { type: "NEXT_SCENE", eventData: { scene: updateScene, box: updateBox } })
                }
            })
            .then( () => {
                this.currentLine++
                resolve();
            })
        })
    }
}