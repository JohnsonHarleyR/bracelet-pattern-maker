import Tile from "../images/tile.png";
import TileLeft from "../images/tile-left.png";
import TileRight from "../images/tile-right.png";
import TileStart from "../images/tile-start.png";
import TileStartLeft from "../images/tile-start-left.png";
import TileStartRight from "../images/tile-start-right.png";
import TileEnd from "../images/tile-end.png";
import TileEndLeft from "../images/tile-end-left.png";
import TileEndRight from "../images/tile-end-right.png";
import StrandLeft from "../images/strand-left.png";
import StrandRight from "../images/strand-right.png";
import StrandLeftFinalEdge from "../images/strand-left-final-edge.png";
import StrandRightFinalEdge from "../images/strand-right-final-edge.png";
import StrandStartLeft from "../images/strand-start-left.png";
import StrandStartRight from "../images/strand-start-right.png";
import StrandEndLeft from "../images/strand-end-left.png";
import StrandEndRight from "../images/strand-end-right.png";
import CircleBlank from "../images/blank-circle.png";
import CirclePointLeft from "../images/circle-left-arrow.png";
import CirclePointLeftWhite from "../images/circle-left-arrow-white.png";
import CirclePointRight from "../images/circle-right-arrow.png";
import CirclePointRightWhite from "../images/circle-right-arrow-white.png";
import CircleCurveLeft from "../images/circle-left-curve.png";
import CircleCurveLeftWhite from "../images/circle-left-curve-white.png";
import CircleCurveRight from "../images/circle-right-curve.png";
import CircleCurveRightWhite from "../images/circle-right-curve-white.png";
import { ColorValue } from "../constants/designConstants";
import { RowType, StrandOffset } from "../constants/nodeConstants";
import { ImageHeight, ImageName, ImageWidth, LeftOrRight, StageDefaults } from "../constants/stageConstants";
import { calculateCanvasHeight, calculateCanvasWidth, calculateStrandImageRenderingPosition, calculateStrandWidthAndHeight } from "./calculationLogic"
import { drawNumberOnTile, getNodeImageName, getStrandImageName, getStrandImageNameAfterSetup, getTileInfo, renderCircleFill, renderLeftTopStrandText, renderRightTopStrandText, renderSquareFill } from "./drawLogic";
import { getClosestEndOfColorSpectrum } from "./hexLogic";
import { getRowType } from "./nodeLogic";

//#region Render

export const renderAll = (canvas, nodes, includeBackground = true, startingArray = []) => {
  // add all image items to array
  let renderArray = [...startingArray];

  // bg images first
  if (includeBackground) {
    canvas.width = calculateCanvasWidth(nodes[0].length);
    canvas.height = calculateCanvasHeight(nodes.length);
    addBgImagesToArray(canvas, nodes, renderArray);
  }

  // now nodes - including their strands
  addAllNodeImagesToArray(canvas, nodes, renderArray);

  // now render everything in the array
  renderNext(canvas, 0, renderArray);

}

export const getBgRenderArray = (canvas, nodes) => {
  let renderArray = [];

  // bg images first
  addBgImagesToArray(canvas, nodes, renderArray);
}

// recursive method to render all image items in an array
const renderNext = (canvas, index, array) => {
  if (array[index] === undefined) {
    return;
  }
  
  let item = array[index];

  if (item.imageName === null) {
    renderSquareFill(canvas, item.color, item.x, item.y, item.width, item.height);

    // if it's not the last item in the array, render next item
    if (index !== array.length - 1) {
      renderNext(canvas, index + 1, array);
    }
  } else {
    let ctx = canvas.getContext("2d");
    let image = new Image();
    image.src = getImageLocal(item.imageName);
    image.onload = () => {

      // test
      if (!item.imageName.includes('tile')) {
        console.log(`test - not a tile`);
      }

      // check for any fill
      if (item.color !== null) {
        if (!item.isCircle) {
          renderSquareFill(canvas, item.color, item.x, item.y, item.width, item.height);
        } else {
          renderCircleFill(canvas, item.color, item.x, item.y);
        }
      }

      // draw the image
      ctx.drawImage(image, 0, 0, item.width, item.height, item.x, item.y, item.width, item.height);

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

  // // if it's last row, add end strands. Otherwise, add bottom strands normally
  // if (isLastRow) {
  //   strandSides.forEach(side => {
  //     // REMEMBER: render letters on top!!
  //     array.push(createStartOrEndStrandItem(node, posIndex, rowIndex, nodes.length, false, side, canvas.height));
  //   });
  // } else {

  // }

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
        : canvas.height - ImageHeight.STRAND_END_RIGHT;
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
  for (let i = 0; i < nodes.length; i++) {
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

//#region  Misc

const getImageLocal = (imageName) => {
  switch (imageName) {
    case ImageName.TILE:
      return Tile;
    case ImageName.TILE_LEFT:
      return TileLeft;
    case ImageName.TILE_RIGHT:
      return TileRight;
    case ImageName.TILE_START:
      return TileStart;
    case ImageName.TILE_START_LEFT:
      return TileStartLeft;
    case ImageName.TILE_START_RIGHT:
      return TileStartRight;
    case ImageName.TILE_END:
      return TileEnd;
    case ImageName.TILE_END_LEFT:
      return TileEndLeft;
    case ImageName.TILE_END_RIGHT:
      return TileEndRight;
    case ImageName.STRAND_LEFT:
      return StrandLeft;
    case ImageName.STRAND_RIGHT:
      return StrandRight;
    case ImageName.STRAND_LEFT_FINAL_EDGE:
    return StrandLeftFinalEdge;
    case ImageName.STRAND_RIGHT_FINAL_EDGE:
      return StrandRightFinalEdge;
    case ImageName.STRAND_START_LEFT:
      return StrandStartLeft;
    case ImageName.STRAND_START_RIGHT:
      return StrandStartRight;
    case ImageName.STRAND_END_LEFT:
      return StrandEndLeft;
    case ImageName.STRAND_END_RIGHT:
      return StrandEndRight;
    case ImageName.CIRCLE_BLANK:
      return CircleBlank;
    case ImageName.CIRCLE_POINT_LEFT:
      return CirclePointLeft;
    case ImageName.CIRCLE_POINT_LEFT_WHITE:
      return CirclePointLeftWhite;
    case ImageName.CIRCLE_POINT_RIGHT:
      return CirclePointRight;
    case ImageName.CIRCLE_POINT_RIGHT_WHITE:
      return CirclePointRightWhite;
    case ImageName.CIRCLE_CURVE_LEFT:
      return CircleCurveLeft;
    case ImageName.CIRCLE_CURVE_LEFT_WHITE:
      return CircleCurveLeftWhite;
    case ImageName.CIRCLE_CURVE_RIGHT:
      return CircleCurveRight;
    case ImageName.CIRCLE_CURVE_RIGHT_WHITE:
      return CircleCurveRightWhite;

  }
}

//#endregion
