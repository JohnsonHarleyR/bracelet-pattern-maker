
//#region Size Calculations

import { ImageHeight, ImageWidth } from "../constants/stageConstants"

export const calculateCanvasWidth = (nodesAcross) => {
  let endWidths = ImageWidth.TILE_LEFT + ImageWidth.TILE_RIGHT;
  let nodeAreaWidth = ImageWidth.STRAND_LEFT + ImageWidth.STRAND_RIGHT;
  let totalWidth = endWidths + (nodeAreaWidth * nodesAcross);
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

//#endregion

//#region



//#endregion