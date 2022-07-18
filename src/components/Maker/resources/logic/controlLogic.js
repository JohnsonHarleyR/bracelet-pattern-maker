

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

export const alterColorHex = (id, colorsCopy, newHex) => {
  for (let i = 0; i < colorsCopy.length; i++) {
    if (colorsCopy[i].letter === id) {
      colorsCopy[i].color = newHex;
      break;
    }
  }
  return colorsCopy;
}

export const addNewColorReturnSuccess = (newHex, colorsCopy, strandsCount) => {
  if (!canAddColor(colorsCopy, strandsCount)) {
    return false;
  }

  colorsCopy.push({
    letter: getCorrespondingLetter(colorsCopy.length),
    color: newHex,
    isSelected: false,
  });
  
  return true;
}

const canAddColor = (colors, strandsAcross) => {
  if (colors.length >= strandsAcross ||
      colors.length >= 26) {
        return false;
  }
  return true;
}

const canRemoveColor = (colors) => {
  if (colors.length < 2) {
    return false;
  }
  return true;
}

const getCorrespondingLetter = (index) => {
  if (index > 25) {
    throw `Error retrieving letter for index. Index out of alphabet range. (getCorrespondingLetter: calculationLogic.js)`;
  }

  let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I",
    "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
    "V", "W", "X", "Y", "Z"]

    return (letters[index]);
}

//#endregion