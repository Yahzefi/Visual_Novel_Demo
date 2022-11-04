import { 
    Line, 
    Text,
    TextOptions,
    Speaker, 
    SpeakerOptions,
    LineOptions, 
    SceneOptions,
    PromptOptions,
    ChoiceOptions,
    UpdateScene,
    UpdateBox,
} from "../Components/Line.js";

import { 
    Character, 
    CharacterData, 
    CharacterOptions, 
    AddCharacter, 
    MoveCharacter,
    ChangeExpression 
} from "../Components/Character/Character.js";

export class ScriptAPI {
    constructor () {
        this.scene = {
            allegory: {
                id: 0,
                title: null
            },
            tale: {
                id: 0,
                title: null
            }
        };
        this.lineValidity = [];
        this.lineData = [];
        this.currentLines = [];
    }

    Start (type) {
        return new Promise ( async (resolve) => {
            let sceneData, currentScene;
            
            sceneData = await fetch("../API/Lines/Scene.json").then((res) => res.json()).then((data) => data)

            currentScene = { allegory: sceneData[this.scene.allegory.id].allegory, tale: sceneData[this.scene.tale.id].tale }

            this.currentLines = type === "SCRIPT" ? await this.FetchScript(currentScene.allegory, currentScene.tale) : this.currentLines;
            type === "SCENE" && await this.UpdateScene(currentScene.allegory, currentScene.tale);

            resolve(type === "SCRIPT" ? this.currentLines : type === "SCENE" ? currentScene : null);
        })
    }

    UpdateScene (allegory, tale) {
        return new Promise ( (resolve) => {
            // update scene info here
            this.scene.allegory.id = tale.isFinal ? allegory.id + 1 : allegory.id;
            this.scene.allegory.title = allegory.title;
            this.scene.tale.id = tale.isFinal ? 1 : tale.id + 1;
            this.scene.tale.title = tale.title;
            resolve();
        })
    }

    FetchScript (allegory, tale) {
        return new Promise ( async (resolve) => {
            let lines;
            let text, textOptions, speaker, speakerOptions, character, characterOptions, lineOptions, sceneOptions, choiceOptions, promptOptions;

            // array of mostly empty strings to quickly test specific sections of the chapter/tale
            // text = await fetch(`../API/Lines/Allegory_${allegory.id}/Tale_${tale.id}/Text/Test.json`).then((res) => res.json()).then((data) => data)
            
            text = await fetch(`../API/Lines/Allegory_${allegory.id}/Tale_${tale.id}/Text/Content.json`).then((res) => res.json()).then((data) => data)
            textOptions = await fetch(`../API/Lines/Allegory_${allegory.id}/Tale_${tale.id}/Text/Options.json`).then((res) => res.json()).then((data) => data)
            speaker = await fetch(`../API/Lines/Allegory_${allegory.id}/Tale_${tale.id}/Speaker/Speaker.json`).then((res) => res.json()).then((data) => data)
            speakerOptions = await fetch(`../API/Lines/Allegory_${allegory.id}/Tale_${tale.id}/Speaker/Options.json`).then((res) => res.json()).then((data) => data)
            character = await fetch(`../API/Lines/Allegory_${allegory.id}/Tale_${tale.id}/Character/Character.json`).then((res) => res.json()).then((data) => data)
            characterOptions = await fetch(`../API/Lines/Allegory_${allegory.id}/Tale_${tale.id}/Character/Options.json`).then((res) => res.json()).then((data) => data)
            lineOptions = await fetch(`../API/Lines/Allegory_${allegory.id}/Tale_${tale.id}/Line/Options.json`).then((res) => res.json()).then((data) => data)
            sceneOptions = await fetch(`../API/Lines/Allegory_${allegory.id}/Tale_${tale.id}/Line/Scene.json`).then((res) => res.json()).then((data) => data)
            choiceOptions = await fetch(`../API/Lines/Allegory_${allegory.id}/Tale_${tale.id}/Line/Choice.json`).then((res) => res.json()).then((data) => data)
            promptOptions = await fetch(`../API/Lines/Allegory_${allegory.id}/Tale_${tale.id}/Line/Prompt.json`).then((res) => res.json()).then((data) => data)

            lines = { text, textOptions, speaker, speakerOptions, character, characterOptions, lineOptions, sceneOptions, choiceOptions, promptOptions }

            for (let index = 0; index < text.length; index++) {
                this.lineValidity.push(await this.ValidateLine(lines, index))
                this.lineData.push(await this.CompileLineData(lines, index))
                this.currentLines.push(await this.InstantiateLine(this.lineData[index]));
            }

            resolve(this.currentLines);
        })
    }

    ValidateLine (lines, index) {
        return new Promise ( async (resolve) => {
            let data;
            let number, hasTextData, hasTextOptions, hasSpeakerData, hasSpeakerOptions, hasCharacterInfo, hasCharacterData, hasCharacterOptions, isAddingCharacter, isMovingCharacter, isChangingExpression, hasLineOptions, hasSceneOptions, isAddingPause, isUpdatingScene, isUpdatingBox, hasChoiceOptions, hasPromptOptions;

            number = index;
            hasTextData = lines.text.find((entry) => entry.number === index) != null;
            hasTextOptions = lines.textOptions.find((entry) => entry.number === index) != null;
            hasSpeakerData = lines.speaker.find((entry) => entry.number === index) != null;
            hasSpeakerOptions = lines.speakerOptions.find((entry) => entry.number === index) != null;
            hasCharacterInfo = lines.character.find((entry) => entry.number === index) != null;
            hasCharacterData = lines.character.find((entry) => entry.number === index) != null && lines.character.find((entry) => entry.number === index).data != null;
            hasCharacterOptions = lines.characterOptions.find((entry) => entry.number === index) != null;
            isAddingCharacter = hasCharacterOptions && lines.characterOptions.find((entry) => entry.number === index).options.addCharacter != null;
            isMovingCharacter = hasCharacterOptions && lines.characterOptions.find((entry) => entry.number === index).options.moveCharacter != null;
            isChangingExpression = hasCharacterOptions && lines.characterOptions.find((entry) => entry.number === index).options.changeExpression != null;
            hasLineOptions = lines.lineOptions.find((entry) => entry.number === index) != null;
            hasSceneOptions = lines.sceneOptions.find((entry) => entry.number === index) != null;
            isAddingPause = hasSceneOptions && lines.sceneOptions.find((entry) => entry.number === index).addPause != null;
            isUpdatingScene = hasSceneOptions && lines.sceneOptions.find((entry) => entry.number === index).updateScene != null;
            isUpdatingBox = hasSceneOptions && lines.sceneOptions.find((entry) => entry.number === index).updateBox != null;
            hasChoiceOptions = lines.choiceOptions.find((entry) => entry.number === index) != null;
            hasPromptOptions = lines.promptOptions.find((entry) => entry.number === index) != null;

            data = { number, hasTextData, hasTextOptions, hasSpeakerData, hasSpeakerOptions, hasCharacterInfo, hasCharacterData, hasCharacterOptions, isAddingCharacter, isMovingCharacter, isChangingExpression, hasLineOptions, hasSceneOptions, isAddingPause, isUpdatingScene, isUpdatingBox, hasChoiceOptions, hasPromptOptions }

            resolve(data);
        })
    }

    CompileLineData (lines, index) {
        return new Promise ( (resolve) => {
            let data = {
                number: index,
                text: this.lineValidity[index].hasTextData 
                ? { 
                    content: lines.text.find((entry) => entry.number === index).content, 
                    options: this.lineValidity[index].hasTextOptions ? lines.textOptions.find((entry) => entry.number === index).options : null 
                } : null,
                speaker: this.lineValidity[index].hasSpeakerData 
                ? { 
                    name: lines.speaker.find((entry) => entry.number === index).name, 
                    alias: lines.speaker.find((entry) => entry.number === index).alias, 
                    options: this.lineValidity[index].hasSpeakerOptions ? lines.speakerOptions.find((entry) => entry.number === index).options : null 
                } : null,
                character: this.lineValidity[index].hasCharacterInfo 
                ? { 
                    name: lines.character.find((entry) => entry.number === index).name, 
                    data: this.lineValidity[index].hasCharacterData ? lines.character.find((entry) => entry.number === index).data : null, 
                    options: this.lineValidity[index].hasCharacterOptions 
                    ? { 
                        addCharacter: this.lineValidity[index].isAddingCharacter ? lines.characterOptions.find((entry) => entry.number === index).options.addCharacter : null, 
                        moveCharacter: this.lineValidity[index].isMovingCharacter ? lines.characterOptions.find((entry) => entry.number === index).options.moveCharacter : null, 
                        changeExpression: this.lineValidity[index].isChangingExpression ? lines.characterOptions.find((entry) => entry.number === index).options.changeExpression : null 
                    } : null 
                } : null,
                options: this.lineValidity[index].hasLineOptions 
                ? { 
                    scene: this.lineValidity[index].hasSceneOptions 
                    ? { 
                        addPause: this.lineValidity[index].isAddingPause ? lines.sceneOptions.addPause : null, 
                        updateScene: this.lineValidity[index].isUpdatingScene ? lines.sceneOptions.find((entry) => entry.number === index).updateScene : null, 
                        updateBox: this.lineValidity[index].isUpdatingBox ? lines.sceneOptions.find((entry) => entry.number === index).updateBox : null 
                    } : null, 
                    choice: this.lineValidity[index].hasChoiceOptions ? lines.choiceOptions.find((entry) => entry.number === index) : null, 
                    prompt: this.lineValidity[index].hasPromptOptions ? lines.promptOptions.find((entry) => entry.number === index) : null 
                } : null
            }
            resolve(data);
        })
    }

    InstantiateLine (line) {
        return new Promise ( (resolve) => {
            let newLine = new Line(
                line.number, 
                line.text != null 
                ? new Text(
                    line.text.content, 
                    line.text != null && line.text.options != null ? new TextOptions(line.text.options) : null
                ) : null,
                line.speaker != null 
                ? new Speaker(
                    line.speaker.name, 
                    line.speaker.alias, 
                    line.speaker.options != null ? new SpeakerOptions(line.speaker.options) : null
                ) : null,
                line.character != null 
                ? new Character(
                    { 
                        name: line.character.name, 
                        data: line.character.data != null ? new CharacterData(line.character.data) : null, 
                        options: line.character.options != null ? new CharacterOptions(
                            { 
                                addCharacter: line.character.options.addCharacter != null ? new AddCharacter(line.character.options.addCharacter) : null, 
                                moveCharacter: line.character.options.moveCharacter != null ? new MoveCharacter(line.character.options.moveCharacter) : null, 
                                changeExpression: line.character.options.changeExpression != null ? new ChangeExpression(line.character.options.changeExpression) : null 
                            }
                        ) : null 
                    }
                ) : null,
                line.options != null 
                ? new LineOptions(
                    { 
                        scene: line.options.scene != null ? new SceneOptions(
                            { 
                                addPause: line.options.scene.addPause, 
                                updateScene: line.options.scene.updateScene != null ? new UpdateScene(line.options.scene.updateScene.current, line.options.scene.updateScene.next) : null, 
                                updateBox: line.options.scene.updateBox != null ? new UpdateBox(line.options.scene.updateBox.current, line.options.scene.updateBox.next) : null 
                            }
                        ) : null, 
                        choice: line.options.choice != null ? new ChoiceOptions(line.options.choice) : null, 
                        prompt: line.options.prompt != null ? new PromptOptions(line.options.prompt) : null  
                    }
                ) : null
            )
            resolve(newLine);
        })
    }

}