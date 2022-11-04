import { CharacterImages } from "./CharacterImages.js";
import { DataManager, DOMManager } from "../../main.js";
import { UpdateStyle } from "../Styles/Style.js";
import { StartEvent } from "../../Events/Event.js";

export class Character {
    constructor (payload) {
        this.name = payload?.name;
        this.data = payload?.data;
        this.options = payload?.options;
        this.imageSet = null;
        this.element = null;
    }

    Init () {
        this.name == null && console.error("Error: character name not found")
        this.data.alias = this.data.alias == null ? "???" : this.data.alias;
        this.imageSet = CharacterImages[this.name];
        this.data.expression = "neutral"
        this.data.position = "INACTIVE";
        this.data.animation = "UNASSIGNED"; 

        DOMManager.addElement("img", "character-image", this.data.id, "sceneContainer");
        this.element = document.getElementById(this.data.id);
        this.element.src = this.imageSet[this.data.expression];

        UpdateStyle("CHARACTER", { element: this.element, type: "INIT" })

        DataManager.activeCharacters = DataManager.activeCharacters.filter((char) => char.name !== this.name)
        DataManager.activeCharacters.push(this);
    }

    EnterScene (payload) {
        return new Promise ( async (resolve) => {
            // update character start position
            UpdateStyle(
                "CHARACTER", 
                { 
                    element: this.element, 
                    type: "UPDATE", 
                    styles: { 
                        current: payload.position.current === "inactive" ? `start-inactive` : `start-${payload.position.current}-${payload.animation.direction.current}`, 
                        next: payload.position.current === "inactive" ? `start-offScreen-${payload.animation.direction.next}` : `start-${payload.position.next}-${payload.animation.direction.next}` 
                    } 
                }
            )
            // update current position
            this.data.position = `start-${payload.position.current}-${payload.animation.direction.current}`;
            // error check for matching position values
            this.data.position === `start-${payload.position.next}-${payload.animation.direction.next}` && console.error("Error: matching values for \"position\".")
            // unhide character element
            UpdateStyle("CHARACTER", { element: this.element, type: "DELETE", styles: "no-display" })
            // move character
            await this.Move(payload)
            // update expression if applicable
            this.data.expression != payload.expression.current && await this.UpdateExpression(payload.expression)
            // update active character data

            resolve();
        })
    }

    Move (payload) {
        return new Promise ( async (resolve) => {
            // error check for matching animation type
            this.data.animation === `${payload.position.current}_${payload.position.next}_${payload.animation.direction.next}` && console.error("Error: matching values for \"animation type\".")
            // add animation duration
            UpdateStyle("CHARACTER", { element: this.element, type: "ADD", styles: `speed-${payload.animation.duration}` })
            // add animation type
            UpdateStyle("CHARACTER", { element: this.element, type: "ADD", styles: payload.position.current === "inactive" ? `offScreen_${payload.position.next}_${payload.animation.direction.next}` : `${payload.position.current}_${payload.position.next}_${payload.animation.direction.next}` })
            // remove current character position styling
            UpdateStyle("CHARACTER", { element: this.element, type: "DELETE", styles: payload.position.current === "inactive" ? `start-offScreen-${payload.animation.direction.next}` : `start-${payload.position.current}-${payload.animation.direction.current}` })
            // setup callback to run after animation
            let runAnimation = () => {
                return new Promise ( (resolve) => {
                    setTimeout( async () => {
                        // remove animation duration
                        UpdateStyle("CHARACTER", { element: this.element, type: "DELETE", styles: `speed-${payload.animation.duration}` })
                        // remove animation type
                        UpdateStyle("CHARACTER", { element: this.element, type: "DELETE", styles: payload.position.current === "inactive" ? `offScreen_${payload.position.next}_${payload.animation.direction.next}` : `${payload.position.current}_${payload.position.next}_${payload.animation.direction.next}` })
                        // update current position of image
                        UpdateStyle("CHARACTER", { element: this.element, type: "ADD", styles: `start-${payload.position.next}-${payload.animation.direction.next}` })
                        // update character data
                        this.data.position = `start-${payload.position.next}-${payload.animation.direction.next}`;
                        this.data.animation = `${payload.position.current}_${payload.position.next}_${payload.animation.direction.next}`
                        await DataManager.UpdateActiveCharacters(this);
                        resolve();
                    }, payload.animation.duration - (payload.animation.duration / 20))
                })
            }

            await runAnimation();

            // update active character data

            resolve();
        })
    }

    UpdateExpression (payload) {
        return new Promise ( async (resolve) => {
            // error check for matching expression values
            this.data.expression === payload.next && console.error("Error: matching values for \"expression\".")
            // add base expression styling
            UpdateStyle("CHARACTER", { element: this.element, type: "ADD", styles: "expression-change" })
            // add current expression fade out
            UpdateStyle("CHARACTER", { element: this.element, type: "ADD", styles: "expression-exit"})
            await StartEvent("SCENE", { type: "PAUSE", eventData: 250 })
            // hide character after expression fade out
            UpdateStyle("CHARACTER", { element: this.element, type: "ADD", styles: "no-display" })
            // update character expression
            this.element.src = this.imageSet[payload.next]
            // remove fade out styling & add next expression fade in
            UpdateStyle("CHARACTER", { element: this.element, type: "UPDATE", styles: { current: "expression-exit", next: "expression-enter" } })
            // unhide character
            UpdateStyle("CHARACTER", { element: this.element, type: "DELETE", styles: "no-display" })
            await StartEvent("SCENE", { type: "PAUSE", eventData: 250 })
            // remove fade in styling
            UpdateStyle("CHARACTER", { element: this.element, type: "DELETE", styles: "expression-enter" })
            // remove base expression styling
            UpdateStyle("CHARACTER", { element: this.element, type: "DELETE", styles: "expression-change" })
            // update character data
            this.data.expression = payload.next;

            // update active character data
            await DataManager.UpdateActiveCharacters(this);

            resolve();
        })
    }

    UpdateAlias (payload) {
        return new Promise ( async (resolve) => {
            this.data.alias = payload.next.alias;
            // update active character data
            await DataManager.UpdateActiveCharacters(this);
            await StartEvent("DIALOGUE", { type: "CHANGE_SPEAKER", eventData: { current: payload.current, next: payload.next } })
        })
    }
}

// classes (makeshift interface/type) for character class property
export class CharacterData {
    constructor (data) {
        this.alias = data?.alias;
        this.id = data?.id;
        this.isNew = data?.isNew;
        this.expression = data?.expression;
        this.position = data?.position;
        this.animation = data?.animation;
    }
}

export class CharacterOptions {
    constructor (data) {
        this.addCharacter = data?.addCharacter;
        this.moveCharacter = data?.moveCharacter;
        this.changeExpression = data?.changeExpression;
    }
}

export class AddCharacter {
    constructor (data) {
        this.expression = {
            current: data?.expression?.current,
            next: data?.expression?.next
        };
        this.position = { 
            current: data?.position?.current, 
            next: data?.position?.next 
        };
        this.animation = { 
            direction: {
                current: data?.animation?.direction?.current,
                next: data?.animation?.direction?.next
            }, 
            duration: data?.animation?.duration
        };
    }
}

export class MoveCharacter {
    constructor (data) {
        // this.name = data?.name;
        this.position = {
            current: data?.position?.current,
            next: data?.position?.next
        }
        this.animation = {  
            direction: data?.animation?.direction, 
            duration: data?.animation?.duration
        };
        this.willDelete = data?.willDelete;
    }
}

export class ChangeExpression {
    constructor (data) {
        this.current = data?.current;
        this.next = data?.next;
    }
}