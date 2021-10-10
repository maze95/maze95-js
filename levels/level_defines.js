import { maze_entry } from "./maze/script.js"

function lvlEntry() {
    const query = window.location.search
    const urlParams = new URLSearchParams(query)
    if (!urlParams.has("level")) return maze_entry
    switch (urlParams.get("level")) {
        case "maze":
            return maze_entry
        default:
            return maze_entry
    }
}

export const SelectedLVL = (req) => { //Returns the selected level's requested data
    let selected_lvl = lvlEntry()
    switch(req) {
        case "lvlName":
            return selected_lvl[0]
        case "lvlDir":
            return selected_lvl[1]
        case "lvlMus":
            return selected_lvl[2]
        case "pos":
            return selected_lvl[3]
        case "col":
            return selected_lvl[4]
        case "ambLightIntensity":
            return selected_lvl[5]
        case "finPos":
            return selected_lvl[6]
        case "startLogoPos":
            return selected_lvl[7]
        case "flg":
            return selected_lvl[8]
        default:
            throw "Unimplemented data " + req
    }
}