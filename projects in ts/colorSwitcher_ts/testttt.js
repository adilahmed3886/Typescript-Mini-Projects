"use strict";
const colorSwitcherContainer = document.querySelector(".colors");
if (!colorSwitcherContainer) {
    throw new Error("Color container not found");
}
const colorSwitcherConfigs = {
    grey: { background: "grey", textColor: "white" },
    white: { background: "white", textColor: "black" },
    blue: { background: "blue", textColor: "white" },
    yellow: { background: "yellow", textColor: "black" },
};
colorSwitcherContainer.addEventListener("mouseover", (e) => {
    if (e.target !== colorSwitcherContainer) {
        const target = e.target;
        const index = Array.from(colorSwitcherContainer.children).indexOf(target);
        const color = Object.keys(colorSwitcherConfigs)[index];
        const config = colorSwitcherConfigs[color];
        document.body.style.backgroundColor = config.background;
        document.body.style.color = config.textColor;
    }
});
