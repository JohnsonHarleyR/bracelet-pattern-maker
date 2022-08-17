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
import { ImageHeight, ImageName, ImageWidth, LeftOrRight, StageDefaults, TileTextOffset } from "../constants/stageConstants";
import { calculateEvenNodeRenderingPosition, calculateOddNodeRenderingPosition, calculateStrandImageRenderingPosition, calculateStrandImageRenderingPositionForLower, calculateStrandWidthAndHeight, showRenderPositionDifferences } from "./calculationLogic";
import { NodeDefaults, NodeSymbol, RowType, StrandOffset } from "../constants/nodeConstants";
import { getClosestEndOfColorSpectrum } from "./hexLogic";
import { ColorValue, PatternDefaults, TextDefaults } from "../constants/designConstants";
import { getRowType } from "./nodeLogic";

//#region Rendering Background

export const renderBackground = (canvas, nodesAcross, rowCount, clearLoadedCount, addToLoadedCount) => {
  clearLoadedCount();
  
  // first draw default background color
  fillBackground(canvas);

  // now draw background tiles
  renderBackgroundTiles(canvas, nodesAcross, rowCount, addToLoadedCount);

  // test
  //renderCircleFill(canvas, "#ffff00", 5, 5);

  // TODO now draw forefront images
  //console.log(`bg rendered`);
}

const renderBackgroundTiles = (canvas, nodesAcross, rowCount, addToLoadedCount) => {
  let y = 0;

  // render start row
  renderTileRow(canvas, nodesAcross, ImageName.TILE_START, y, addToLoadedCount);
  y += ImageHeight.TILE_START;

  // render inside rows
  for (let i = 0; i < rowCount; i++) {
    renderTileRow(canvas, nodesAcross, ImageName.TILE, y, addToLoadedCount, i + 1);
    y += ImageHeight.TILE;
  }

  // render end row
  renderTileRow(canvas, nodesAcross, ImageName.TILE_END, y, addToLoadedCount);
}

const renderTileRow = (canvas, nodesAcross, mainTileName, yCoord, addToLoadedCount, rowNumber = null) => {
  let y = yCoord;
  let x = 0;

  let info = getTileInfo(mainTileName);

  // render left tile
  let methodToPass = rowNumber !== null
    ? drawNumberOnTile
    : null;
  let paramToPass = rowNumber !== null
    ? {xTileStart: x, yTileStart: y, number: rowNumber, leftOrRight: LeftOrRight.LEFT}
    : {x: null, y: null, number: null, leftOrRight: null};

  renderImage(canvas, info.leftName, x, y,
    info.leftWidth, info.leftHeight, addToLoadedCount,
    methodToPass, paramToPass);
  x = info.leftWidth;

  // render between tiles
  for (let i = 0; i < nodesAcross - 1; i++) {
    for (let n = 0; n < 2; n++) {
      renderImage(canvas, info.mainName, x, y, info.mainWidth, info.mainHeight, addToLoadedCount);
      x += info.mainWidth;
    }
  }

  // render right tiles
  paramToPass = rowNumber !== null
    ? {xTileStart: x, yTileStart: y, number: rowNumber, leftOrRight: LeftOrRight.RIGHT}
    : {x: null, y: null, number: null, leftOrRight: null};
  renderImage(canvas, info.rightName, x, y,
    info.rightWidth, info.rightHeight, addToLoadedCount,
    methodToPass, paramToPass);
}

const fillBackground = (canvas) => {
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = StageDefaults.BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export const getTileInfo = (tileName) => {
  switch (tileName) {
    case ImageName.TILE:
      return {
        mainName: tileName,
        mainWidth: ImageWidth.TILE,
        mainHeight: ImageHeight.TILE,

        leftName: ImageName.TILE_LEFT,
        leftWidth: ImageWidth.TILE_LEFT,
        leftHeight: ImageHeight.TILE_LEFT,

        rightName: ImageName.TILE_RIGHT,
        rightWidth: ImageWidth.TILE_RIGHT,
        rightHeight: ImageHeight.TILE_RIGHT,
      }
    case ImageName.TILE_START:
      return {
        mainName: tileName,
        mainWidth: ImageWidth.TILE_START,
        mainHeight: ImageHeight.TILE_START,

        leftName: ImageName.TILE_START_LEFT,
        leftWidth: ImageWidth.TILE_START_LEFT,
        leftHeight: ImageHeight.TILE_START_LEFT,

        rightName: ImageName.TILE_START_RIGHT,
        rightWidth: ImageWidth.TILE_START_RIGHT,
        rightHeight: ImageHeight.TILE_START_RIGHT,
      }
    case ImageName.TILE_END:
      return {
        mainName: tileName,
        mainWidth: ImageWidth.TILE_END,
        mainHeight: ImageHeight.TILE_END,

        leftName: ImageName.TILE_END_LEFT,
        leftWidth: ImageWidth.TILE_END_LEFT,
        leftHeight: ImageHeight.TILE_END_LEFT,

        rightName: ImageName.TILE_END_RIGHT,
        rightWidth: ImageWidth.TILE_END_RIGHT,
        rightHeight: ImageHeight.TILE_END_RIGHT,
      }
  }
}

//#endregion

//#region Rendering Shapes
export const renderCircleFill = (canvas, color, xTLC, yTLC) => {
  let radius = ImageWidth.CIRCLE_BLANK / 2;
  let x = xTLC + radius;
  let y = yTLC + radius;

  let ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

export const renderSquareFill = (canvas, color, x, y, w, h) => {
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

//#endregion

//#region  Rendering Nodes

export const renderNodes = (canvas, nodes) => {
  for (let y = 0; y < nodes.length; y++) {
    let row = nodes[y];
    for (let x = 0; x < row.length; x++) {
      renderNode(canvas, row[x]);
    }
  }

}

const renderNode = (canvas, node) => {

  let color = node.getColor();
  let isColorCloserToBlack = getClosestEndOfColorSpectrum(color) === ColorValue.BLACK
    ? true : false;
  // let xy = rowType === RowType.SHORT
  //   ? calculateEvenNodeRenderingPosition(rowIndex, posIndex, nodes[rowIndex - 1])
  //   : calculateOddNodeRenderingPosition(node, rowIndex);
  let w = ImageWidth.CIRCLE_BLANK;
  let h = ImageHeight.CIRCLE_BLANK;
  let imageName = getNodeImageName(node, isColorCloserToBlack);

  // node.startX = xy.x;
  // node.startY = xy.y;

  renderCircleImageWithUnderFill(canvas, imageName, color, node.xStart, node.yStart, w, h);
  //renderImage(canvas, imageName, xy.x, xy.y, w, h);
}

export const getNodeImageName = (node, isColorCloserToBlack = false) => {
  switch(node.nodeSymbol) {
    case NodeSymbol.NONE:
      return ImageName.CIRCLE_BLANK;
    case NodeSymbol.LEFT:
      return isColorCloserToBlack
        ? ImageName.CIRCLE_POINT_LEFT_WHITE
        : ImageName.CIRCLE_POINT_LEFT;
    case NodeSymbol.LEFT_RIGHT:
      return isColorCloserToBlack
        ? ImageName.CIRCLE_CURVE_RIGHT_WHITE
        : ImageName.CIRCLE_CURVE_RIGHT;
    case NodeSymbol.RIGHT:
      return isColorCloserToBlack
        ? ImageName.CIRCLE_POINT_RIGHT_WHITE
        : ImageName.CIRCLE_POINT_RIGHT;
    case NodeSymbol.RIGHT_LEFT:
      return isColorCloserToBlack
        ? ImageName.CIRCLE_CURVE_LEFT_WHITE
        : ImageName.CIRCLE_CURVE_LEFT;
  }
}

//#endregion

//#region Rendering Text
export const drawText = (canvas, text, x, y, color = TextDefaults.COLOR, textAlign = 'start') => {
  let ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.font = TextDefaults.FONT;
  ctx.closePath();
  //console.log(`text aligned: `, ctx.textAlign);
  ctx.textAlign = textAlign;
  ctx.fillText(text, x, y);
  ctx.fillText(text, x, y);
}

export const drawCopyrightTextCentered = (canvas, text, x, y, color = TextDefaults.COLOR) => {
  let ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.font = StageDefaults.COPYRIGHT_TEXT_FONT;
  ctx.closePath();
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
  ctx.fillText(text, x, y);

  console.log(`canvas height: `, canvas.height);
  console.log(`copyright y pos: `, y);
}


export const drawNumberOnTile = ({canvas, xTileStart, yTileStart, number, leftOrRight}) => {
  let yForNumber = yTileStart + TileTextOffset.Y_TILE;
  //console.log(`y for ${leftOrRight}: ${yForNumber}`);
  let xForNumber = leftOrRight === LeftOrRight.LEFT
    ? xTileStart + TileTextOffset.X_LEFT_TILE
    : xTileStart + TileTextOffset.X_RIGHT_TILE;
  if (number !== null) {
    drawText(canvas, number, xForNumber, yForNumber, TextDefaults.TILE_NUMBER_COLOR);
  }
}

export const renderLeftTopStrandText = (canvas, strandLetter, strandX, strandY) => {
  let x = strandX + TextDefaults.X_LEFT_TOP_OFFSET;
  let y = strandY + TextDefaults.Y_LEFT_TOP_OFFSET;
  console.log(`top left letter: `, `x: ${x}, y: ${y}`);

  drawText(canvas, strandLetter, x, y);
}

export const renderRightTopStrandText = (canvas, strandLetter, strandX, strandY) => {
  let x = strandX + TextDefaults.X_RIGHT_TOP_OFFSET;
  let y = strandY + TextDefaults.Y_RIGHT_TOP_OFFSET;
  console.log(`top right letter: `, `x: ${x}, y: ${y}`);

  drawText(canvas, strandLetter, x, y);
}

//#endregion

//#region Rendering Pattern

export const renderPattern = (canvas, patternHeight, pattern) => {

  let ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.fillStyle = StageDefaults.BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, patternHeight);
  ctx.closePath();
  
  //fillBackground(canvas);

  for (let x = 0; x <pattern.length; x++) {

    let r = pattern[x];
    for (let y = 0; y < r.length; y++) {
      let t = r[y];
      ctx.beginPath();
      ctx.moveTo(t.yA.x, t.yA.y);
      ctx.lineTo(t.xA.x, t.xA.y);
      ctx.lineTo(t.yB.x, t.yB.y);
      ctx.lineTo(t.xB.x, t.xB.y);
      ctx.closePath();

      ctx.fillStyle = t.color;
      ctx.fill();
      ctx.lineWidth = PatternDefaults.LINE_THICKNESS;
      ctx.strokeStyle = PatternDefaults.LINE_COLOR;
      ctx.stroke();
      ctx.restore();
      //ctx.stroke();
      // ctx.fillStyle = t.color;
      // ctx.fillRect(t.x, t.y, t.width, t.height);
      // ctx.lineWidth = PatternDefaults.LINE_THICKNESS;
      // ctx.strokeStyle = PatternDefaults.LINE_COLOR;
      // ctx.rect(t.x, t.y, t.width, t.height);
      // ctx.stroke();
      // //ctx.stroke();
      // ctx.closePath();
    }
  }

  ctx.beginPath();
  ctx.fillStyle = StageDefaults.BG_COLOR;
  ctx.fillRect(0, patternHeight, canvas.width, PatternDefaults.TILE_SIZE);
  // ctx.fillRect(0, patternHeight, ImageWidth.TILE_START_LEFT, 20);
  ctx.closePath();
}



export const renderTest2 = (canvas, x, y, width, height, color) => {
  //let color = "grey";

  // draw original
  let ctx = canvas.getContext("2d");
  // ctx.fillStyle = color;
  // ctx.fillRect(x, y, width, height);

  // calculate new width
  let newWidth = getNewLength(x, y, width, height);
  console.log(`new width: ${newWidth}`);

  // draw new square inside old one
  let dif = width - newWidth;
  let newX = x + (dif / 2);
  let newY = y + (dif / 2);
  // ctx.fillStyle = "cyan";
  // ctx.fillRect(newX, newY, newWidth, newWidth);


  // find center
  let xCenter = newX + (newWidth / 2);
  let yCenter = newY + (newWidth / 2);

  // move canvas
  ctx.translate(xCenter, yCenter);
  //ctx.rotate(Math.PI / 2);
  ctx.rotate(45*Math.PI/180);
  ctx.translate(-xCenter, -yCenter);

  // draw new
  //color = "red";
  ctx.fillStyle = color;
  ctx.fillRect(newX, newY, newWidth, newWidth);
  ctx.lineWidth = PatternDefaults.LINE_THICKNESS;
  ctx.strokeStyle = PatternDefaults.LINE_COLOR;
  ctx.rect(newX, newY, newWidth, newWidth);
  ctx.stroke();
  ctx.restore();
}

const getNewLength = (x, y, width, height) => {
  let xStart = x + width / 2;
  let xEnd = x + width;
  let yStart = y;
  let yEnd = y + height / 2;
  let result = Math.hypot(xEnd - xStart, yEnd - yStart);
  return result;
}

export const renderTest = (canvas) => {
  fillBackground(canvas);
  let xStart = 100;
  let yStart = 0;
  let width = 50;
  let height = 50;

  for (let i = 0; i < 10; i++) {
    let isFirst = i === 0;
    renderTest3(canvas, xStart, yStart, width, height, isFirst);
    yStart += height;
  }
}

const renderTest3 = (canvas, x, y, width, height, isFirst) => {
  // fillBackground(canvas);
  // let x = 200;
  // let y = 150;
  // let width = 50;
  // let height = 50;
  let color = "grey";

  // draw original
  let ctx = canvas.getContext("2d");

  if (isFirst) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }


  // calculate new width
  let newWidth = getNewLength(x, y, width, height);
  console.log(`new width: ${newWidth}`);

  // draw new square inside old one
  let dif = width - newWidth;
  let newX = x + (dif / 2);
  let newY = y + (dif / 2);
  if (isFirst) {
    ctx.fillStyle = "cyan";
    ctx.fillRect(newX, newY, newWidth, newWidth);
  }



  // find center
  let xCenter = newX + (newWidth / 2);
  let yCenter = newY + (newWidth / 2);

  // move canvas
  if (isFirst) {
    ctx.translate(xCenter, yCenter);
    //ctx.rotate(Math.PI / 2);
    ctx.rotate(45*Math.PI/180);
    ctx.translate(-xCenter, -yCenter);
  }

  // draw new
  color = "red";
  ctx.fillStyle = color;
  ctx.fillRect(newX, newY, newWidth, newWidth);

  // back to original
  //ctx.translate(-xCenter, -yCenter);
  //ctx.rotate(-45*Math.PI/180);

  //ctx.restore();
}

// const rotateCtx = (ctx) => {
//   // move the rotation point to the center of the rect
//   ctx.translate( x+width/2, y+height/2 );

//   // rotate the rect
//   ctx.rotate(degrees*Math.PI/180);
// }

//#endregion

//#region Rendering Strands

export const renderStrands = (canvas, nodes, rowCount, isSetupDecided, clearLoadedCount, addToLoadedCount) => {
  if (nodes.length === 0) {
    return;
  }

  clearLoadedCount();

  if (isSetupDecided) {

    // if (rowCount === 2) {
    //   renderForFirstTwoStrandRows(canvas, nodes, rowCount, addToLoadedCount);
    // } else {

    // }

    for (let y = 0; y < nodes.length; y++) {
      renderBottomStrandsForRow(canvas, nodes, y, addToLoadedCount);
    }
  }

  renderFirstStrandRow(canvas, nodes[0], rowCount, addToLoadedCount);
  if (!isSetupDecided) {
    renderLastStrandRow(canvas, nodes[rowCount - 1], rowCount, addToLoadedCount);
  }


  // if (isSetupDecided) {
  //   showRenderPositionDifferences(nodes);
  // }
}

const renderBottomStrandsForRow = (canvas, nodes, rowIndex, addToLoadedCount) => {
  let rowType = getRowType(rowIndex);
  let isLastRow = rowIndex === nodes.length - 1;
  let isLastLongRow = rowType === RowType.LONG
    && rowIndex === nodes.length - 2;

  let width = ImageWidth.STRAND_LEFT;

  let row = nodes[rowIndex];
  for (let x = 0; x < row.length; x++) {
    let isFirst = x === 0;
    let isLast = x === row.length - 1;

    // if (isLastRow) {
    //   continue;
    // }

    let node = row[x];
    let halfHeight = ImageHeight.STRAND_LEFT / 2;

    let isLooseStrandLeft = isFirst && isLastLongRow;
    let xStartLeft = node.xStart + StrandOffset.X_BOTTOM_LEFT;
    let yStartLeft = !isLastRow
      ? node.yStart + StrandOffset.Y_BOTTOM_LEFT
      : canvas.height - ImageHeight.STRAND_END_LEFT;
    let heightLeft = rowType === RowType.LONG && isFirst
      ? ImageHeight.STRAND_LEFT
      : !isLastRow
        ? halfHeight
        : ImageHeight.STRAND_END_LEFT;
    let leftFillColor = node.getBottomStrandColor(LeftOrRight.LEFT);
    let leftImageName = getStrandImageNameAfterSetup(LeftOrRight.LEFT, isLooseStrandLeft, isLastRow);
    renderBottomStrand(canvas, leftFillColor, leftImageName, xStartLeft, yStartLeft, width, heightLeft, addToLoadedCount);

    let isLooseStrandRight = isLast && isLastLongRow;
    let xStartRight = node.xStart + StrandOffset.X_BOTTOM_RIGHT;
    let yStartRight = !isLastRow
      ? node.yStart + StrandOffset.Y_BOTTOM_RIGHT
      : canvas.height - ImageHeight.STRAND_END_RIGHT;
    let heightRight = rowType === RowType.LONG && isLast
      ? ImageHeight.STRAND_RIGHT
      : !isLastRow
        ? halfHeight
        : ImageHeight.STRAND_END_RIGHT;
    let rightFillColor = node.getBottomStrandColor(LeftOrRight.RIGHT);
    let rightImageName = getStrandImageNameAfterSetup(LeftOrRight.RIGHT, isLooseStrandRight, isLastRow);
    renderBottomStrand(canvas, rightFillColor, rightImageName, xStartRight, yStartRight, width, heightRight, addToLoadedCount);

    //console.log(`Node ${row[x].id} - LN above: ${row[x].leftNodeAbove ? row[x].leftNodeAbove.id : `null`}; RN above: ${row[x].rightNodeAbove ? row[x].rightNodeAbove.id : `null`}; BL color: ${leftFillColor}; BR color ${rightFillColor}`);

  }
}

const renderBottomStrand = (canvas, fillColor, imageName, xStart, yStart, width, height, addToLoadedCount) => {
  let ctx = canvas.getContext("2d");
  let image = new Image();
  image.src = getImage(imageName);
  image.onload = () => {
    renderSquareFill(canvas, fillColor, xStart, yStart, width, height);
    ctx.drawImage(image, 0, 0, width, height, xStart, yStart, width, height);

    if (addToLoadedCount) {
      addToLoadedCount();
    }
  };
}

const renderFirstStrandRow = (canvas, firstNodeRow, rowCount, addToLoadedCount) => {
  //console.log('Logging top start strand offsets');
  let lXOffset = 0;
  let lYOffset = 0;
  let rXOffset = 0;
  let rYOffset = 0;
  firstNodeRow.forEach((n, i) => {
    //console.log(`node pos: `, `x: ${n.xStart}, y: ${n.yStart}`);
    let lPos = renderStartOrEndStrand(canvas, i * 2, n.topLeftStrand, 0, rowCount, LeftOrRight.LEFT, addToLoadedCount);
    let prevLXOffset = lXOffset;
    let prevLYOffset = lYOffset;
    lXOffset = lPos.x - n.xStart;
    lYOffset = lPos.y - n.yStart;
    // if (i !== 0 && (prevLXOffset !== lXOffset || prevLYOffset !== lYOffset)) {
    //   console.log(`WARNING: Left offsets not consistent`);
    // }

    let rPos = renderStartOrEndStrand(canvas, i * 2 + 1, n.topRightStrand, 0, rowCount, LeftOrRight.RIGHT, addToLoadedCount);
    let prevRXOffset = rXOffset;
    let prevRYOffset = rYOffset;
    rXOffset = rPos.x - n.xStart;
    rYOffset = rPos.y - n.yStart;
    // if (i !== 0 && (prevRXOffset !== rXOffset || prevRYOffset !== rYOffset)) {
    //   console.log(`WARNING: Right offsets not consistent`);
    // }
  });
  //console.log(`Left strand offsets: {x: ${lXOffset}, y: ${lYOffset}}`);
  //console.log(`Right strand offsets: {x: ${rXOffset}, y: ${rYOffset}}`);
}

const renderLastStrandRow = (canvas, lastNodeRow, rowCount, addToLoadedCount) => {
  let index = rowCount - 1;
  lastNodeRow.forEach((n, i) => {
    renderStartOrEndStrand(canvas, i * 2, n.bottomLeftStrand, index, rowCount, LeftOrRight.LEFT, addToLoadedCount, false);
    renderStartOrEndStrand(canvas, i * 2 + 1, n.bottomRightStrand, index, rowCount, LeftOrRight.RIGHT, addToLoadedCount, false);
  })
}

const renderStartOrEndStrand = (canvas, strandIndex, strandInfo, rowIndex, rowCount, leftOrRight, addToLoadedCount, isStart = true) => {
  let wh = calculateStrandWidthAndHeight(rowIndex, rowCount, isStart);
  let xy = calculateStrandImageRenderingPosition(strandIndex, rowIndex, canvas.height, !isStart);
  let color = strandInfo !== null ? strandInfo.color : NodeDefaults.EMPTY_COLOR;
  let imageName = getStrandImageName(strandIndex, rowIndex, rowCount, isStart);

  // if (rowIndex === 0) {
  //   console.log(`${leftOrRight} top strand pos: `, xy);
  // }

  let rowType = getRowType(rowIndex);
  if (rowType === RowType.SHORT) {
    xy.x += NodeDefaults.SHORT_ROW_X_OFFSET;
  }
  // if (strandInfo) {
  //   strandInfo.xStart = xy.x;
  //   strandInfo.yStart = xy.y;
  // }

  // first fill the background color
  //renderSquareFill(canvas, color, xy.x, xy.y, wh.width, wh.height);
  let fillInfos = [{
    color: color,
    x: xy.x,
    y: xy.y,
    width: wh.width,
    height: wh.height,
  }];

  // now render foreground images
  // HACK do not worry about writing letters on top on images yet?
  let imageInfo = {
    imageName: imageName,
    x: xy.x,
    y: xy.y,
    width: wh.width,
    height: wh.height
  };
  //renderImage(canvas, imageName, xy.x, xy.y, wh.width, wh.height, addToLoadedCount);
  let text = strandInfo 
    ? strandInfo.letter
    : "";
  renderImageWithUnderFills(canvas, imageInfo, fillInfos, isStart, leftOrRight, text, addToLoadedCount);

  // for logging purposes
  return xy;
}

export const getStrandImageName = (positionIndex, rowIndex, rowCount, isStart = false) => {
  let relPosIndex = positionIndex + 1;
  let side = relPosIndex % 2 === 0
    ? LeftOrRight.RIGHT
    : LeftOrRight.LEFT;

  // check if first or last row
  if (isStart) {
    switch(side) {
      case LeftOrRight.LEFT:
        return ImageName.STRAND_START_LEFT;
      case LeftOrRight.RIGHT:
        return ImageName.STRAND_START_RIGHT;
    }
  } else if (rowIndex === rowCount - 1) {
    switch(side) {
      case LeftOrRight.LEFT:
        return ImageName.STRAND_END_LEFT;
      case LeftOrRight.RIGHT:
        return ImageName.STRAND_END_RIGHT;
    }
  } else {
    switch(side) {
      case LeftOrRight.LEFT:
        return ImageName.STRAND_LEFT;
      case LeftOrRight.RIGHT:
        return ImageName.STRAND_RIGHT;
    }
  }

  throw `Error in finding a strand image name to render. (getStrandImageName: drawLogic.js)`;
}

export const getStrandImageNameAfterSetup = (leftOrRight, isLastSideLooseStrand, isLastRow = false) => {
  if (leftOrRight === LeftOrRight.LEFT) {
    if (isLastSideLooseStrand) {
      return ImageName.STRAND_LEFT_FINAL_EDGE;
    } else if (isLastRow) {
      return ImageName.STRAND_END_LEFT;
    } else {
      return ImageName.STRAND_LEFT;
    }
  } else {
    if (isLastSideLooseStrand) {
      return ImageName.STRAND_RIGHT_FINAL_EDGE;
    } else if (isLastRow) {
      return ImageName.STRAND_END_RIGHT;
    } else {
      return ImageName.STRAND_RIGHT;
    }
  }
}

//#endregion

//#region Rendering Images

export const renderImage = (canvas, imageName, x, y, width, height, addToLoadedCount = null, afterFunction = null, functionParam = null) => {
  let ctx = canvas.getContext("2d");
  let image = new Image();
  image.src = getImage(imageName);
  image.onload = () => {
    ctx.drawImage(image, x, y, width, height);

    if (addToLoadedCount !== null) {
      addToLoadedCount();
    }

    // any function that is set to happen after drawing the image
    if (afterFunction !== null) {
      let params = {...functionParam, canvas}
      afterFunction(params);
    }
    
  };
}

const renderCircleImageWithUnderFill = (canvas, imageName, color, x, y, width, height) => {
  let ctx = canvas.getContext("2d");
  let image = new Image();
  image.src = getImage(imageName);
  image.onload = () => {
    renderCircleFill(canvas, color, x, y);
    ctx.drawImage(image, x, y, width, height);
  };
}

const renderImageWithUnderFills = (canvas, imageInfo, fillInfos, isStart = false, leftOrRight, text, addToLoadedCount, showHalfImage = false) => {
  let ctx = canvas.getContext("2d");
  let image = new Image();
  image.src = getImage(imageInfo.imageName);
  image.onload = () => {
    fillInfos.forEach(fi => {
      if (fi.color !== null) {
        renderSquareFill(canvas, fi.color, fi.x, fi.y, fi.width, fi.height);
      }
    });
    if (!showHalfImage) {
      ctx.drawImage(image, imageInfo.x, imageInfo.y, imageInfo.width, imageInfo.height);
    } else {
      ctx.drawImage(image, 0, 0, imageInfo.width, imageInfo.height / 2, imageInfo.x, imageInfo.y, imageInfo.width, imageInfo.height / 2);
    }


    if (isStart) {
      if (leftOrRight === LeftOrRight.LEFT) {
        renderLeftTopStrandText(canvas, text, imageInfo.x, imageInfo.y);
      } else {
        renderRightTopStrandText(canvas, text, imageInfo.x, imageInfo.y);
      }
    }

    if (addToLoadedCount) {
      addToLoadedCount();
    }
  };
}

export const getImage = (imageName) => {
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