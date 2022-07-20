
import { ImageHeight, ImageWidth } from "../constants/stageConstants"

//#region Basic Math Calculations

export const isEven = (number) => {
  if (number % 2 === 0) {
    return true;
  }
  return false;
}

//#endregion

//#region Index Calculations

export const getNodeIndexByStrandIndex = (strandIndex) => {
  // add one in order to do regular math - (index typically starts at 0)
  let relStrandIndex = strandIndex + 1;

  // 1,2 = 1; 3,4 = 2; 5,6 = 3;
  // For this reason, if relStrandIndex is an odd number, add one again. (ex. 5 + 1 = 6 which = 3)
  if (!isEven(relStrandIndex)) {
    relStrandIndex ++;
  }

  // now get relative node index by dividing (each node has two strands connected)
  let relNodeIndex = relStrandIndex / 2;

  // subtract one to get actual index
  return relNodeIndex - 1;
  
}

export const getStrandIndexesByNodeIndex = (nodeIndex) => {
    // add one in order to do regular math - (index typically starts at 0)
    let relNodeIndex = nodeIndex + 1;

    // 1,2 = 1; 3,4 = 2; 5,6 = 3;
    // get the 2nd strand number by multiplying by two
    let relStrand2Index = relNodeIndex * 2;

    // the first index will be 1 less than the 2nd
    let relStrand1Index = relStrand2Index - 1;
  
    // subtract one from each to get actual indexes
    return [relStrand1Index - 1, relStrand2Index - 1];
}

//#endregion

//#region Position Calculations

export const calculateStrandImageRenderingPosition = (positionIndex, rowIndex, canvasHeight, isEnd = false) => {
  let yStart = rowIndex === 0 && !isEnd
    ? 0
    : ImageHeight.STRAND_START_LEFT + (rowIndex * ImageHeight.STRAND_LEFT);

  if (isEnd) {
    yStart = canvasHeight - ImageHeight.STRAND_END_LEFT;
  }

  let xStart = ImageWidth.TILE_START + (positionIndex * ImageWidth.STRAND_LEFT);

  return {x: xStart, y: yStart};
}

export const calculateOddNodeRenderingPosition = (node, rowIndex) => {
  let xStart = node.topLeftStrand.xStart + ImageWidth.STRAND_LEFT - (ImageWidth.CIRCLE_BLANK / 2);
  let yStart = ImageHeight.TILE_START + (rowIndex * (ImageHeight.TILE / 2));
  return {x: xStart, y: yStart};
}

export const calculateEvenNodeRenderingPosition = (rowIndex, prevRow) => {
  let aboveLeftNode = prevRow[rowIndex];
  let aboveRightNode = prevRow[rowIndex + 1];
  let aboveLeftX = calculateOddNodeRenderingPosition(aboveLeftNode, rowIndex).xStart;
  let aboveRightX = calculateOddNodeRenderingPosition(aboveRightNode, rowIndex + 1).xStart;
  let halfXDistance = (aboveRightX - aboveLeftX) / 2;

  let xStart = aboveLeftX + halfXDistance;
  let yStart = ImageHeight.TILE_START + (rowIndex * (ImageHeight.TILE / 2));
  return {x: xStart, y: yStart};
}

//#endregion

//#region Size Calculations

export const calculateCanvasWidth = (nodesAcross) => {
  let endWidths = ImageWidth.TILE_LEFT + ImageWidth.TILE_RIGHT;
  let nodeAreaWidth = ImageWidth.STRAND_LEFT + ImageWidth.STRAND_RIGHT;
  let totalWidth = endWidths + (nodeAreaWidth * (nodesAcross - 1));
  return totalWidth;
}

export const calculateCanvasHeight = (rowCount) => {
  let endHeights = ImageHeight.TILE_START + ImageHeight.TILE_END;
  let rowsHeight = ImageHeight.TILE * rowCount;
  let totalHeight = endHeights + rowsHeight;
  return totalHeight;
}

export const calculateNumberOfBackgroundImages = (nodesAcross, rowCount) => {
  const sideTiles = 2;
  const tilesPerNode = 2;
  const imagesInARow = tilesPerNode * nodesAcross + sideTiles;
  const totalRows = rowCount + sideTiles;

  const total = imagesInARow * totalRows;
  return total;
}

export const calculateNumberOfStrandImages = (nodesAcross, rowCount) => {
  const strandsAcross = nodesAcross * 2;
  let total = strandsAcross * rowCount + strandsAcross;
  return total;
}

export const calculateStrandWidthAndHeight = (rowIndex, rowCount, isStart) => {
  let width = ImageWidth.STRAND_LEFT;
  let height = ImageHeight.STRAND_LEFT;
  if (isStart) {
    height = ImageHeight.STRAND_START_LEFT;
  } else if (rowIndex === rowCount - 1) {
    height = ImageHeight.STRAND_END_LEFT;
  }

  return {
    width: width,
    height: height,
  }
}

//#endregion