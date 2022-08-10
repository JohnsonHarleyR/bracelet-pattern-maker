import { createFirstRowOfNodes } from "./nodeLogic";
import { Alphabet } from "../constants/loadConstants";

//#region Bringing it together

export const loadPatternText = (text) => {
  text = preformatText(text);
  //console.log(`text: `, `"${text}"`);
  let result = {
    isSuccessful: true,
    error: 'no error',
    content: {},
  };

  // stuff to store
  let colors = null;

  // blank content error
  if (text.length === 0) {
    result.isSuccessful = false;
    result.error = 'No text was entered.';
    return result;
  }

  // remove blank lines.
  let preLines = text.split('\n');
  let lines = [];
  preLines.forEach(pl => {
    if (pl.trim() !== '') {
      lines.push(pl);
    }
  });

  // error if not 5 lines - which is important
  if (lines.length < 5) {
    result.isSuccessful = false;
    result.error = 'Not enough lines were entered. Is the direction pattern at least two lines?';
    return result;
  }

  // decode and validate hex line - which is line 1
  let colorsResult = createColorsFromHexString(lines[0]);
  if (colorsResult.isSuccessful) {
    colors = colorsResult.values;
  } else {
    result.isSuccessful = false;
    result.error = colorsResult.error;
    return result;
  }

  return result;
};

const preformatText = (text) => {
  return text.toLowerCase().trim();
}

//#endregion

//#region Validation

const isAlphabetValue = (letter) => {
  if (Alphabet.lower.includes(preformatText(letter))) {
    return true;
  }
  return false;
}

const isNumberValue = (value) => {
  let nums = [1,2,3,4,5,6,7,8,9,0];
  for (let i = 0; i < nums.length; i++) {
    if (`${nums[i]}` === `${value}`) {
      return true;
    }
  }
  return false;
}

const areHexCharactersValid = (hex) => {
  for (let i = 1; i < hex.length; i++) {
    let character = hex.substring(i, i + 1);
    if (!isAlphabetValue(character) && !isNumberValue(character)) {
      //console.log('a character was not valid');
      return false;
    }
  }
  //console.log('characters were valid');
  return true;
}

//#endregion

//#region Hex Values

export const createColorsFromHexString = (hexString) => {
  let result = {
    isSuccessful: true,
    error: 'no error',
    values: null,
  };

  let alphabet =
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
    'U', 'V', 'W', 'X', 'Y', 'Z'];
  let hexResult = decodeHexStringIntoValues(hexString);
  if (!hexResult.isSuccessful) {
    //console.log(`hex result not valid`);
    result.isSuccessful = false;
    result.error = hexResult.error;
    return result;
  }

  let hexValues = hexResult.values;
  let newColors = [];
  hexValues.forEach((hex, i) => {
    let isSelected = i === 0;
    newColors.push({
      letter: alphabet[i],
      color: hex,
      isSelected: isSelected,
    });
  });

  result.values = newColors;
  return result;
}

const decodeHexStringIntoValues = (hexString) => {
  let result = {
    isSuccessful: true,
    error: 'no error',
    values: null,
  }
  let hexValues = [];
  let values = hexString.split(' ');
  for (let i = 0; i < values.length; i++) {
    let value = preformatText(values[i]);
    let newValue = value;
    if (value.length !== 0 && value.substring(0, 1) !== '#') {
      newValue = `#${value}`;
    }
    if (newValue.length !== 7) {
      result.isSuccessful = false;
      result.error = "A hex value did not have enough characters.";
      return result;
    }
    
    if (areHexCharactersValid(newValue)) {
      hexValues.push(newValue);
    } else {
      result.isSuccessful = false;
      result.error = "A hex value was not valid.";
      return result;
    }
    
  }

  if (hexValues.length === 0) {
    result.isSuccessful = false;
    result.error = "No valid hex values were entered.";
    return result;
  }

  result.values = hexValues;

  return result;
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