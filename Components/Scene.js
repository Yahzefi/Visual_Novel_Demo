import { StartEvent } from "../Events/Event.js";
import { DialogueManager, DOMManager, ChoiceManager, ScriptManager } from "../main.js";
import { UpdateStyle } from "./Styles/Style.js"

export class Scene {
    constructor () {
        this.elements = {
            sceneContainer: null,
            sceneBackground: null,
            sceneDimmer: null,
            sceneTransition: null,
            sceneTitle: null,
            sceneChapter: null,
        },
        this.mediaQueries = {
            titleAnimation: null
        }
    }

    Init () {

        DOMManager.addElement("div", "scene-background", "sceneBackground", null, "sceneElements") // background image
        DOMManager.addElement("div", "scene-container", "sceneContainer", "sceneBackground", "sceneElements"); // scene container
        DOMManager.addElement("div", "scene-dimmer", "sceneDimmer", "sceneContainer", "sceneElements") // darken screen for readability
        DOMManager.addElement("div", "scene-transition", "sceneTransition", "sceneContainer", "sceneElements") // fade to and then from white
        DOMManager.addElement("h1", "scene-title", "sceneTitle", "sceneContainer", "sceneElements"); // Act/Chapter/etc.. title text
        DOMManager.addElement("h6", "scene-chapter", "sceneChapter", "sceneContainer", "sceneElements") // name of the specific section of Act/Chapter/etc

        this.elements.sceneBackground = document.getElementById("sceneBackground");
        this.elements.sceneContainer = document.getElementById("sceneContainer");
        this.elements.sceneDimmer = document.getElementById("sceneDimmer");
        this.elements.sceneTransition = document.getElementById("sceneTransition");
        this.elements.sceneTitle = document.getElementById("sceneTitle");
        this.elements.sceneChapter = document.getElementById("sceneChapter");

        UpdateStyle("SCENE", { element: "BACKGROUND", type: "INIT" })

        UpdateStyle("SCENE", { element: "CONTAINER", type: "INIT" })
        UpdateStyle("SCENE", { element: "DIMMER", type: "INIT" })
        UpdateStyle("SCENE", { element: "TRANSITION", type: "INIT" })
        UpdateStyle("SCENE", { element: "TITLE", type: "INIT" })
        UpdateStyle("SCENE", { element: "CHAPTER", type: "INIT" })

        

    }

    UpdateTitles (allegory, tale) {
        // called by event which is called by script manager
        return new Promise ( async (resolve) => {
            let currentAllegory = this.elements.sceneTitle.textContent;
            let currentTale = this.elements.sceneChapter.textContent;

            this.elements.sceneTitle.textContent = currentAllegory !== allegory.title ? allegory.title : currentAllegory;
            this.elements.sceneChapter.textContent = currentTale !== tale.title ? tale.title : currentTale;

            resolve();
        })
    }

    AddMediaQueryCheck (type) {
        switch (type) {
            case "TITLE_ANIMATION":
                this.mediaQueries.titleAnimation = window.matchMedia("(width < 815px) or (height < 550px)");
                
                this.mediaQueries.titleAnimation.addEventListener(("change", () => {
                    if (this.mediaQueries.titleAnimation.matches) {
                        UpdateStyle("SCENE", { element: "TITLE", type: "ADD", styles: "no-display" })
                        UpdateStyle("SCENE", { element: "CHAPTER", type: "ADD", styles: "no-display" })
                    } else {
                        this.elements.sceneTitle.classList.contains("animate-title") && UpdateStyle("SCENE", { element: "TITLE", type: "DELETE", styles: "animate-title" })
                        this.elements.sceneChapter.classList.contains("animate-chapter") && UpdateStyle("SCENE", { element: "TITLE", type: "DELETE", styles: "animate-chapter" })
                    }
                }))
                break;
            default:
                break;
        }
    }

    async StartNewGame () {
        UpdateStyle("SCENE", { element: "TITLE", type: "ADD", styles: "animate-title" }) // add title animation
        UpdateStyle("SCENE", { element: "CHAPTER", type: "ADD", styles: "animate-chapter" }) // add chapter animation
        UpdateStyle("DIALOGUE", { element: "BOX", type: "UPDATE", styles: { current: "box-normal", next: "box-large" } }) // update dialogue box size
        UpdateStyle("DIALOGUE", { element: "BOX", type: "UPDATE", styles: { current: "dialogue-close", next: "dialogue-open" } }) // update dialogue box animation type for large sizing
        UpdateStyle("DIALOGUE", { element: "BOX", type: "ADD", styles: "open-large" }) // add animation name for large sizing
        UpdateStyle("DIALOGUE", { element: "CONTAINER", type: "ADD", styles: "container-large" }) // update dialogue container size
        UpdateStyle("DIALOGUE", { element: "TEXT_CONTAINER", type: "UPDATE", styles: { current: "dText-normal", next: "dText-large" } }) // update text container size
        UpdateStyle("DIALOGUE", { element: "PROMPT_CONTAINER", type: "ADD", styles: "pContainer-large" }) // update prompt container size
        UpdateStyle("DIALOGUE", { element: "PROMPT_ICON", type: "ADD", styles: "icon-large" }) // update prompt icon size
        
        await DOMManager.toggleHide([
            // visibility
            { type: "DIALOGUE", element: "PROMPT_CONTAINER", method: { type: "ADD", style: "no-visibility" } },
            // display
            { type: "SCENE", element: "TITLE", method: { type: "ADD", style: "no-display" }},
            { type: "SCENE", element: "CHAPTER", method: { type: "ADD", style: "no-display" }},
            { type: "SCENE", element: "DIMMER", method: { type: "ADD", style: "no-display" }},
            { type: "SCENE", element: "TRANSITION", method: { type: "ADD", style: "no-display" }},
            { type: "DIALOGUE", element: "SPEAKER_CONTAINER", method: { type: "ADD", style: "no-display" }},
            { type: "DIALOGUE", element: "CONTAINER", method: { type: "ADD", style: "no-display" }, addPause: 1000 } // 1000
        ])
        
        await StartEvent("SCENE", { type: "PAUSE", eventData: 2500}) // 2500

        await DOMManager.toggleHide([{ type: "SCENE", element: "DIMMER", method: { type: "DELETE", style: "no-display" }, addPause: 1000 }]); // 1000
        UpdateStyle("SCENE", { element: "TITLE", type: "ADD", styles: "titlePosition-center" }) // top: 40%
        await DOMManager.toggleHide([{ type: "SCENE", element: "TITLE", method: { type: "DELETE", style: "no-display" }, addPause: 4000 }]) // 4000
        UpdateStyle("SCENE", { element: "TITLE", type: "UPDATE", styles: { current: "titlePosition-center", next: "titlePosition-normal" } }) // top: 0%
        UpdateStyle("SCENE", { element: "TITLE", type: "DELETE", styles: "animate-title" }) // remove title animation
        await DOMManager.toggleHide([{ type: "SCENE", element: "CHAPTER", method: { type: "DELETE", style: "no-display" }, addPause: 1000 }]) // 1000
        UpdateStyle("SCENE", { element: "CHAPTER", type: "DELETE", styles: "animate-chapter" }) // remove chapter animation
        await DOMManager.toggleHide([{ type: "DIALOGUE", element: "CONTAINER", method: { type: "DELETE", style: "no-display" }, addPause: 1500 }]) // 1500
        UpdateStyle("DIALOGUE", { element: "CONTAINER", type: "DELETE", styles: "no-display" }) // show dialogue container

        this.StartScene();
    }

    StartScene () {

        let Continue = async (state) => {
            if (state == null) {
                Continue("RUN")
            } else if (state === "PAUSE") {
                setTimeout(() => {
                    if (DialogueManager.data.isWaiting) {
                        Continue("PAUSE")
                    } else {
                        Continue("RUN");
                    }
                }, 100)
            }else if (state === "RUN") {
                if (ScriptManager.currentLine === ScriptManager.data.length) {
                    Continue("STOP");
                } else {
                    // init method call
                    await ScriptManager.NextLine(ScriptManager.data[ScriptManager.currentLine])
                    Continue("RUN");
                }
            }else if (state === "STOP") {
                await this.EndScene();
            }
        }

        Continue();
    }

    NextScene (data) {
        return new Promise ( async (resolve) => {
            let scene = data.scene;
            let box = data.box;

            ScriptManager.currentLine !== 0 && UpdateStyle("DIALOGUE", { element: "BOX", type: "UPDATE", styles: { current: "dialogue-open", next: "dialogue-close" } })
            
            box != null && UpdateStyle("DIALOGUE", { element: "BOX", type: "UPDATE", styles: { current: `open-${box.current}`, next: `close-${box.current}` } })
            
            await StartEvent("SCENE", { type: "PAUSE", eventData: 1000 }) // 1000
            
            await DOMManager.toggleHide([
                { type: "DIALOGUE", element: "CONTAINER", method: { type: "ADD", style: "no-display" } },
                { type: "DIALOGUE", element: "SPEAKER_CONTAINER", method: { type: "ADD", style: "no-display" }},
                { type: "DIALOGUE", element: "PROMPT_CONTAINER", method: { type: "ADD", style: "no-visibility" }, addPause: 1000 } // 1000
            ])

            box != null && await StartEvent("DIALOGUE", { type: "RESIZE_BOX", eventData: box })

            await DOMManager.toggleHide([
                { type: "SCENE", element: "TRANSITION", method: { type: "DELETE", style: "no-display" }, addPause: 2000}, // 2000
                { type: "SCENE", element: "DIMMER", method: { type: "ADD", style: "no-display" }},
                { type: "DIALOGUE", element: "BOX", method: { type: "DELETE", style: "no-display" }},
            ])

            scene != null ? UpdateStyle("SCENE", { element: "BACKGROUND", type: scene.current == null ? "ADD" : "UPDATE", styles: scene.current == null ? scene.next : { current: scene.current, next: scene.next } }) : console.error("scene data values are null/invalid")

            await StartEvent("SCENE", { type: "PAUSE", eventData: 2000 }) // 2000
            
            await DOMManager.toggleHide([
                { type: "SCENE", element: "TRANSITION", method: { type: "ADD", style: "no-display" }},
                { type: "SCENE", element: "DIMMER", method: { type: "DELETE", style: "no-display" }}
            ])

            UpdateStyle("DIALOGUE", { element: "BOX", type: "UPDATE", styles: { current: "dialogue-close", next: "dialogue-open" } })
            box != null && UpdateStyle("DIALOGUE", { element: "BOX", type: "UPDATE", styles: { current: `close-${box.current}`, next: `open-${box.next}` } })

            await DOMManager.toggleHide([
                { type: "DIALOGUE", element: "CONTAINER", method: { type: "DELETE", style: "no-display" }, addPause: 1500 },
            ])

            await DOMManager.toggleHide([
                { type: "DIALOGUE", element: "SPEAKER_CONTAINER", method: { type: "DELETE", style: "no-display" }},
            ])
            
            resolve();
        })
    }

    LoadScene (loadData) {
        return new Promise ( async (resolve) => {
            
            // set script data
            //

            // set current line number
            //

            // start scene
            //

            resolve();
        })
    }

    EndScene () {
        return new Promise ( async (resolve) => {
            this.elements.sceneBackground.children[0].remove();
            UpdateStyle("SCENE", { element: "BACKGROUND", type: "DELETE", styles: "forest-shrine" })
            DOMManager.addElement("p", "end-screen", "endScreen", "sceneBackground", "sceneElements", "Thank you for playing the demo for \"Void Resonance\"!")
            resolve();
        })
    }
}



