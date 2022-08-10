import { createFirstRowOfNodes } from "./nodeLogic";

//#region Bringing it together

export const loadPatternText = (text) => {
  text = preformatText(text);
  console.log(`text: `, `"${text}"`);
  let result = {
    isSuccessful: true,
    error: 'no error',
  };

  if (text.length === 0) {
    result.isSuccessful = false;
    result.error = 'No text was entered.';
  }


  return result;
};

const preformatText = (text) => {
  return text.toLowerCase().trim();
}

//#endregion

//#region Validation

//#endregion

//#region Hex Values

export const createColorsFromHexString = (hexString) => {
  let alphabet =
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
    'U', 'V', 'W', 'X', 'Y', 'Z'];
  let hexValues = decodeHexStringIntoValues(hexString);
  let newColors = [];
  hexValues.forEach((hex, i) => {
    let isSelected = i === 0;
    newColors.push({
      letter: alphabet[i],
      color: hex,
      isSelected: isSelected,
    });
  });
  return newColors;
}

const decodeHexStringIntoValues = (hexString) => {
  let hexValues = [];
  let values = hexString.split(' ');
  values.forEach(v => {
    hexValues.push(`#${v}`);
  });

  return hexValues;
}

//#endregion

//#region Strand Values

export const createStrandInfosFromString = (strandString, colors) => {
  let infos = [];
  for (let i = 0; i < strandString.length; i++) {
    let letter = strandString.substring(i, 1).toUpperCase();
    let color = getColorByLetter(letter, colors);
    if (color === null) {
      return null;
    }
    infos.push({
      index: i,
      letter: letter,
      color: color.color,
    });
  }
  return infos;
}

const getColorByLetter = (letter, colors) => {
  for (let i = 0; i < colors.length; i++) {
    if (colors[i].letter === letter) {
      return colors[i];
    }
  }
  return null;
}

//#endregion

//#region  Node Values

export const createNodesFromNodeString = (startStrandInfos, nodeString) => {
  let graphArray = breakNodeStringIntoGraphArray(nodeString);

  if (graphArray[0].length !== startStrandInfos.length / 2 ||
    !hasCorrectCounts(graphArray)) {
    return null;
  }

  let firstRow = createFirstRowOfNodes(startStrandInfos, []);
}

const hasCorrectCounts = (graphArray) => {
  let longCount = graphArray[0].length;
  let shortCount = longCount - 1;

  for (let i = 0; i < graphArray.length; i++) {
    let isShort = i + 1 % 2 === 0;
    if ((!isShort && graphArray[i].length !== longCount) ||
      (isShort && graphArray[i].length !== shortCount)) {
        return false;
      }
  }
  return true;
}

const breakNodeStringIntoGraphArray = (nodeString) => {
  // break apart by line breaks first
  let rowLines = nodeString.split(`\n`);
  console.log(`test - rows counted: ${rowLines.length}`);

  let graphArray = [];
  for (let i = 0; i < rowLines.length; i++) {
    let row = rowLines[i];
    let brokenUp = row.split(',');
    graphArray.push(brokenUp);
  }

  // TODO add trimming

  console.log(graphArray);


  return graphArray;
}


//#endregion