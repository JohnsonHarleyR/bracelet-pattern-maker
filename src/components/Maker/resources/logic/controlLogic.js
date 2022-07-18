

//#region colors

export const getColorIndexById = (id, colors) => {
  for (let i = 0; i < colors.length; i++) {
    if (colors[i].letter === id) {
      return i;
    }
  }
  throw `Error finding color id ${id}. (getColorIndexByid: controlLogic.js)`;
}

export const getSelectedColor = (colors) => {
  for (let i = 0; i < colors.length; i++) {
    if (colors[i].isSelected) {
      return {
        letter: colors[i].letter,
        color: colors[i].color,
      }
    }
  }
  throw `Error finding a selected color. (getSelectedColor: controlLogic.js)`;
}

export const alterColorHex = (id, colors, newHex) => {
  for (let i = 0; i < colors.length; i++) {
    if (colors[i].letter === id) {
      colors[i].color = newHex;
      break;
    }
  }
  return colors;
}

//#endregion