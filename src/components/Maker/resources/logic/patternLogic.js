
import { PatternDefaults } from "../constants/designConstants";
import { NodeSymbol, RowType } from "../constants/nodeConstants";
import { LeftOrRight } from "../constants/stageConstants";
import { getRowType } from "./nodeLogic";

//#region Creation


export const createPatternFromNodes = (nodes) => {
  let vertWidth = calculatePatternThickness(nodes);
  
  let newPattern = [];
  let length = getXStartDist();

  let count = 0;
  let expectedCount = PatternDefaults.TILES_LONG + nodes.length;
  let xStartBegin = 0;
  let xStart = -1 * (nodes.length * length);
  do {

    for (let x = 0; x < nodes.length; x++) {
      if (count >= expectedCount) {
        break;
      }

      let rowType = getRowType(x);
      let prevRow = rowType === RowType.LONG
        ? null
        : nodes[x-1];
      let leftColor = rowType === RowType.LONG
        ? null
        : prevRow[0].getBottomStrandColor(LeftOrRight.LEFT)
      let rightColor = rowType === RowType.LONG
        ? null
        : prevRow[prevRow.length - 1].getBottomStrandColor(LeftOrRight.RIGHT);

      //let xPass = count === 0 ? x : x + 1;
      //xStart = calculateXStartForPatternCol(xPass) + xStartBegin;

      let newCol = createPatternColFromNodeRow(rowType, xStart, nodes[x], vertWidth, leftColor, rightColor);
      newPattern.push(newCol);
      xStart = newCol[0].xA.x;
    }

    count++;
    xStartBegin = xStart;

  } while (count < expectedCount);
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
    newRow.push(createPatternTileObject(xStart, yStart, leftColor));
  }

  // push in between tiles
  row.forEach((n) => {
    yStart = yStart - PatternDefaults.TILE_SIZE;
    newRow.push(createPatternTileObject(xStart, yStart, n.getColor()));
  });


  if (rowType === RowType.SHORT) {
    yStart = -halfTileSize;
    // push right half tile
    newRow.push(createPatternTileObject(xStart, yStart, rightColor));
  }

  return newRow;
}

const getXStartDist = () => {
  let width = PatternDefaults.TILE_SIZE;
  let halfWidth = width / 2;
  let xEnd = width;

  let yA = {x: 0, y: halfWidth};
  let yB = {x: xEnd, y: halfWidth};

  let leftToRight = yB.x - yA.x;
  return leftToRight / 2;
}

const createPatternTileObject = (xStart, yStart, color) => {
  let width = PatternDefaults.TILE_SIZE;
  let halfWidth = width / 2;
  let xEnd = xStart + width;
  let yEnd = yStart + width;

  let yA = {x: xStart, y: yStart + halfWidth};
  let xA = {x: xStart + halfWidth, y: yStart};
  let yB = {x: xEnd, y: yStart + halfWidth};
  let xB = {x: xStart + halfWidth, y: yEnd};

  let obj = {
    color: color,
    x: xStart,
    y: yStart,
    width: width,
    height: width,
    yA: yA,
    xA: xA,
    yB: yB,
    xB: xB,
  }

  return obj;
}

const createPatternColFromNodeRow2 = (rowType, xStart, row, vertWidth, leftColor, rightColor) => {
  // start at bottom of vertWidth
  // if it's a long row, draw full tile first
  // otherwise, draw half a tile (vertical height with left and right colors from row before)
  let newRow = [];

  let halfTileSize = PatternDefaults.TILE_SIZE / 2;

  let newSize = getNewLength(0, 0, PatternDefaults.TILE_SIZE / 2);
  let newHalfSize = newSize / 2;

  let dif = PatternDefaults.TILE_SIZE - newSize;
  let halfDif = halfTileSize - newHalfSize;

  let yStart = vertWidth;
  if (rowType === RowType.SHORT) {
    yStart = yStart - halfTileSize;

    let newX = xStart + (dif / 2);
    let newY = yStart + (dif / 2);

    // push left half tile
    newRow.push({
      color: leftColor,
      x: newX,
      y: newY,
      width: newSize,
      height: newSize,
    });
  }

  // push in between tiles
  row.forEach((n) => {
    yStart = yStart - PatternDefaults.TILE_SIZE;

    let newX = xStart + (dif / 2);
    let newY = yStart + (dif / 2);

    newRow.push({
      color: n.getColor(),
      x: newX,
      y: newY,
      width: newSize,
      height: newSize,
    });
  });


  if (rowType === RowType.SHORT) {
    yStart = -halfTileSize;

    let newX = xStart + (dif / 2);
    let newY = yStart + (dif / 2);
    // push right half tile
    newRow.push({
      color: rightColor,
      x: newX,
      y: newY,
      width: newSize,
      height: newSize
    });
  }

  return newRow;
}

// export const renderTest2 = (x, y, width, height) => {
//   //let color = "grey";

//   // draw original
//   let ctx = canvas.getContext("2d");
//   // ctx.fillStyle = color;
//   // ctx.fillRect(x, y, width, height);

//   // calculate new width
//   let newWidth = getNewLength(x, y, width, height);
//   console.log(`new width: ${newWidth}`);

//   // draw new square inside old one
//   let dif = width - newWidth;
//   let newX = x + (dif / 2);
//   let newY = y + (dif / 2);
//   // ctx.fillStyle = "cyan";
//   // ctx.fillRect(newX, newY, newWidth, newWidth);


//   // find center
//   let xCenter = newX + (newWidth / 2);
//   let yCenter = newY + (newWidth / 2);

//   // move canvas
//   ctx.translate(xCenter, yCenter);
//   //ctx.rotate(Math.PI / 2);
//   ctx.rotate(45*Math.PI/180);
//   ctx.translate(-xCenter, -yCenter);

//   // draw new
//   //color = "red";
//   ctx.fillStyle = color;
//   ctx.fillRect(newX, newY, newWidth, newWidth);
//   ctx.lineWidth = PatternDefaults.LINE_THICKNESS;
//   ctx.strokeStyle = PatternDefaults.LINE_COLOR;
//   ctx.rect(newX, newY, newWidth, newWidth);
//   ctx.stroke();
//   ctx.restore();
// }

const getNewLength = (x, y, width, height) => {
  let xStart = x + width / 2;
  let xEnd = x + width;
  let yStart = y;
  let yEnd = y + height / 2;
  let result = Math.hypot(xEnd - xStart, yEnd - yStart);
  return result;
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

//#region Alignment

export const doesPatternAlignCorrectly = (nodes) => {
  // before anything, see if there are any nodes that are not set yet
  if (hasUnsetNodes(nodes)) {
    return false;
  }

  let startOrder = createStartStrandArray(nodes);
  let endOrder = createEndStrandArray(nodes);

  // compare
  for (let i = 0; i < startOrder.length; i++) {
    if (startOrder[i] !== endOrder[i]) {
      return false;
    }
  }

  return true;

}

const createStartStrandArray = (nodes) => {
  let startOrder = [];
  let firstRow = nodes[0];
  firstRow.forEach(n => {
    startOrder.push(n.topLeftStrand.color);
    startOrder.push(n.topRightStrand.color);
  });
  return startOrder;
}

const createEndStrandArray = (nodes) => {
  let endOrder = [];

  let lastRow = nodes[nodes.length - 1];
  let lastLongRow = nodes[nodes.length - 2];
  // define first and last for long rows
  let first = lastLongRow[0];
  let last = lastLongRow[lastLongRow.length - 1];

  // add first
  endOrder.push(first.getBottomStrandColor(LeftOrRight.LEFT));

  // cycle through last row and add
  lastRow.forEach(n => {
    endOrder.push(n.getBottomStrandColor(LeftOrRight.LEFT));
    endOrder.push(n.getBottomStrandColor(LeftOrRight.RIGHT));
  });

  // add last
  endOrder.push(last.getBottomStrandColor(LeftOrRight.RIGHT));

  return endOrder;
}

const hasUnsetNodes = (nodes) => {
  for (let y = 0; y < nodes.length; y++) {
    let row = nodes[y];
    for (let x = 0; x < row.length; x++) {
      let node = row[x];
      if (node.nodeSymbol === NodeSymbol.NONE) {
        return true;
      }
    }
  }
  return false;
}

//#endregion

//#region Saving Pattern

export const createImageOfCanvas = (nodeCanvas) => {


    let image = nodeCanvas.toDataURL("image/png");
    console.log(image);
    //return image;

    var win = window.open();
    win.document.write('<iframe src="' +image  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen> </iframe>');
}

const combineCanvasesToOne = (patternCanvas, nodeCanvas) => {
  let pWidth = patternCanvas.width;
  let pHeight = patternCanvas.height;

  let nWidth = nodeCanvas.width;
  let nHeight = nodeCanvas.height;

  let newHeight = pHeight + nHeight;
  let newCanvas = document.createElement('canvas');
  newCanvas.width = pWidth;
  newCanvas.height = newHeight;

  let newCtx = newCanvas.getContext("2d");
  newCtx.drawImage(patternCanvas, 0, 0);

  let nodesImageSrc = nodeCanvas.toDataURL("image/png");
  let nodesImage = new Image();
  nodesImage.src = nodesImageSrc;
  nodesImage.onload = () => {
    newCtx.drawImage(nodeCanvas, nWidth, pHeight);
    return newCanvas;
  }

}


//#region 