import Tile from "../images/tile.png";
import TileLeft from "../images/tile-left.png";
import TileRight from "../images/tile-right.png";
import TileStart from "../images/tile-start.png";
import TileStartLeft from "../images/tile-start-left.png";
import TileStartRight from "../images/tile-start-right.png";
import TileEnd from "../images/tile-end.png";
import TileEndLeft from "../images/tile-end-left.png";
import TileEndRight from "../images/tile-end-right.png";
import CircleBlank from "../images/blank-circle.png";
import CirclePointLeft from "../images/circle-left-arrow.png";
import CirclePointRight from "../images/circle-right-arrow.png";
import CircleCurveLeft from "../images/circle-left-curve.png";
import CircleCurveRight from "../images/circle-right-curve.png";
import { ImageHeight, ImageName, ImageWidth, StageDefaults } from "../constants/stageConstants";

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
  for (let i = 0; i < nodesAcross; i++) {
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

//#region Rendering Images


const imageAddress = (imageName) => {
  return `../images/${imageName}`;
}

export const renderImage = (canvas, imageName, x, y, width, height, addToLoadedCount) => {
  let ctx = canvas.getContext("2d");
  let image = new Image();
  image.src = getImage(imageName);
  image.onload = () => {
    ctx.drawImage(image, x, y, width, height);
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
    case ImageName.CIRCLE_BLANK:
      return CircleBlank;
    case ImageName.CIRCLE_POINT_LEFT:
      return CirclePointLeft;
    case ImageName.CIRCLE_POINT_RIGHT:
      return CirclePointRight;
    case ImageName.CIRCLE_CURVE_LEFT:
      return CircleCurveLeft;
    case ImageName.CIRCLE_CURVE_RIGHT:
      return CircleCurveRight;
  }
}

//#endregion