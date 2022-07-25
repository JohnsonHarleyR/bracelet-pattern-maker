import { ColorValue } from "../constants/designConstants";
import { RowType, StrandOffset } from "../constants/nodeConstants";
import { ImageHeight, ImageName, ImageWidth, LeftOrRight, StageDefaults } from "../constants/stageConstants";
import { calculateCanvasHeight, calculateCanvasWidth, calculateStrandImageRenderingPosition, calculateStrandWidthAndHeight } from "./calculationLogic"
import { drawNumberOnTile, getImage, getNodeImageName, getStrandImageName, getStrandImageNameAfterSetup, getTileInfo, renderCircleFill, renderLeftTopStrandText, renderRightTopStrandText, renderSquareFill } from "./drawLogic";
import { getClosestEndOfColorSpectrum } from "./hexLogic";
import { getRowType } from "./nodeLogic";

//#region Render

export const renderAll = (canvas, nodes, doRenderBackground = true, startingArray = []) => {
  canvas.width = calculateCanvasWidth(nodes[0].length);
  canvas.height = calculateCanvasHeight(nodes.length);

  // add all image items to array
  let renderArray = [...startingArray];

  // bg images first
  if (doRenderBackground) {
    addBgImagesToArray(canvas, nodes, renderArray);
  }

  // now nodes - including their strands
  addAllNodeImagesToArray(canvas, nodes, renderArray);

  // now render everything in the array
  renderNext(canvas, 0, renderArray);

}

// recursive method to render all image items in an array
const renderNext = (canvas, index, array) => {
  let item = array[index];

  if (item.imageName === null) {
    renderSquareFill(canvas, item.color, item.x, item.y, item.width, item.height);
    return;
  }

  let ctx = canvas.getContext("2d");
  let image = new Image();
  image.src = getImage(item.imageName);
  image.onload = () => {
    // check for any fill
    if (item.color !== null) {
      if (!item.isCircle) {
        renderSquareFill(canvas, item.color, item.x, item.y, item.width, item.height);
      } else {
        renderCircleFill(canvas, item.color, item.x, item.y);
      }
    }
    // draw the image
    ctx.drawImage(image, item.x, item.y, item.width, item.height, item.x, item.y, item.width, item.height);

    // check for any text to render
    if (item.strandText !== null) {
      if (item.strandText.leftOrRight === LeftOrRight.LEFT) {
        renderLeftTopStrandText(canvas, item.strandText.text, item.x, item.y);
      } else {
        renderRightTopStrandText(canvas, item.strandText.text, item.x, item.y);
      }
    }

    if (item.rowText !== null) {
      drawNumberOnTile({canvas, xTileStart: item.x, yTileStart: item.y, number: item.rowText.text, leftOrRight: item.rowText.leftOrRight});
    }

    // if it's not the last item in the array, render next item
    if (index !== array.length - 1) {
      renderNext(canvas, index + 1, array);
    }

  }
}

//#endregion

//#region Put together

const addAllNodeImagesToArray = (canvas, nodes, array) => {
  nodes.forEach((row, y) => {
    row.forEach((node, x) => {
      addNodeImagesToArray(canvas, x, y, nodes, array);
    });
  });
}

const addNodeImagesToArray = (canvas, posIndex, rowIndex, nodes, array) => {

  let row = nodes[rowIndex];
  let node = row[posIndex];

  let rowType = getRowType(rowIndex);
  let isFirstRow = rowIndex === 0;
  let isLastRow = rowIndex === nodes.length - 1;
  let isLastLongRow = rowType === RowType.LONG && rowIndex === nodes.length - 2;

  let strandSides = [LeftOrRight.LEFT, LeftOrRight.RIGHT];

  // if it's first row image, add top strand images
  if (isFirstRow) {
    strandSides.forEach(side => {
      // REMEMBER: render letters on top!!
      array.push(createStartOrEndStrandItem(node, posIndex, rowIndex, nodes.length, true, side, canvas.height));
    });
  }

  // if it's last row, add end strands. Otherwise, add bottom strands normally
  if (isLastRow) {
    strandSides.forEach(side => {
      // REMEMBER: render letters on top!!
      array.push(createStartOrEndStrandItem(node, posIndex, rowIndex, nodes.length, false, side, canvas.height));
    });
  } else {
    // if it's the edge, add full bottom image instead of half for specified left or right
        // if it's ALSO last long row besides being edge, add end long end strand instead of short
    let halfHeight = ImageHeight.STRAND_LEFT / 2;
    let isFirst = posIndex === 0;
    let isLast = posIndex === row.length - 1

    strandSides.forEach(side => {
      let isLooseStrand = side === LeftOrRight.LEFT
        ? isLastLongRow && isFirst
        : isLastLongRow && isLast;
      let xStart = side === LeftOrRight.LEFT
        ? node.xStart + StrandOffset.X_BOTTOM_LEFT
        : node.xStart + StrandOffset.X_BOTTOM_RIGHT;
      let yStart = side === LeftOrRight.LEFT
        ? !isLastRow
          ? node.yStart + StrandOffset.Y_BOTTOM_LEFT
          : canvas.height - ImageHeight.STRAND_END_LEFT
        : !isLastRow
          ? node.yStart + StrandOffset.Y_BOTTOM_RIGHT
          : node.yStart - ImageHeight.STRAND_END_RIGHT;
      let width = ImageWidth.STRAND_LEFT;
      let height = !isLastRow
        ? halfHeight
        : ImageHeight.STRAND_END_LEFT;
      if (rowType === RowType.LONG 
        && ((isFirst && side === LeftOrRight.LEFT)
          || (isLast && side === LeftOrRight.RIGHT))) {
            height = ImageHeight.STRAND_LEFT;
      }
      let color = node.getBottomStrandColor(side);
      let imageName = getStrandImageNameAfterSetup(side, isLooseStrand, isLastRow);

      array.push(createImageInfoItem(color, imageName, xStart, yStart, width, height, false, null, null, side));
    });
  }


  // add actual node image and color
  let color = node.getColor();
  let isColorCloserToBlack = getClosestEndOfColorSpectrum(color) === ColorValue.BLACK
  ? true : false;
// let xy = rowType === RowType.SHORT
//   ? calculateEvenNodeRenderingPosition(rowIndex, posIndex, nodes[rowIndex - 1])
//   : calculateOddNodeRenderingPosition(node, rowIndex);
let w = ImageWidth.CIRCLE_BLANK;
let h = ImageHeight.CIRCLE_BLANK;
let imageName = getNodeImageName(node, isColorCloserToBlack);
array.push(createImageInfoItem(color, imageName, node.xStart, node.yStart, w, h, true, null, null, null));

}

const addBgImagesToArray = (canvas, nodes, array) => {
  // first the fill
  array.push(createImageInfoItem(StageDefaults.BG_COLOR, null, 0, 0, canvas.width, canvas.height, false, null, null, null));

  // now add all bg images
  let y = 0;
  let x = 0;

  // rstart row
  addTileRowItemsToArray(null, nodes[0].length, ImageName.TILE_START, y, array);
  y += ImageHeight.TILE_START;

  // inside rows
  for (let i = 0; i < nodes[0].length; i++) {
    addTileRowItemsToArray(i + 1, nodes[0].length, ImageName.TILE, y, array);
    y += ImageHeight.TILE;
  }

  // end row
  addTileRowItemsToArray(null, nodes[0].length, ImageName.TILE_END, y, array);
}

const addTileRowItemsToArray = (rowNumber, nodesAcross, mainTileName, y, array)=> {
  let x = 0;
  let info = getTileInfo(mainTileName);

  // left image
  array.push(createImageInfoItem(null, info.leftName, x, y, info.leftWidth, info.leftHeight, false, null, rowNumber, LeftOrRight.LEFT));
  x = info.leftWidth;

  // middle images
  for (let i = 0; i < nodesAcross - 1; i++) {
    for (let n = 0; n < 2; n++) {
      array.push(createImageInfoItem(null, info.mainName, x, y, info.mainWidth, info.mainHeight, false, null, null, null));
      x += info.mainWidth;
    }
  }

  // right image
  array.push(createImageInfoItem(null, info.rightName, x, y, info.rightWidth, info.rightHeight, false, null, rowNumber, LeftOrRight.RIGHT));

}


//#endregion

//#region Create

const createImageInfoItem = (fillColor, imageName, x, y, width, height,
  isCircle, strandText, rowText, leftOrRight) => {
    return {
      color: fillColor,
      imageName: imageName,
      x: x,
      y: y,
      width: width,
      height: height,
      isCircle: isCircle,
      strandText: strandText === null
        ? null
        : {
          text: strandText,
          leftOrRight: leftOrRight,
        },
      rowText: rowText === null
      ? null
      : {
        text: rowText,
        leftOrRight: leftOrRight,
      },
    }
}

const createStartOrEndStrandItem = (node, posIndex, rowIndex, rowCount, isStart, side, canvasHeight) => {
  let wh = calculateStrandWidthAndHeight(posIndex, rowCount, isStart);
  let strandIndex = posIndex * 2;
  strandIndex += side === LeftOrRight.LEFT
    ? 0
    : 1;
  let xy = calculateStrandImageRenderingPosition(strandIndex, rowIndex, canvasHeight, !isStart);
  let color = isStart === true
    ? side === LeftOrRight.LEFT
      ? node.topLeftStrand.color
      : node.topRightStrand.color
    : node.getBottomStrandColor(side);
  let imageName = getStrandImageName(strandIndex, rowIndex, rowCount, isStart);
  let text = isStart
    ? side === LeftOrRight.LEFT
      ? node.topLeftStrand.letter
      : node.topRightStrand.letter
    : null;

  let newItem = createImageInfoItem(color, imageName, xy.x, xy.y, wh.width, wh.height, false, text, null, side);
  return newItem;
}

//#endregion