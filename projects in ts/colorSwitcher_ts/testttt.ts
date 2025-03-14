interface ColorConfig {
  background: string;
  textColor: string;
}

interface ColorConfigs {
  [key: string]: ColorConfig;
}

const colorSwitcherContainer = document.querySelector(".colors") as HTMLElement;
if (!colorSwitcherContainer) {
  throw new Error("Color container not found");
}

const colorSwitcherConfigs: ColorConfigs = {
  grey: { background: "grey", textColor: "white" },
  white: { background: "white", textColor: "black" },
  blue: { background: "blue", textColor: "white" },
  yellow: { background: "yellow", textColor: "black" },
};

colorSwitcherContainer.addEventListener("mouseover", (e: Event) => {
  if (e.target !== colorSwitcherContainer) {
    const target = e.target as HTMLElement;
    const index = Array.from(colorSwitcherContainer.children).indexOf(target);
    const color = Object.keys(colorSwitcherConfigs)[index];
    const config = colorSwitcherConfigs[color];

    document.body.style.backgroundColor = config.background;
    document.body.style.color = config.textColor;
  }
});
