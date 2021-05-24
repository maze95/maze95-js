import { maze_entry } from "./maze/script"
import { redroom_entry } from "./redroom/script"

function lvlEntry() {
    let select = prompt("Type level name\nmaze").toLowerCase()

    switch(select) {
        case "maze":
            return maze_entry
        case "redroom":
            return redroom_entry
        default:
            alert("Unknown level, going to maze.")
            return maze_entry
    }
}

let selected_lvl = lvlEntry()

export const SelectedLVL = (req) => {
    switch(req) {
        case "lvlName":
            return selected_lvl[0]
        case "lvlDir":
            return selected_lvl[1]
        case "lvlMus":
            return selected_lvl[2]
        case "pos":
            return selected_lvl[3]
        default:
            throw "Unimplemented data " + req
    }
}