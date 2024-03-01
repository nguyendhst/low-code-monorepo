//import CustomContextPad from "./CustomContextPad";
import CustomPalette from "./custom-palette";
import CustomRenderer from "./custom-renderer";
import CustomModdle from "./custom.json";
import GSModel from "./model.json"

export const customModdle = ["value", CustomModdle];
export const gsModel = ["value", GSModel];

export default {
    __init__: ["customPalette", "customRenderer"],
    //customContextPad: ["type", CustomContextPad],
    customPalette: ["type", CustomPalette],
    customRenderer: ["type", CustomRenderer],
    customModdle,
    gsModel
};
