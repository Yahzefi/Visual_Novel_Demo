import { StartEvent } from "../Events/Event.js";
import { DataManager, DOMManager } from "../main.js";
import { UpdateStyle } from "./Styles/Style.js";

export class Choice {
    constructor () {
        // displays/prompts player choice
        this.choiceContainers = [];
        this.textContainers = [];
        // array of container ids
        this.idArray = [];
        this.isActive = false;
        this.isWaiting = false;
        // indicates which choice player made
        this.selectionKey = null,
        // indicates which response is typed next
        this.choiceKey = 0,

        // all current line data (text, speaker, etc.) & scene id
        this.currentData = {
            id: null,
            lines: null
        }
    }

    Init (initData) {
        return new Promise ( async (resolve) => {

            await this.UpdateData(initData);

            let playerLine, choiceContainer, choiceText;

            playerLine = this.currentData.lines[0];
    
            UpdateStyle("DIALOGUE", { element: "SPEAKER_CONTAINER", type: "ADD", styles: "no-display" })
            UpdateStyle("DIALOGUE", { element: "PROMPT_CONTAINER", type: "ADD", styles: "no-display" })

            this.currentData.lines.forEach((line) => {
                if (line === playerLine) {
                    line.text.content.forEach((reply, i) => {
                        // add choice containers to dialogue box
                        DOMManager.addElement("div", "dialogue-choice", `choiceContainer_${i}`, "dBox", "sceneElements");
                        DOMManager.addElement("p", "choice-text", `choiceText_${i}`, `choiceContainer_${i}`, "sceneElements", reply);
            
                        choiceContainer = document.getElementById(`choiceContainer_${i}`)
                        choiceText = document.getElementById(`choiceText_${i}`)
            
                        this.choiceContainers.push(choiceContainer);
                        this.textContainers.push(choiceText)
                        this.idArray.push(this.choiceContainers[i].id)
                    })
                }
            })
    
            // add event listener for player click/choice
            document.addEventListener("click", async (ev) => await this.GetChoice(ev))
    
            // choice event is now active and waiting for player response/click
            this.isActive = true;
            this.isWaiting = true;

            resolve();
        })
    }

    UpdateData (updateData) {
        return new Promise ((resolve) => {
            this.currentData = {
                id: updateData.id,
                lines: updateData.lines
            }
            resolve();
        })
    }

    GetChoice (ev) {
        return new Promise ( async (resolve) => {

            document.removeEventListener("click", async (ev) => await this.GetChoice(ev))
            
            // click event only triggers if choice or text container is selected
            if (!ev.target.classList.contains("dialogue-choice") && !ev.target.classList.contains("choice-text")) {
                resolve();
            } else {
                // if clicked element meets condition, remove all choice containers from dialogue box
                for (let i = 0; i < this.choiceContainers.length; i++) {
                    if (ev.target.id === this.choiceContainers[i].id || ev.target.id === this.textContainers[i].id) {
                        this.selectionKey = i
                        DOMManager.removeElements(this.idArray)
                    }
                }
                
                await this.SelectChoice();
                
                resolve()
            }
        })
    }
    
    SelectChoice () {
        return new Promise ( async (resolve) => {

            let textContent, speakerData, characterData, currentCharacters;
            let textOptions, speakerOptions, characterOptions, lineOptions;
            let sceneOptions;

            textContent = [];
            textOptions = [];
            speakerData = [];
            speakerOptions = [];
            characterOptions = [];
            currentCharacters = [];

            lineOptions = [];
            sceneOptions = [];

            this.currentData.lines.forEach( async (line, i) => {
                // push data into arrays equal in length to max choiceKey number
                line.text != null ? textContent.push([line.text.content[this.selectionKey]]) : textContent.push([""])
                line.text != null ? textOptions.push(line.text.options) : textOptions.push("")
                line.speaker != null ? speakerData.push(line.speaker) : speakerData.push("")
                line.speaker != null ? speakerOptions.push(line.speaker.options) : speakerOptions.push("");
                line.character != null ? currentCharacters.push(DataManager.activeCharacters.find((character) => character.name === line.character.name)) : currentCharacters.push("")
                line.character != null ? characterOptions.push(line.character.options) : characterOptions.push("")
                // if entry at index "x" (choiceKey) is NOT an empty string, assign current character's data to variable
                characterData = currentCharacters[this.choiceKey] !== "" ? currentCharacters[this.choiceKey] : null;
                
                // if data is NOT null, update options data
                if (characterData != null) {
                    characterData.options = characterOptions[i] !== "" 
                    ? {
                        addCharacter: characterOptions[i].addCharacter,
                        moveCharacter: characterOptions[i].moveCharacter,
                        changeExpression: {
                            current: characterOptions[i].changeExpression.current,
                            next: characterOptions[i].changeExpression.next[i]
                        }
                    }
                    : null
                }

                // update scene data
                line.options != null ? lineOptions.push(line.options) : lineOptions.push("");

                if (lineOptions[i] !== "") {
                    lineOptions[i].scene != null ? sceneOptions.push(lineOptions[i].scene) : sceneOptions.push("")
                    if (sceneOptions[i] != null) {
                        sceneOptions[i].updateBox != null && await StartEvent("DIALOGUE", { type: "RESIZE_BOX", eventData: { current: sceneOptions[i].updateBox.current, next: sceneOptions[i].updateBox.next } })
                        UpdateStyle("DIALOGUE", { element: "BOX", type: "DELETE", styles: "no-display" }) 
                    }
                }

            })

            let selectionData = {
                text: {
                    content: textContent[this.choiceKey],
                    options: {
                        isStyled: textOptions[this.choiceKey].isStyled,
                        size: textOptions[this.choiceKey].size,
                        tags: {
                            fontStyles: textOptions[this.choiceKey].tags.fontStyles,
                            colors: textOptions[this.choiceKey].tags.colors,
                        }
                    }
                },
                speaker: {
                    name: speakerData[this.choiceKey].name,
                    alias: speakerData[this.choiceKey].alias,
                    options: speakerOptions[this.choiceKey] !== "" ? {
                        isThought: speakerOptions[this.choiceKey].isThought,
                        backgroundColor: speakerOptions[this.choiceKey].backgroundColor,
                        textColor: speakerOptions[this.choiceKey].textColor
                    }
                    : null
                },
                character: characterData != null ? characterData : null             
            }
            
            if (selectionData.character != null) {
                // character expression change
                if (selectionData.character.options.changeExpression != null) {
                    await StartEvent("CHARACTER", { type: "UPDATE_EXPRESSION", eventData: { character: selectionData.character, data: { current: characterData.options.changeExpression.current, next: characterData.options.changeExpression.next } } })
                    await DataManager.UpdateActiveCharacters(selectionData.character);
                }
                // move character
                //
                // add character
                //
                // alias change
                //
            }

            UpdateStyle("DIALOGUE", { element: "SPEAKER_CONTAINER", type: "DELETE", styles: "no-display" })
            UpdateStyle("DIALOGUE", { element: "PROMPT_CONTAINER", type: "DELETE", styles: "no-display" })

            // speaker change
            selectionData.speaker != null && await StartEvent("DIALOGUE", { type: "CHANGE_SPEAKER", eventData: { current: null, next: selectionData.speaker } })

            this.isWaiting = true;

            selectionData.text != null && await StartEvent("DIALOGUE", { type: "TALK", eventData: selectionData.text });


// ! test if removing "resolve()" and using tern ops is viable
            if (this.currentData.lines[this.choiceKey].isFinal) {
                await this.ClearData();
                resolve();
            }

            this.choiceKey++;
            this.isWaiting = false;

            resolve();
        })
    }

    ClearData () {
        return new Promise ( (resolve) => {
            this.isActive = false;
            this.choiceContainers = [];
            this.textContainers = [];
            this.idArray = [];
            this.selectionKey = null;
            this.choiceKey = 0;
            this.currentData = {
                id: null,
                lines: null
            }
            resolve();
        })
    }
}
