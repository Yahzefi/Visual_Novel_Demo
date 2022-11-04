export class Data {
    constructor() {
        this.data = [];
        this.currentSlot = 0;
        this.playerInfo = {
            name: ""
        }
        this.activeCharacters = [];
    }

    Init () {
        for (let i = 0; i < 6; i++) {
            let slotData;
            slotData = {
                number: i + 1,
                scene: { 
                    allegory: { id: null, title: null }, 
                    tale: { id: null, title: null, isFinal: false } 
                },
                currentLine: 0
            }
            this.data.push(slotData);
        }
    }

    Save (saveSlot, saveData) {
        return new Promise ( (resolve) => {

            this.data.forEach((slot) => slot = slot.number === saveSlot ? saveData : slot)

            // set allegory id
            localStorage.setItem(`slot_0${saveSlot}_scene_allegory_id`, saveData.scene.allegory.id);
            // set allegory title
            localStorage.setItem(`slot_0${saveSlot}_scene_allegory_title`, saveData.scene.allegory.title);
            // set tale id
            //
            // set tale title
            //
            // set tale "isFinal" boolean
            //
            // set current line number
            //

            resolve();
        })
    }

    Load (loadSlot) {
        return new Promise ( (resolve) => {
            let loadData = {
                scene: { 
                    // load allegory data
                    allegory: { id: localStorage.getItem(`slot_0${loadSlot}_scene_allegory_id`), title: localStorage.getItem(`slot_0${loadSlot}_scene_allegory_title`) },
                    // load tale data
                    //
                },
                // load current line number
                //
            }
            resolve(loadData);
        })
        
    }

    UpdateActiveCharacters (character) {
        return new Promise ( (resolve) => {
            this.activeCharacters = this.activeCharacters.filter((entry) => entry.name !== character.name);
            this.activeCharacters.push(character);
            resolve();
        })
    }

}