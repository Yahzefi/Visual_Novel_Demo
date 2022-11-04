export const UpdateCharacter = (payload) => {
    switch(payload.type) {
        case "INIT":
            payload.element.classList = ["character-image start-inactive no-display"]
            break;
        case "ADD":
            payload.element.classList.add(payload.styles)
            break;
        case "UPDATE":
            payload.element.classList.replace(payload.styles.current, payload.styles.next);
            break;
        case "DELETE":
            payload.element.classList.remove(payload.styles)
            break;
        default: 
            break;
    }
}