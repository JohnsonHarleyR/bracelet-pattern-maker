
import { PatternDefaults } from "../constants/designConstants";
import { RowType } from "../constants/nodeConstants";
import { getRowType } from "./nodeLogic";

//#region Creation


export const createPatternFromNodes = (nodes) => {
  let vertWidth = calculatePatternThickness(nodes);
  
  let newPattern = [];

  let count = 0;
  let xStartBegin = 0;
  let xStart = 0;
  do {

    for (let x = 0; x < nodes.length; x++) {
      if (count >= PatternDefaults.TILES_LONG) {
        break;
      }

      let rowType = getRowType(x);
      let prevRow = rowType === RowType.LONG
        ? null
        : nodes[x-1];
      let leftColor = rowType === RowType.LONG
        ? null
        : prevRow[0].bottomLeftStrand.color;
      let rightColor = rowType === RowType.LONG
        ? null
        : prevRow[prevRow.length - 1].bottomRightStrand.color;

      let xPass = count === 0 ? x : x + 1;
      xStart = calculateXStartForPatternCol(xPass) + xStartBegin;

      let newCol = createPatternColFromNodeRow(rowType, xStart, nodes[x], vertWidth, leftColor, rightColor);
      newPattern.push(newCol);
    }

    count++;
    xStartBegin = xStart;

  } while (count < PatternDefaults.TILES_LONG);
    // this pattern will be sidesways so switch x and y


  return newPattern;
}

const createPatternColFromNodeRow = (rowType, xStart, row, vertWidth, leftColor, rightColor) => {
  // start at bottom of vertWidth
  // if it's a long row, draw full tile first
  // otherwise, draw half a tile (vertical height with left and right colors from row before)
  let newRow = [];

  let halfTileSize = PatternDefaults.TILE_SIZE / 2;

  let yStart = vertWidth;
  if (rowType === RowType.SHORT) {
    yStart = yStart - halfTileSize;

    // push left half tile
    newRow.push({
      color: leftColor,
      x: xStart,
      y: yStart,
      width: PatternDefaults.TILE_SIZE,
      height: halfTileSize,
    });
  }

  // push in between tiles
  row.forEach((n) => {
    yStart = yStart - PatternDefaults.TILE_SIZE;
    newRow.push({
      color: n.getColor(),
      x: xStart,
      y: yStart,
      width: PatternDefaults.TILE_SIZE,
      height: PatternDefaults.TILE_SIZE,
    });
  });


  if (rowType === RowType.SHORT) {
    yStart = yStart - halfTileSize;
    // push right half tile
    newRow.push({
      color: rightColor,
      x: xStart,
      y: 0,
      width: PatternDefaults.TILE_SIZE,
      height: halfTileSize
    });
  }

  return newRow;
}

//#endregion

//#region Calculations

const calculateXStartForPatternCol = (colIndex) => {
  let xStart = PatternDefaults.TILE_SIZE * colIndex;
  return xStart;
}

export const calculatePatternLength = () => {
  let length = PatternDefaults.TILE_SIZE * PatternDefaults.TILES_LONG;
  return length;
}

export const calculatePatternThickness = (nodes) => {
  let width = nodes[0].length * PatternDefaults.TILE_SIZE;
  return width;
}

//#endregion