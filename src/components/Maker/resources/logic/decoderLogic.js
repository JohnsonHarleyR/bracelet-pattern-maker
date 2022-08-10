import { createAllNodesAfterSetup, createFirstRowOfNodes } from "./nodeLogic";
import { Alphabet } from "../constants/loadConstants";
import { isEven } from "./calculationLogic";
import { StageDefaults } from "../constants/stageConstants";
import { NodeSymbol } from "../constants/nodeConstants";

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
  let strandInfos = null;
  let nodes = null;

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
    let trimmed = pl.trim();
    if (trimmed !== '') {
      lines.push(trimmed);
    }
  });

  // error if not 5 lines - which is important
  if (lines.length < 4) {
    result.isSuccessful = false;
    result.error = 'Not enough lines were entered. Is the direction pattern at least two lines?';
    return result;
  }

  // decode and validate hex line - which is line 0
  let colorsResult = createColorsFromHexString(lines[0]);
  if (colorsResult.isSuccessful) {
    colors = colorsResult.values;
  } else {
    result.isSuccessful = false;
    result.error = colorsResult.error;
    return result;
  }

  // decode and validate strandinfos line - which is line 1
  let strandsResult = createStrandInfosFromString(lines[1].trim(), colors);
  if (strandsResult.isSuccessful) {
    strandInfos = strandsResult.values;
  } else {
    result.isSuccessful = false;
    result.error = strandsResult.error;
    return result;
  }

  // now put every other line into its own array and attempt to turn it into a graph
  // monitor results of this. After that, create nodes.
  let nodeLines = [];
  for (let i = 2; i < lines.length; i++) {
    nodeLines.push(lines[i]);
  }

  if (!isEven(nodeLines.length)) {
    result.isSuccessful = false;
    result.error = 'There must be an even number of lines for the knot directions portion.';
    return result;
  }

  let nodeGraphResult = breakNodeLinesIntoGraphArray(nodeLines, strandInfos.length);
  let nodeGraph = nodeGraphResult.values;
  if (!nodeGraphResult.isSuccessful) {
    result.isSuccessful = false;
    result.error = nodeGraphResult.error;
    return result;
  }

  // create nodes now
  console.log(`node graph: `, nodeGraph);
  nodes = createNodesWithGraphArray(nodeGraph, strandInfos);

  // add all the content
  result.content.colors = colors;
  result.content.strandInfos = strandInfos;
  result.content.nodes = nodes;

  return result;
};

const preformatText = (text) => {
  return text.toLowerCase().trim();
}

//#endregion

//#region Validation

const isValidNodeDirectionValue = (str) => {
  switch (str) {
    case 'f':
    case 'b':
    case 'fb':
    case 'bf':
      return true;
    default:
      return false;
  }
}

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
  let result = {
    isSuccessful: true,
    error: 'no error',
    values: null,
  };


  let infos = [];
  for (let i = 0; i < strandString.length; i++) {
    let letter = strandString.substring(i, i + 1).toUpperCase();
    if (letter.trim() === '') {
      continue;
    }
    let color = getColorByLetter(letter, colors);
    if (color === null) {
      result.isSuccessful = false;
      result.error = "One of the strand letters did not match any provided hex value.";
      return result;
    }
    infos.push({
      index: i,
      letter: letter,
      color: color.color,
    });
  }

  if (!isEven(infos.length)) {
    result.isSuccessful = false;
    result.error = 'The number of strands must be even.';
    return result;
  }

  if (infos.length === 0) {
    result.isSuccessful = false;
    result.error = "No valid letters in strand values line.";
    return result;
  }

  if (infos.length < StageDefaults.MIN_STRANDS) {
    result.isSuccessful = false;
    result.error = `There must be at least ${StageDefaults.MIN_STRANDS} strands.`;
    return result;
  }

  if (infos.length > StageDefaults.MAX_STRANDS) {
    result.isSuccessful = false;
    result.error = `The max number of strands is ${StageDefaults.MAX_STRANDS}.`;
    return result;
  }

  result.values = infos;
  return result;
}

const getColorByLetter = (letter, colors) => {
  for (let i = 0; i < colors.length; i++) {
    //console.log(`letter: ${letter}, color letter: ${colors[i].letter}`);
    if (colors[i].letter === letter) {
      return colors[i];
    }
  }
  return null;
}

//#endregion

//#region  Node Values

export const createNodesWithGraphArray = (graphArray, startStrandInfos) => {
  let nodesAcross = graphArray[0].length;
  console.log(`nodes across: `, nodesAcross);
  let rowCount = graphArray.length;
  console.log(`row count: `, rowCount);

  let firstRow = createFirstRowOfNodes(startStrandInfos, []);
  console.log(`first row: `, firstRow);
  let allNodes = createAllNodesAfterSetup([firstRow], nodesAcross, rowCount);
  console.log(`all nodes: `, allNodes);

  // run through nodes and change directions according to the graph array
  for (let y = 0; y < allNodes.length; y++) {
    let nodeRow = allNodes[y];
    let graphRow = graphArray[y];
    for (let x = 0; x < nodeRow.length; x++) {
      let node = nodeRow[x];
      let dir = graphRow[x];
      switch (dir) {
        default:
        case 'f':
          node.changeNodeSymbol(NodeSymbol.RIGHT);
          break;
        case 'fb':
          node.changeNodeSymbol(NodeSymbol.RIGHT_LEFT);
          break;
        case 'b':
          node.changeNodeSymbol(NodeSymbol.LEFT);
          break;
        case 'bf':
          node.changeNodeSymbol(NodeSymbol.LEFT_RIGHT);

      }
    } 
  }

  // return
  return allNodes;
}

const breakNodeLinesIntoGraphArray = (rowLines, numberOfStrands) => {
  let result = {
    isSuccessful: true,
    error: 'no error',
    values: null,
  }

  let longLength = numberOfStrands / 2;
  let shortLength = longLength - 1;
  let graphArray = [];
  for (let i = 0; i < rowLines.length; i++) {
    let row = rowLines[i];
    let brokenUp = row.split(',');
    let rowItems = [];
    brokenUp.forEach(n => {
      let trimmed = n.trim();
      if (trimmed !== '') {
        if (!isValidNodeDirectionValue(trimmed)) {
          result.isSuccessful = false;
          result.error = "A knot direction is invalid.";
        }
        rowItems.push(rowItems);
      }
    });

    if (!result.isSuccessful) {
      return result;
    }

    let isLong = (i + 1) % 2 !== 0;
    if ((isLong && rowItems.length !== longLength) ||
        (!isLong && rowItems.length !== shortLength)) {
          result.isSuccessful = false;
          result.error = `One of the knot rows did not have the correct number of knots.`;
          return result;
        }

    graphArray.push(brokenUp);
  }

  //console.log(graphArray);

  result.values = graphArray;
  return result;
}

//#endregion