export class Line {
    constructor (number, text, speaker, character, options) {
        this.number = number;
        this.text = text;
        this.speaker = speaker;
        this.character = character;
        this.options = options;
    }
}

export class Text {
    constructor (content, options) {
        this.content = content;
        this.options = options;
    }
}

export class TextOptions {
    constructor (data) {
        this.isStyled = data?.isStyled;
        this.size = data?.size;
        this.tags = data?.tags;
    }
}

export class Speaker {
    constructor (name, alias, options) {
        this.name = name;
        this.alias = alias;
        this.options = options;
    }
}

export class SpeakerOptions {
    constructor (data) {
        this.backgroundColor = data?.backgroundColor;
        this.textColor = data?.textColor;
    }
}

export class LineOptions {
    constructor (data) {
        this.scene = data?.scene;
        this.choice = data?.choice;
        this.prompt = data?.prompt;
    }
}

export class SceneOptions {
    constructor (data) {
        this.addPause = data?.addPause;
        this.updateScene = data?.updateScene;
        this.updateBox = data?.updateBox;
    }
}

export class UpdateScene {
    constructor (current, next) {
        this.current = current;
        this.next = next;
    }
}

export class UpdateBox {
    constructor (current, next) {
        this.current = current;
        this.next = next;
    }
}

export class ChoiceOptions {
    constructor (data) {
        this.id = data.id;
        this.lines = data.lines;
    }
}

export class PromptOptions {
    constructor (data) {
        this.number = data?.number;
        this.message = data?.message;
        this.placeholder = data?.placeholder;
    }
}