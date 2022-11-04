import { DataManager, DOMManager } from "../main.js";
import { UpdateStyle } from "./Styles/Style.js";

export class Dialogue {
    constructor () {
        this.elements = {
            dialogueContainer: null,
            dialogueBox: null,
            speakerContainer: null,
            speakerText: null,
            dialogueText: null,
            promptContainer: null,
            promptIcon: null,
            promptText: null
        };
        this.data = {
            currentText: [],
            charArray: [], // two-dimensional array of text content split into individual letters
            textIndex: 0, // tracks position in text content array
            charIndex: 0, // tracks position in split char array
            isFlashing: false, // ref for continue prompt that fades in/out
            skipIsUsed: false, // ref for whether player has opted to skip typing effect and show entirety of string/line
            isWaiting: false, // ref for whether application is or isn't waiting on player action
        };
    }

    Init () {
        DOMManager.addElement("div", "dialogue-container", "dContainer", "sceneContainer", "dialogueElements")
        DOMManager.addElement("div", "dialogue-box", "dBox", "dContainer", "dialogueElements"); // primary container for dialogue box
        DOMManager.addElement("div", "speaker-container", "speakerContainer", "dBox", "dialogueElements"); // speaker container
        DOMManager.addElement("p", "speaker-text", "speakerText", "speakerContainer", "dialogueElements", "") // <p> text element for speaker's name
        DOMManager.addElement("p", null, "dText", "dBox", "dialogueElements", ""); // dialogue text container
        DOMManager.addElement("div", "prompt-container", "promptContainer", "dBox", "dialogueElements") // container for both animated circle & text directions
        DOMManager.addElement("div", "prompt-icon", "promptIcon", "promptContainer", "dialogueElements");
        DOMManager.addElement("p", "prompt-text", "promptText", "promptContainer", "dialogueElements", "SPACE / ENTER") // text directions for player

        this.elements.dialogueContainer = document.getElementById("dContainer")
        this.elements.dialogueBox = document.getElementById("dBox");
        this.elements.speakerContainer = document.getElementById("speakerContainer")
        this.elements.speakerText = document.getElementById("speakerText");
        this.elements.dialogueText = document.getElementById("dText");
        this.elements.promptContainer = document.getElementById("promptContainer")
        this.elements.promptIcon = document.getElementById("promptIcon");
        this.elements.promptText = document.getElementById("promptText");

        UpdateStyle("DIALOGUE", { element: "CONTAINER", type: "INIT" })
        UpdateStyle("DIALOGUE", { element: "BOX", type: "INIT" })
        UpdateStyle("DIALOGUE", { element: "SPEAKER_CONTAINER", type: "INIT" })
        UpdateStyle("DIALOGUE", { element: "SPEAKER_TEXT", type: "INIT" })
        UpdateStyle("DIALOGUE", { element: "TEXT_CONTAINER", type: "INIT" })
        UpdateStyle("DIALOGUE", { element: "PROMPT_CONTAINER", type: "INIT" })
        UpdateStyle("DIALOGUE", { element: "PROMPT_ICON", type: "INIT" })
        UpdateStyle("DIALOGUE", { element: "PROMPT_TEXT", type: "INIT" })
    }

    Talk (text) {
        return new Promise ( (resolve) => {
            let newTextArray = [];

            if (text?.options?.isStyled) {
                text.content.forEach((string, i) => newTextArray.push({ isStyled: true, textContent: { size: text?.options?.size, tags: text?.options?.tags, string: string } }))
            } else {
                text.content.forEach((string) => newTextArray.push({ isStyled: false, textContent: string }))
            }

            this.SetupText(newTextArray)
            .then( async (data) => {
                await this.AddLetters(data);
                if (data[this.data.textIndex - 1].textContent !== "") {
                    await this.FlashIndicator();
                } else {
                    this.data.isWaiting = false;
                }
                this.ClearData();
                resolve();
            })
        })
    }

    SetupText (payload) {
        return new Promise ( (resolve) => {
            let data = [];

            payload.forEach( (textData, i) => {
                DOMManager.addElement("span", ".text-container", `dTextContent_0${i}`, "dText", "dialogueElements");
                this.data.currentText.push(document.getElementById(`dTextContent_0${i}`));

                UpdateStyle("DIALOGUE", { element: "TEXT_CONTENT", type: "INIT", index: i })

                if (textData.isStyled) {
                    let size = textData.textContent.size;
                    let styles = textData.textContent.tags;
                    size != null && UpdateStyle("DIALOGUE", { element: "TEXT_CONTENT", type: "UPDATE", index: i, styles: { current: size.current, next: size.next } })
                    styles.fontStyles != null && styles.fontStyles[i] != null && UpdateStyle("DIALOGUE", { element: "TEXT_CONTENT", type: "ADD", index: i, styles: styles.fontStyles[i] })
                    styles.colors != null && styles.colors[i] != null && UpdateStyle("DIALOGUE", { element: "TEXT_CONTENT", type: "ADD", index: i, styles: styles.colors[i] })
                    data.push({ element: this.data.currentText[i], textContent: textData.textContent.string === "PLAYER_NAME" ? DataManager.playerInfo.name : textData.textContent.string })
                } else {
                    data.push({ element: this.data.currentText[i], textContent: textData.textContent === "PLAYER_NAME" ? DataManager.playerInfo.name : textData.textContent })
                }
            })
            resolve(data);
        })
    }

    AddLetters (payload)  {
        return new Promise ( async (resolve) => {
            payload.forEach((entry) => this.data.charArray.push(entry.textContent.split("")));

            await this.AddLetter(payload[this.data.textIndex])
            this.data.textIndex++;

            if (this.data.skipIsUsed) {
                payload.forEach((entry) => entry.element.textContent = entry.textContent)
                this.data.skipIsUsed = false;
                resolve();
            }

            this.data.textIndex !== payload.length && await this.AddLetters(payload)
            resolve();
        })
    }

    AddLetter (payload) {
        return new Promise ( async (resolve) => {
            setTimeout( async () => {
                if (payload.element.textContent === payload.textContent || this.data.skipIsUsed) {
                    this.ClearData();
                    resolve();
                } else {
                    payload.element.textContent += this.data.charArray[this.data.textIndex][this.data.charIndex];
                    this.data.charIndex++;
                    await this.AddLetter(payload);
                    resolve();
                }
            }, 75)
        })
    }

    FlashIndicator () {
        return new Promise ((resolve) => {
            this.data.isFlashing = true;
            let flashInterval = setInterval(() => {
                if (this.data.isFlashing) {
                    UpdateStyle("DIALOGUE", { element: "PROMPT_CONTAINER", type: "DELETE", styles: "no-visibility" })
                } else {
                    clearInterval(flashInterval)
                    UpdateStyle("DIALOGUE", { element: "PROMPT_CONTAINER", type: "ADD", styles: "no-visibility" })
                    resolve();
                }
            }, 250)
        })
    }

    ClearData () {
        if (!this.data.isWaiting) {
            DOMManager.removeElements(this.data.currentText.map((element) => element.id))
            this.data.currentText = [];
            this.data.textIndex = 0;
        }
        this.data.charArray = [];
        this.data.charIndex = 0;
    }

    ChangeSpeaker (currentSpeaker, nextSpeaker) {
        this.elements.speakerText.textContent = nextSpeaker.alias == null ? "???" : nextSpeaker.alias === "Narrator" ? "" : nextSpeaker.alias;

        nextSpeaker.alias === "Narrator" ? UpdateStyle("DIALOGUE", { element: "TEXT_CONTAINER", type: "UPDATE", styles: { current: "dText-normal", next: "dText-narrator" } }) : nextSpeaker.alias !== "Narrator" && this.elements.dialogueText.classList.contains("dText-narrator") ? UpdateStyle("DIALOGUE", { element: "TEXT_CONTAINER", type: "UPDATE", styles: { current: "dText-narrator", next: "dText-normal" } }) : ""

        this.elements.speakerContainer.classList.contains("no-display") && UpdateStyle("DIALOGUE", { element: "SPEAKER_CONTAINER", type: "DELETE", styles: "no-display" })
        this.elements.speakerText.textContent === "" && UpdateStyle("DIALOGUE", { element: "SPEAKER_CONTAINER", type: "ADD", styles: "no-display" })


        // currentSpeaker will be null until updated for first time
        if (currentSpeaker == null) {
            // the case when choice event is active
            if (!this.elements.speakerContainer.classList.contains("speakerBackground-default")) {
                UpdateStyle("DIALOGUE", { element: "SPEAKER_CONTAINER", type: "INIT" })
                UpdateStyle("DIALOGUE", { element: "SPEAKER_TEXT", type: "INIT" })
                nextSpeaker.alias === "Narrator" && UpdateStyle("DIALOGUE", { element: "SPEAKER_CONTAINER", type: "ADD", styles: "no-display" })
            }
            UpdateStyle("DIALOGUE", { element: "SPEAKER_CONTAINER", type: "UPDATE", styles: { current: "speakerBackground-default", next: nextSpeaker.options.backgroundColor } })
            UpdateStyle("DIALOGUE", { element: "SPEAKER_TEXT", type: "UPDATE", styles: { current: "speakerText-default", next: nextSpeaker.options.textColor } })
            return;
        }

        if (currentSpeaker.options != null && nextSpeaker.options != null) {
            UpdateStyle("DIALOGUE", { element: "SPEAKER_CONTAINER", type: "UPDATE", styles: { current: currentSpeaker.options.backgroundColor, next: nextSpeaker.options.backgroundColor } })
            UpdateStyle("DIALOGUE", { element: "SPEAKER_TEXT", type: "UPDATE", styles: { current: currentSpeaker.options.textColor, next: nextSpeaker.options.textColor } })
        }
    }

    ResizeBox (data) {
        // hide dialogue box
        UpdateStyle("DIALOGUE", { element: "BOX", type: "ADD", styles: "no-display" }) 
        // update container size
        UpdateStyle("DIALOGUE", { element: "CONTAINER", type: "UPDATE", styles: { current: `container-${data.current}`, next: `container-${data.next}` } }) 
        // update box size
        UpdateStyle("DIALOGUE", { element: "BOX", type: "UPDATE", styles: { current: `box-${data.current}`, next: `box-${data.next}` } }) 
        // update text container size
        UpdateStyle("DIALOGUE", { element: "TEXT_CONTAINER", type: "UPDATE", styles: { current: `dText-${data.current}`, next: `dText-${data.next}` } }) 
        // update prompt container size
        UpdateStyle("DIALOGUE", { element: "PROMPT_CONTAINER", type: "UPDATE", styles: { current: `pContainer-${data.current}`, next: `pContainer-${data.next}` } })
        // update prompt icon size
        UpdateStyle("DIALOGUE", { element: "PROMPT_ICON", type: "UPDATE", styles: { current: `icon-${data.current}`, next: `icon-${data.next}` } })
    }
}