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
import { ImageHeight, ImageName, ImageWidth, LeftOrRight, StageDefaults } from "../constants/stageConstants";
import { calculateEvenNodeRenderingPosition, calculateOddNodeRenderingPosition, calculateStrandImageRenderingPosition, calculateStrandImageRenderingPositionForLower, calculateStrandWidthAndHeight, showRenderPositionDifferences } from "./calculationLogic";
import { NodeDefaults, NodeSymbol, RowType, StrandOffset } from "../constants/nodeConstants";
import { getClosestEndOfColorSpectrum } from "./hexLogic";
import { ColorValue, TextDefaults } from "../constants/designConstants";
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
  console.log(`bg rendered`);
}

const renderBackgroundTiles = (canvas, nodesAcross, rowCount, addToLoadedCount) => {
  let y = 0;

  // render start row
  renderTileRow(canvas, nodesAcross, ImageName.TILE_START, y, addToLoadedCount);
  y += ImageHeight.TILE_START;

  // render inside rows
  for (let i = 0; i < rowCount; i++) {
    renderTileRow(canvas, nodesAcross, ImageName.TILE, y, addToLoadedCount);
    y += ImageHeight.TILE;
  }

  // render end row
  renderTileRow(canvas, nodesAcross, ImageName.TILE_END, y, addToLoadedCount);
}

const renderTileRow = (canvas, nodesAcross, mainTileName, yCoord, addToLoadedCount) => {
  let y = yCoord;
  let x = 0;

  let info = getTileInfo(mainTileName);

  // render left tile
  renderImage(canvas, info.leftName, x, y, info.leftWidth, info.leftHeight, addToLoadedCount);
  x = info.leftWidth;

  // render between tiles
  for (let i = 0; i < nodesAcross - 1; i++) {
    for (let n = 0; n < 2; n++) {
      renderImage(canvas, info.mainName, x, y, info.mainWidth, info.mainHeight, addToLoadedCount);
      x += info.mainWidth;
    }
  }

  // render right tiles
  renderImage(canvas, info.rightName, x, y, info.rightWidth, info.rightHeight, addToLoadedCount);
}

const fillBackground = (canvas) => {
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = StageDefaults.BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const getTileInfo = (tileName) => {
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

const renderSquareFill = (canvas, color, x, y, w, h) => {
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
      renderNode(canvas, row[x], x, y, nodes);
    }
  }
}

const renderNode = (canvas, node, posIndex, rowIndex, nodes) => {
  let rowType = getRowType(rowIndex);

  let color = node.getColor();
  let isColorCloserToBlack = getClosestEndOfColorSpectrum(color) === ColorValue.BLACK
    ? true : false;
  let xy = rowType === RowType.SHORT
    ? calculateEvenNodeRenderingPosition(rowIndex, posIndex, nodes[rowIndex - 1])
    : calculateOddNodeRenderingPosition(node, rowIndex);
  let w = ImageWidth.CIRCLE_BLANK;
  let h = ImageHeight.CIRCLE_BLANK;
  let imageName = getNodeImageName(node, isColorCloserToBlack);

  node.startX = xy.x;
  node.startY = xy.y;

  renderCircleImageWithUnderFill(canvas, imageName, color, xy.x, xy.y, w, h);
  //renderImage(canvas, imageName, xy.x, xy.y, w, h);
}

const getNodeImageName = (node, isColorCloserToBlack = false) => {
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
export const drawText = (canvas, text, x, y) => {
  let ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.fillStyle = TextDefaults.COLOR;
  ctx.font = TextDefaults.FONT;
  ctx.closePath();
  ctx.fillText(text, x, y);
  ctx.fillText(text, x, y);
}

const renderLeftTopStrandText = (canvas, strandLetter, strandX, strandY) => {
  let x = strandX + TextDefaults.X_LEFT_TOP_OFFSET;
  let y = strandY + TextDefaults.Y_LEFT_TOP_OFFSET;

  drawText(canvas, strandLetter, x, y);
}

const renderRightTopStrandText = (canvas, strandLetter, strandX, strandY) => {
  let x = strandX + TextDefaults.X_RIGHT_TOP_OFFSET;
  let y = strandY + TextDefaults.Y_RIGHT_TOP_OFFSET;

  drawText(canvas, strandLetter, x, y);
}

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
  renderLastStrandRow(canvas, nodes[rowCount - 1], rowCount, addToLoadedCount);

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

    if (isLastRow) {
      continue;
    }

    let node = row[x];
    let halfHeight = ImageHeight.STRAND_LEFT / 2;

    let isLooseStrandLeft = isFirst && isLastLongRow;
    let xStartLeft = node.xStart + StrandOffset.X_BOTTOM_LEFT;
    let yStartLeft = node.yStart + StrandOffset.Y_BOTTOM_LEFT;
    let heightLeft = rowType === RowType.LONG && isFirst
      ? ImageHeight.STRAND_LEFT
      : halfHeight;
    let leftFillColor = node.bottomLeftStrand !== null
      ? node.bottomLeftStrand.color
      : NodeDefaults.EMPTY_COLOR;
    let leftImageName = getStrandImageNameAfterSetup(LeftOrRight.LEFT, isLooseStrandLeft);
    renderBottomStrand(canvas, leftFillColor, leftImageName, xStartLeft, yStartLeft, width, heightLeft, addToLoadedCount);

    let isLooseStrandRight = isLast && isLastLongRow;
    let xStartRight = node.xStart + StrandOffset.X_BOTTOM_RIGHT;
    let yStartRight = node.yStart + StrandOffset.Y_BOTTOM_RIGHT;
    let heightRight = rowType === RowType.LONG && isLast
      ? ImageHeight.STRAND_RIGHT
      : halfHeight;
    let rightFillColor = node.bottomRightStrand !== null
      ? node.bottomRightStrand.color
      : NodeDefaults.EMPTY_COLOR;
    let rightImageName = getStrandImageNameAfterSetup(LeftOrRight.RIGHT, isLooseStrandRight);
    renderBottomStrand(canvas, rightFillColor, rightImageName, xStartRight, yStartRight, width, heightRight, addToLoadedCount);

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

const renderForFirstTwoStrandRows = (canvas, nodes, rowCount, addToLoadedCount) => {
  nodes.forEach((n, i) => {
  
    // if setup is over, render slightly differently
    let rowType = getRowType(i);
    if (i !== nodes.length - 1) {
      for (let x = 0; x < n.length; x++) {

        let belowRow = i < nodes.length - 2 
            ? nodes[i + 1]
            : null;
          // left strand
          let leftBelowLeftNode = rowType === RowType.LONG && x === 0
            ? null
            : belowRow !== null
              ? belowRow[x]
              : null;
          let rightBelowRightNode = belowRow !== null
            ? belowRow[x + 1]
            : null;
          renderStrandBelowOddRowNode(canvas, n[x], LeftOrRight.LEFT, leftBelowLeftNode,
            rightBelowRightNode, i, rowCount, x, n.length, addToLoadedCount);
          renderStrandBelowOddRowNode(canvas, n[x], LeftOrRight.RIGHT, leftBelowLeftNode,
            rightBelowRightNode, i, rowCount, x, n.length, addToLoadedCount);
      }
    }
  });
}

const renderStrandBelowOddRowNode = (canvas, node, leftOrRight,
  belowLeftNode, belowRightNode, rowIndex, rowCount, nodePosIndex, nodesAcross, addToLoadedCount) => {
  let isEndRow = rowIndex === rowCount - 1;
  let isLastOddRow = rowIndex === rowCount - 2;
  let isFirstOrLast = nodePosIndex === 0 || nodePosIndex === nodesAcross - 1;
  let strandIndex = leftOrRight === LeftOrRight.LEFT
    ? nodePosIndex * 2
    : nodePosIndex * 2 + 1;
  let wh = calculateStrandWidthAndHeight(rowIndex, rowCount, false);
  let halfHeight = wh.height / 2;
  let xy = calculateStrandImageRenderingPositionForLower(strandIndex, rowIndex);
  let topColor = leftOrRight === LeftOrRight.LEFT
    ? node !== null && node.bottomLeftStrand !== null
      ? node.bottomLeftStrand.color
      : null
    : node !== null && node.bottomRightStrand !== null
      ? node.bottomRightStrand.color
      : null
  let bottomColor = isEndRow === true
    ? topColor
    : leftOrRight === LeftOrRight.LEFT
      ? belowLeftNode === null || belowLeftNode.bottomRightStrand === null
        ? null
        : belowLeftNode.bottomRightStrand.color
      : belowRightNode === null || belowRightNode.bottomLeftStrand === null
        ? null
        : belowRightNode.bottomRightStrand.color;

  let isEdgeLooseEnd = isLastOddRow && isFirstOrLast;
  let imageName = getStrandImageNameAfterSetup(leftOrRight, isEdgeLooseEnd);

  // if (strandInfo) {
  //   strandInfo.xStart = xy.x;
  //   strandInfo.yStart = xy.y;
  // }

  // first fill the background color
  //renderSquareFill(canvas, color, xy.x, xy.y, wh.width, wh.height);
  let colorTwo = imageName === ImageName.STRAND_RIGHT_FINAL_EDGE
    || imageName === ImageName.STRAND_LEFT_FINAL_EDGE
      ? topColor
      : bottomColor;

  let fillInfos = [
    {
      color: topColor,
      x: xy.x,
      y: xy.y,
      width: wh.width,
      height: halfHeight,
    },
    {
      color: colorTwo,
      x: xy.x,
      y: xy.y + halfHeight,
      width: wh.width,
      height: halfHeight,
    },
  ];

  // now render foreground images
  // HACK do not worry about writing letters on top on images yet?
  let imageInfo = {
    imageName: imageName,
    x: xy.x,
    y: xy.y,
    width: wh.width,
    height: wh.height,
  };
  //renderImage(canvas, imageName, xy.x, xy.y, wh.width, wh.height, addToLoadedCount);
  let text = "";
  let showHalfImage = isLastOddRow && !isFirstOrLast;
  if (!showHalfImage &&
      (nodePosIndex === 0 && imageName === ImageName.STRAND_RIGHT_FINAL_EDGE) ||
      (nodePosIndex === nodesAcross - 1 && imageName === ImageName.STRAND_LEFT_FINAL_EDGE)) {
        showHalfImage = true;
        fillInfos = [fillInfos[0]];
  }

    // store the info inside node
    if (leftOrRight === LeftOrRight.LEFT) {
      node.bottomLeftInfo = {
        x: imageInfo.x,
        y: imageInfo.y,
      }
    } else {
      node.bottomRightInfo = {
        x: imageInfo.x,
        y: imageInfo.y,
      }
    }

  renderImageWithUnderFills(canvas, imageInfo, fillInfos, false, leftOrRight, text, addToLoadedCount, showHalfImage);
}

const renderFirstStrandRow = (canvas, firstNodeRow, rowCount, addToLoadedCount) => {
  firstNodeRow.forEach((n, i) => {
    renderStartOrEndStrand(canvas, i * 2, n.topLeftStrand, 0, rowCount, LeftOrRight.LEFT, addToLoadedCount);

    renderStartOrEndStrand(canvas, i * 2 + 1, n.topRightStrand, 0, rowCount, LeftOrRight.RIGHT, addToLoadedCount);
    //renderRightTopStrandText(canvas, n.topRightStrand, xy.x, xy.y);
  })
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
}

const getStrandImageName = (positionIndex, rowIndex, rowCount, isStart = false) => {
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

const getStrandImageNameAfterSetup = (leftOrRight, isLastSideLooseStrand) => {
  if (leftOrRight === LeftOrRight.LEFT) {
    if (isLastSideLooseStrand) {
      return ImageName.STRAND_LEFT_FINAL_EDGE;
    } else {
      return ImageName.STRAND_LEFT;
    }
  } else {
    if (isLastSideLooseStrand) {
      return ImageName.STRAND_RIGHT_FINAL_EDGE;
    } else {
      return ImageName.STRAND_RIGHT;
    }
  }
}

//#endregion

//#region Rendering Images

export const renderImage = (canvas, imageName, x, y, width, height, addToLoadedCount = null) => {
  let ctx = canvas.getContext("2d");
  let image = new Image();
  image.src = getImage(imageName);
  image.onload = () => {
    ctx.drawImage(image, x, y, width, height);
    if (addToLoadedCount !== null) {
      addToLoadedCount();
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

const getImage = (imageName) => {
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