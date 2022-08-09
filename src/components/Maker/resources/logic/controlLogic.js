

//#region colors

import { NodeSymbol } from "../constants/nodeConstants";
import { calculateStrandImageRenderingPosition } from "./calculationLogic";

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

export const doesSelectedColorExist = (selectedColor, colors) => {
  for (let i = 0; i < colors.length; i++) {
    if (colors[i].letter === selectedColor[i].letter) {
      return true;
    }
  }
  return false;
}

export const doesIdExist = (id, colors) => {
  for (let i = 0; i < colors.length; i++) {
    if (colors[i].letter === id) {
      return true;
    }
  }
  return false;
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

export const removeColorReturnSuccess = (id, colorsCopy, setSelectedColor) => {
  if (!canRemoveColor(colorsCopy)) {
    return false;
  }

  let index = null;
  for (let i = 0; i < colorsCopy.length; i++) {
    if (colorsCopy[i].letter === id) {
      index = i;
      break;
    }
  }

  if (index === null) {
    return false;
  }

  colorsCopy.splice(index, 1);
  setSelectedColor(colorsCopy[0]);
  // colorsCopy[0].isSelected = true;

  // now change the letters according to new indexes
  colorsCopy.forEach((c, i) => {
    c.letter = getCorrespondingLetter(i);
  });
  
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

//#region strands

// this is for when page first loads or the number of strands changes at the beginning
export const createNewDefaultStrandInfosArray = (strandsAcross, selectedColor, colors, strandInfos = []) => {
  // first create copy of current array
  let copy = [...strandInfos];

  // Now, to make it easy, first see if strandsAcross is less than current strandInfos.
  // If so, simply remove the ones from the end that are greater than the count
  if (strandsAcross < strandInfos.length) {
    copy = copy.splice(0, strandsAcross);
  } // otherwise, see if the count is great. If so, add defaults to copy by selected color
  else if (strandsAcross > strandInfos.length) {
    let startIndex = strandInfos.length;
    for (let i = startIndex; i < strandsAcross; i++) {
      copy.push({
        index: i,
        letter: selectedColor.letter,
        color: selectedColor.color,
      });
    }
  }

  copy.forEach((c, i) => {
    if (c.xStart === undefined && c.yStart === undefined) {
      let xy = calculateStrandImageRenderingPosition(i, 0);
      c.xStart = xy.x;
      c.yStart = xy.y;
    }
  });

  // now, if the strands array has values already, update those values
  // according to any changes in color. If a letter/id value no longer exists,
  // set that strand to the selected color values
  if (strandInfos.length === 0) {
    return copy;
  }

  copy.forEach((c) => {
    if (!doesIdExist(c.letter, colors)) {
      if (doesIdExist(selectedColor.letter, colors)) {
        c.letter = selectedColor.letter;
        c.color = selectedColor.color;
      } else {
        c.letter = colors[0].letter;
        c.color = colors[0].color;
      }
    } else {
      let cIndex = getColorIndexById(c.letter, colors);
      c.color = colors[cIndex].color;
    }
  });

  return copy;

}

//#endregion

//#region Button Logic

export const canCompleteSetup = (nodes) => {
  if (nodes.length === 0) {
    return false;
  }

  let firstRow = nodes[0];
  for (let i = 0; i < firstRow.length; i++) {
    if (firstRow[i].nodeSymbol === NodeSymbol.NONE) {
      return false;
    }
  }
  
  return true;
}

//#endregion