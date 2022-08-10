import { ColorValue } from "../constants/designConstants";
import { NodeSymbol } from "../constants/nodeConstants";
import { RenderCategory, ImageType, LeftOrRight, RenderInfo, OldOrNew, StageDefaults } from "../constants/stageConstants";
import { drawNumberOnTile, drawText, drawCopyrightTextCentered, renderCircleFill, renderLeftTopStrandText, renderRightTopStrandText, renderSquareFill } from "./drawLogic";
import { getClosestEndOfColorSpectrum } from "./hexLogic";
import Tiles from "../images/tile-sheet.png";
import Circles from "../images/circle-sheet.png";
import Strands from '../images/strand-sheet.png';
import { calculateCanvasWidth, calculateCanvasHeight } from "./calculationLogic";
import { renderAll } from "./renderLogicV2";

//#region Render Array Creation

export const renderEverything = (canvas, nodes, yOffset, isSetupDecided, includeBackground = true, startingArray = []) => {
  //console.log('rendering');
  
  let oldOrNew = StageDefaults.RENDER_METHOD;
  if (oldOrNew === OldOrNew.NEW) {
    renderAllV2(canvas, nodes, yOffset, isSetupDecided, includeBackground, startingArray);
  } else {
    renderAll(canvas, nodes, yOffset, includeBackground, startingArray);
  }
}

export const renderAllV2 = (canvas, nodes, yOffset, isSetupDecided, includeBackground = true, startingArray = []) => {
  // add all image items to array
  let renderArray = [...startingArray];

  // bg images first
  if (includeBackground) {
    let calculatedHeight = calculateCanvasHeight(nodes.length);
    canvas.width = calculateCanvasWidth(nodes[0].length);
    if (StageDefaults.SHOW_COPYRIGHT) {
      canvas.height = calculatedHeight + yOffset + StageDefaults.CANVAS_END_EXTRA;
    } else {
      canvas.height = calculatedHeight + yOffset;
    }
    addBgImagesToArrayV2(canvas, nodes, yOffset, isSetupDecided, renderArray);
  } else {

    if (startingArray.length === 0) {
      renderArray.push(createRenderArrayItem(ImageType.TILE_START_LEFT, 0, 0, nodes, canvas, isSetupDecided, yOffset));
      renderArray.push(createRenderArrayItem(ImageType.TILE_START_RIGHT, 0, nodes[0].length * 2 -1, nodes, canvas, isSetupDecided, yOffset));
      if (StageDefaults.SHOW_COPYRIGHT) {
        renderArray.push(createRenderArrayItem(ImageType.OVER_TEXT_BG, null, null, nodes, canvas, isSetupDecided, yOffset));
      }
      // let info = getTileInfo(ImageName.TILE_START);
      // renderArray.push(createImageInfoItem(null, info.leftName, 0, yOffset, info.leftWidth, info.leftHeight, false, null, null, LeftOrRight.LEFT));
      // renderArray.push(createImageInfoItem(null, info.rightName, canvas.width - info.rightWidth, yOffset, info.rightWidth, info.rightHeight, false, null, null, LeftOrRight.RIGHT));
    }
    
  }

  // now nodes - including their strands
  addAllNodeImagesToArrayV2(canvas, nodes, yOffset, isSetupDecided, renderArray);

  // add over text
  if (StageDefaults.SHOW_COPYRIGHT) {
    renderArray.push(createRenderArrayItemFromInfo(RenderInfo.OVER_TEXT, null, null, nodes, canvas, isSetupDecided, yOffset));
  }

  // now render everything in the array
  renderNextV2(canvas, 0, renderArray);

}

const renderNextV2 = (canvas, index, array, startTime = Date.now()) => {
  if (index === array.length - 1) {
    let dif = Date.now() - startTime;
    //console.log(`render next - time passed: ${dif}ms`);
  }

  if (array[index] === undefined) {
    return;
  }

  let item = array[index];

  if (item.imageName === null) {
    if (item.color) {
      renderSquareFill(canvas, item.color, item.cX, item.cY, item.cW, item.cH);
    }

    if (item.text) {
      drawCopyrightTextCentered(canvas, item.text, item.cX, item.cY, item.color);
    }

    // if it's not the last item in the array, render next item
    if (index !== array.length - 1) {
      renderNextV2(canvas, index + 1, array, startTime);
    }
  } else {
    let ctx = canvas.getContext("2d");
    let image = new Image();
    let src = getImageSheetByCategory(item.category);
    if (src !== null) {
      image.src = src;
      image.onload = () => {

        // check for any fill
        if (item.color !== null) {
          if (item.category === RenderCategory.STRAND) {
            renderSquareFill(canvas, item.color, item.cX, item.cY, item.cW, item.cH);
            //renderSquareFill(canvas, item.color, item.x, item.y, item.width, item.height);
          } else if (item.category === RenderCategory.CIRCLE) {
            renderCircleFill(canvas, item.color, item.cX, item.cY);
          }
        }

        // draw the image
        ctx.drawImage(image, item.iX, item.iY, item.iW, item.iH, item.cX, item.cY, item.cW, item.cH);

        // check for any text to render
        if (item.text !== null) {
          if (item.category === RenderCategory.STRAND) {
            if (item.leftOrRight === LeftOrRight.LEFT) {
              renderLeftTopStrandText(canvas, item.text, item.cX, item.cY);
            } else {
              renderRightTopStrandText(canvas, item.text, item.cX, item.cY);
            }
          } else if (item.category === RenderCategory.TILE) {
            drawNumberOnTile({canvas: canvas, xTileStart: item.cX, yTileStart: item.cY, number: item.text, leftOrRight: item.leftOrRight});
          } else {
            drawText(canvas, item.text, item.cX, item.cY, item.color);
          }
        }

        // if it's not the last item in the array, render next item
        if (index !== array.length - 1) {
          renderNextV2(canvas, index + 1, array, startTime);
        }

      }
    }
    
  }

}

// export const addNodeToRenderTypeArray = (yIndex, xIndex, nodes, isSetupDecided = true, array=[]) => {
//   if (doRenderStartStrands(yIndex)) {
//     array.push(ImageType.STRAND_START_LEFT);
//     array.push(ImageType.STRAND_START_RIGHT);
//   }

//   array.push(getBottomStrandImageType(LeftOrRight.LEFT, xIndex, yIndex, nodes, isSetupDecided));
//   array.push(getBottomStrandImageType(LeftOrRight.RIGHT, xIndex, yIndex, nodes, isSetupDecided));

//   let row = nodes[yIndex];
//   array.push(getNodeImageType(row[xIndex]));

//   return array;
// }

export const addNodeStrandImagesToArray = (yIndex, xIndex, nodes, yOffset, isSetupDecided = true, array=[]) => {
  if (doRenderStartStrands(yIndex)) {
    array.push(createRenderArrayItem(ImageType.STRAND_START_LEFT, yIndex, xIndex, nodes, null, isSetupDecided, yOffset));
    array.push(createRenderArrayItem(ImageType.STRAND_START_RIGHT, yIndex, xIndex, nodes, null, isSetupDecided, yOffset));
  }

  let btmLeftType = getBottomStrandImageType(LeftOrRight.LEFT, xIndex, yIndex, nodes, isSetupDecided);
  array.push(createRenderArrayItem(btmLeftType, yIndex, xIndex, nodes, null, isSetupDecided, yOffset));
  let btmRightType = getBottomStrandImageType(LeftOrRight.RIGHT, xIndex, yIndex, nodes, isSetupDecided);
  array.push(createRenderArrayItem(btmRightType, yIndex, xIndex, nodes, null, isSetupDecided, yOffset));

  // let row = nodes[yIndex];
  // array.push(getNodeImageType(row[xIndex]));

  //return array;
}

export const addNodeCircleImageToArray = (yIndex, xIndex, nodes, yOffset, isSetupDecided = true, array=[]) => {
  let row = nodes[yIndex];
  array.push(createRenderArrayItem(getNodeImageType(row[xIndex]), yIndex, xIndex, nodes, null, isSetupDecided, yOffset));

  //return array;
}

const addAllNodeImagesToArrayV2 = (canvas, nodes, yOffset, isSetupDecided, array) => {
  nodes.forEach((row, y) => {
    row.forEach((node, x) => {
      addNodeStrandImagesToArray(y, x, nodes, yOffset, isSetupDecided, array);
      //addNodeImagesToArray(canvas, x, y, nodes, yOffset, array);
    });
  });

  nodes.forEach((row, y) => {
    row.forEach((node, x) => {
      addNodeCircleImageToArray(y, x, nodes, yOffset, isSetupDecided, array);
    });
  });
}

const addBgImagesToArrayV2 = (canvas, nodes, yOffset, isSetupDecided, array) => {

  // first the fill
  array.push(createRenderArrayItem(ImageType.BG_FILL, null, null, nodes, canvas, isSetupDecided));

  // now add all bg images

  // start row
  addTileRowItemsToArrayV2(ImageType.TILE_START, nodes, canvas, null, array, yOffset);

  // inside rows
  for (let i = 0; i < nodes.length; i++) {
    addTileRowItemsToArrayV2(ImageType.TILE, nodes, canvas, i, array, yOffset);
  }

  // end row
  addTileRowItemsToArrayV2(ImageType.TILE_END, nodes, canvas, null, array, yOffset);
}


const addTileRowItemsToArrayV2 = (mainImageType, nodes, canvas, yIndex, array, yOffset)=> {
  let nodesAcross = nodes[0].length;
  let {leftInfo, mainInfo, rightInfo} = getTileRowInfos(mainImageType);

  // left image
  array.push(createRenderArrayItemFromInfo(leftInfo, yIndex, 0, nodes, canvas, null, yOffset));

  // middle images
  let totalAcross = (nodesAcross - 1) * 2;
  for (let i = 0; i < totalAcross; i++) {
    array.push(createRenderArrayItemFromInfo(mainInfo, yIndex, i, nodes, canvas, null, yOffset));
  }

  // right image
  array.push(createRenderArrayItemFromInfo(rightInfo, yIndex, totalAcross, nodes, canvas, null, yOffset));
}

//#endregion

//#region Getting Information

export const createRenderArrayItemFromInfo = (info, yIndex, xIndex, nodes, canvas, isSetupDecided, yOffset = 0) => {

  //let info = RenderInfo[imageType];
  let imageName = info.sheet;
  let color;
  let iX = info.x;
  let iY = info.y;
  let iW = info.width;
  let iH = info.height;
  let cX;
  let cY;
  let cW = info.width;
  let cH = info.height;
  let text;
  let leftOrRight = info.leftOrRight;
  switch(info.category) {
    case RenderCategory.BG_FILL:
      text = null;
      cX = info.getXStart();
      cY = info.getYStart(yOffset);
      color = info.getColor();
      cW = canvas.width;
      cH = canvas.height - yOffset;
      break;
    case RenderCategory.CIRCLE:
      let row = nodes[yIndex];
      let node = row[xIndex];
      text = info.getText();
      cX = info.getXStart(node);
      cY = info.getYStart(node, yOffset);
      color = info.getColor(node);
      break;
    case RenderCategory.TILE:
      text = info.getText(yIndex);
      cX = info.getXStart(xIndex);
      cY = info.getYStart(yOffset, yIndex, nodes.length);
      color = info.getColor();
      break;
    case RenderCategory.STRAND:
      let rowS = nodes[yIndex];
      let nodeS = rowS[xIndex];
      text = info.getText(nodeS);
      cX = info.getXStart(nodeS);
      cY = info.getYStart(nodeS, yOffset);
      color = info.getColor(nodeS);
      break;
    case RenderCategory.OVER_TEXT:
      text = info.getText();
      cX = info.getXStart(canvas);
      cY = info.getYStart(canvas);
      color = info.getColor();
      break;
    case RenderCategory.OVER_TEXT_BG:
      text = info.getText();
      cX = info.getXStart(canvas);
      cY = info.getYStart(canvas);
      color = info.getColor();
      cW = canvas.width;
      break;
  }

  return {
    category: info.category,
    imageName: imageName,
    color: color,
    iX: iX,
    iY: iY,
    iW: iW,
    iH: iH,
    cX: cX,
    cY: cY,
    cW: cW,
    cH: cH,
    text: text,
    leftOrRight: leftOrRight,
  }
}

export const createRenderArrayItem = (imageType, yIndex, xIndex, nodes, canvas, isSetupDecided = false, yOffset = 0) => {
  let info = getRenderInfo(imageType);
  return createRenderArrayItemFromInfo(info, yIndex, xIndex, nodes, canvas, isSetupDecided, yOffset);
}

export const getRenderInfo = (imageType) => {
  return RenderInfo[imageType];
}

const getTileRowInfos = (mainImageType) => {
  switch(mainImageType) {
    case ImageType.TILE_START:
      return {
        leftInfo: getRenderInfo(ImageType.TILE_START_LEFT),
        mainInfo: getRenderInfo(ImageType.TILE_START),
        rightInfo: getRenderInfo(ImageType.TILE_START_RIGHT),
      };
    default:
    case ImageType.TILE:
      return {
        leftInfo: getRenderInfo(ImageType.TILE_LEFT),
        mainInfo: getRenderInfo(ImageType.TILE),
        rightInfo: getRenderInfo(ImageType.TILE_RIGHT),
      };
    case ImageType.TILE_END:
      return {
        leftInfo: getRenderInfo(ImageType.TILE_END_LEFT),
        mainInfo: getRenderInfo(ImageType.TILE_END),
        rightInfo: getRenderInfo(ImageType.TILE_END_RIGHT),
      };
  }
}

//#endregion

//#region Decisions & Calculations

const getImageSheetByCategory = (category) => {
  switch (category) {
    case RenderCategory.CIRCLE:
      return Circles;
    case RenderCategory.STRAND:
      return Strands;
    case RenderCategory.TILE:
      return Tiles;
    default:
      return null;
  }
}

export const getNodeImageType = (node) => {
  let color = node.getColor();
  let isColorCloserToBlack = getClosestEndOfColorSpectrum(color) === ColorValue.BLACK
    ? true : false;

  switch(node.nodeSymbol) {
    case NodeSymbol.NONE:
      return ImageType.CIRCLE_BLANK;
    case NodeSymbol.LEFT:
      return isColorCloserToBlack
        ? ImageType.CIRCLE_POINT_LEFT_WHITE
        : ImageType.CIRCLE_POINT_LEFT;
    case NodeSymbol.LEFT_RIGHT:
      return isColorCloserToBlack
        ? ImageType.CIRCLE_CURVE_RIGHT_WHITE
        : ImageType.CIRCLE_CURVE_RIGHT;
    case NodeSymbol.RIGHT:
      return isColorCloserToBlack
        ? ImageType.CIRCLE_POINT_RIGHT_WHITE
        : ImageType.CIRCLE_POINT_RIGHT;
    case NodeSymbol.RIGHT_LEFT:
      return isColorCloserToBlack
        ? ImageType.CIRCLE_CURVE_LEFT_WHITE
        : ImageType.CIRCLE_CURVE_LEFT;
  }
}

const doRenderStartStrands = (yIndex) => {
  if (yIndex === 0) {
    return true;
  }
  return false;
}

export const getBottomStrandImageType = (leftOrRight, xIndex, yIndex, nodes, isSetupDecided) => {
  if (!isSetupDecided) {
    return leftOrRight === LeftOrRight.LEFT
      ? ImageType.STRAND_END_LEFT
      : ImageType.STRAND_END_RIGHT;
  }

  let isLastRow = isLastRowCheck(yIndex, nodes);
  if (isLastRow) {
    return leftOrRight === LeftOrRight.LEFT
    ? ImageType.STRAND_END_LEFT
    : ImageType.STRAND_END_RIGHT;
  }

  let isEdge = leftOrRight === LeftOrRight.LEFT
      ? isLeftEdgeCheck(xIndex)
      : isRightEdgeCheck(xIndex, yIndex, nodes);

  if (isEdge) {
    let isLastLongRow = isLastLongRowCheck(yIndex, nodes);
    return leftOrRight === LeftOrRight.LEFT
      ? isLastLongRow === true
        ? ImageType.STRAND_LEFT_FINAL_EDGE
        : ImageType.STRAND_LEFT
      : isLastLongRow === true
        ? ImageType.STRAND_RIGHT_FINAL_EDGE
        : ImageType.STRAND_RIGHT;
  }

  return leftOrRight === LeftOrRight.LEFT
    ? ImageType.STRAND_BOTTOM_LEFT
    : ImageType.STRAND_BOTTOM_RIGHT;

}


const isLastRowCheck = (yIndex, nodes) => {
  if (yIndex === nodes.length - 1) {
    return true;
  }
  return false;
}

const isLastLongRowCheck = (yIndex, nodes) => {
  if (yIndex === 0 && nodes.length === 1) {
    return true;
  }

  if (yIndex === nodes.length - 2) {
    return true;
  }
  return false;
}

const isLeftEdgeCheck = (xIndex) => {
  if (xIndex === 0) {
    return true;
  }
  return false;
}

const isRightEdgeCheck = (xIndex, yIndex, nodes) => {
  let row = nodes[yIndex];
  if (xIndex === row.length - 1) {
    return true;
  } else {
    return false;
  }
}

//#endregion