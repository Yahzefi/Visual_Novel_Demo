// DIALOGUE ELEMENTS \\
import { UpdateDialogueContainer } from "./Dialogue/Container.js";
import { UpdateDialogueBox } from "./Dialogue/Box.js";
import { UpdateSpeakerContainer } from "./Dialogue/SpeakerContainer.js";
import { UpdateSpeakerText } from "./Dialogue/SpeakerText.js";
import { UpdateTextContainer } from "./Dialogue/Text/Container.js";
import { UpdateTextContent } from "./Dialogue/Text/Text.js";
import { UpdatePromptContainer } from "./Dialogue/PromptContainer.js";
import { UpdatePromptText } from "./Dialogue/PromptText.js";
// SCENE ELEMENTS \\
import { UpdateBackground } from "./Scene/Background.js";
import { UpdateSceneContainer } from "./Scene/Container.js";
import { UpdateDimmer } from "./Scene/Dimmer.js";
import { UpdateTransition } from "./Scene/Transition.js";
import { UpdateTitle } from "./Scene/Title.js";
import { UpdateChapter } from "./Scene/Chapter.js";
// CHARACTER ELEMENT \\
import { UpdateCharacter } from "./Character.js";
import { UpdatePromptIcon } from "./Dialogue/PromptIcon.js";


export const UpdateStyle = async (type, payload) => {
    if (type === "DIALOGUE") {
        switch (payload.element) {
            case "CONTAINER":
                UpdateDialogueContainer(payload.type, payload.styles)
                break;
            case "BOX":
                UpdateDialogueBox(payload.type, payload.styles)
                break;
            case "SPEAKER_CONTAINER":
                UpdateSpeakerContainer(payload.type, payload.styles)
                break;
            case "SPEAKER_TEXT":
                UpdateSpeakerText(payload.type, payload.styles)
                break;
            case "TEXT_CONTAINER":
                UpdateTextContainer(payload.type, payload.styles)
                break;
            case "TEXT_CONTENT":
                UpdateTextContent(payload.type, payload.index, payload.styles)
                break;
            case "PROMPT_CONTAINER":
                UpdatePromptContainer(payload.type, payload.styles)
                break;
            case "PROMPT_ICON":
                UpdatePromptIcon(payload.type, payload.styles)
                break;
            case "PROMPT_TEXT":
                UpdatePromptText(payload.type, payload.styles)
                break;
            default:
                break;
        }
    } else if (type === "SCENE") {
        switch (payload.element) {
            case "CONTAINER":
                UpdateSceneContainer(payload.type, payload.styles)
                break;
            case "BACKGROUND":
                UpdateBackground(payload.type, payload.styles)
                break;
            case "DIMMER":
                UpdateDimmer(payload.type, payload.styles)
                break;
            case "TRANSITION":
                UpdateTransition(payload.type, payload.styles)
                break;
            case "TITLE":
                UpdateTitle(payload.type, payload.styles)
                break;
            case "CHAPTER":
                UpdateChapter(payload.type, payload.styles)
                break;
            default:
                break;
        }
    } else if (type === "CHARACTER") {
        UpdateCharacter(payload);
    }
}