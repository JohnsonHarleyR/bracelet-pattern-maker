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
import { calculateOddNodeRenderingPosition, calculateStrandImageRenderingPosition, calculateStrandWidthAndHeight } from "./calculationLogic";
import { NodeDefaults, NodeSymbol } from "../constants/nodeConstants";
import { getClosestEndOfColorSpectrum } from "./hexLogic";
import { ColorValue } from "../constants/designConstants";

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
      renderNode(canvas, row[x], y);
    }
  }
}

const renderNode = (canvas, node, rowIndex) => {
  let color = node.getColor();
  let isColorCloserToBlack = getClosestEndOfColorSpectrum(color) === ColorValue.BLACK
    ? true : false;
  let xy = calculateOddNodeRenderingPosition(node, rowIndex);
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

//#region Rendering Strands

export const renderStrands = (canvas, nodes, rowCount, clearLoadedCount, addToLoadedCount) => {
  if (nodes.length === 0) {
    return;
  }

  clearLoadedCount();
  nodes.forEach((n, i) => {
    if (i === 0) {
      renderFirstStrandRow(canvas, n, rowCount, addToLoadedCount);
    }

    if (i === rowCount - 1) {
      renderLastStrandRow(canvas, n, rowCount, addToLoadedCount);
    }
  })
}

const renderFirstStrandRow = (canvas, firstNodeRow, rowCount, addToLoadedCount) => {
  firstNodeRow.forEach((n, i) => {
    renderStartOrEndStrand(canvas, i * 2, n.topLeftStrand, 0, rowCount, addToLoadedCount);
    renderStartOrEndStrand(canvas, i * 2 + 1, n.topRightStrand, 0, rowCount, addToLoadedCount);
  })
}

const renderLastStrandRow = (canvas, lastNodeRow, rowCount, addToLoadedCount) => {
  let index = rowCount - 1;
  lastNodeRow.forEach((n, i) => {
    renderStartOrEndStrand(canvas, i * 2, n.bottomLeftStrand, index, rowCount, addToLoadedCount, false);
    renderStartOrEndStrand(canvas, i * 2 + 1, n.bottomRightStrand, index, rowCount, addToLoadedCount, false);
  })
}

const renderStartOrEndStrand = (canvas, strandIndex, strandInfo, rowIndex, rowCount, addToLoadedCount, isStart = true) => {
  let wh = calculateStrandWidthAndHeight(rowIndex, rowCount, isStart);
  let xy = calculateStrandImageRenderingPosition(strandIndex, rowIndex, canvas.height, !isStart);
  let color = strandInfo !== null ? strandInfo.color : NodeDefaults.EMPTY_COLOR;
  let imageName = getStrandImageName(strandIndex, rowIndex, rowCount, isStart);

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
  renderImageWithUnderFills(canvas, imageInfo, fillInfos, addToLoadedCount);
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

const renderImageWithUnderFills = (canvas, imageInfo, fillInfos, addToLoadedCount) => {
  let ctx = canvas.getContext("2d");
  let image = new Image();
  image.src = getImage(imageInfo.imageName);
  image.onload = () => {
    fillInfos.forEach(fi => {
      renderSquareFill(canvas, fi.color, fi.x, fi.y, fi.width, fi.height);
    });
    ctx.drawImage(image, imageInfo.x, imageInfo.y, imageInfo.width, imageInfo.height);
    addToLoadedCount();
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