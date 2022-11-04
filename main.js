import { Elements } from "./Components/Elements.js";
import { Data } from "./Components/Data.js";
import { Dialogue } from "./Components/Dialogue.js";
import { Scene } from "./Components/Scene.js";
import { Choice } from "./Components/Choice.js";
import { Script } from "./Components/Script.js";
import { ScriptAPI } from "./API/Fetch.js";

export const DOMManager = new Elements();
export const DataManager = new Data();
export const DialogueManager = new Dialogue();
export const SceneManager = new Scene();
export const ChoiceManager = new Choice();
export const ScriptManager = new Script();
export const APIManager = new ScriptAPI();

const APP = document.querySelector("#app");
const MENU = document.querySelector("#mainMenu");
const TITLE = document.querySelector("#appTitle")

var startBtn = document.querySelector(".start-btn")
var loadBtn = document.querySelector(".load-btn");
var optBtn = document.querySelector(".options-btn");

startBtn.addEventListener("click", StartNewGame);
loadBtn.addEventListener("click", openLoadScreen);
optBtn.addEventListener("click", () => {});

document.addEventListener("DOMContentLoaded", () => {
    DOMManager.init([APP, MENU]);
    // DataManager.init();
})

document.addEventListener("keypress", (ev) => {
    if (ev.code === "Enter" || ev.code === "Space") {
        if (!DialogueManager.data.isFlashing && !DialogueManager.data.skipIsUsed) {
            DialogueManager.data.skipIsUsed = true;
        }
        if (DialogueManager.data.isFlashing) {
            DialogueManager.data.isWaiting = false;
        }
        DialogueManager.data.isFlashing = false;
    }
})

async function StartNewGame () {
    DOMManager.removeElements([MENU.id]);
    DOMManager.removeElements([TITLE.id]);
    SceneManager.Init();
    DialogueManager.Init();
    await ScriptManager.FetchLines();
    await SceneManager.StartNewGame();
}

function openLoadScreen () {
    DOMManager.removeElement(MENU.id);
    MENU.remove();

    DOMManager.addElement("div", "load-screen", "loadScreen", "loadScreenElements");
    DOMManager.addElement("div", "load-slot", "loadSlot_01", "loadScreen", "loadScreenElements");
    DOMManager.addElement("div", "load-slot", "loadSlot_02", "loadScreen", "loadScreenElements");
    DOMManager.addElement("div", "load-slot", "loadSlot_03", "loadScreen", "loadScreenElements");
    DOMManager.addElement("div", "load-slot", "loadSlot_04", "loadScreen", "loadScreenElements");
    DOMManager.addElement("div", "load-slot", "loadSlot_05", "loadScreen", "loadScreenElements");
    DOMManager.addElement("div", "load-slot", "loadSlot_06", "loadScreen", "loadScreenElements");
    
    var slot1 = document.querySelector('#loadSlot_01');
    var slot2 = document.querySelector('#loadSlot_02');
    var slot3 = document.querySelector('#loadSlot_03');
    var slot4 = document.querySelector('#loadSlot_04');
    var slot5 = document.querySelector('#loadSlot_05');
    var slot6 = document.querySelector('#loadSlot_06');

    slot1.addEventListener("click", async () => {
        let loadData = await DataManager.Load(1)
        await SceneManager.LoadScene(loadData);
    })
    slot2.addEventListener("click", async () => {
        let loadData = await DataManager.Load(2)
        await SceneManager.LoadScene(loadData);
    })
    slot3.addEventListener("click", async () => {
        let loadData = await DataManager.Load(3)
        await SceneManager.LoadScene(loadData);
    })
    slot4.addEventListener("click", async () => {
        let loadData = await DataManager.Load(4)
        await SceneManager.LoadScene(loadData);
    })
    slot5.addEventListener("click", async () => {
        let loadData = await DataManager.Load(5)
        await SceneManager.LoadScene(loadData);
    })
    slot6.addEventListener("click", async () => {
        let loadData = await DataManager.Load(6)
        await SceneManager.LoadScene(loadData);
    })
}

