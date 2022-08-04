
import { PatternDefaults } from "../constants/designConstants";
import { NodeSymbol, RowType } from "../constants/nodeConstants";
import { LeftOrRight, OldOrNew, StageDefaults } from "../constants/stageConstants";
import { getRowType } from "./nodeLogic";

//#region Creation


export const createPatternFromNodes = (nodes) => {

  // use the new method if the setting says to do so
  if (StageDefaults.NODE_AND_PATTERN_METHOD === OldOrNew.NEW) {
    return createPatternFromNodesNewMethod(nodes);
  }

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

const createPatternFromNodesNewMethod = (nodes) => {

  let vertWidth = calculatePatternThickness(nodes);
  
  let newPattern = [];
  let length = getXStartDist();

  let count = 0;
  let expectedCount = PatternDefaults.TILES_LONG + nodes.length;
  let xStartBegin = 0;
  let xStart = -1 * (nodes.length * length);

  let rowType;

  let isFirstLoop = true;
  let artStrandInfos = [];
  let nextLoopInfos = [];
  let lastNextToPush = null;
  let artNodes = [];
  do {

    for (let x = 0; x < nodes.length; x++) {
      if (count >= expectedCount) {
        break;
      }

      // if it's the first loop, create row
      if (isFirstLoop) {
        artNodes.push([]);
      }

      // if it's not the first loop, set the strand infos to the ones determined last round
      if (!isFirstLoop && x === 0) {
        nextLoopInfos.push(lastNextToPush);
        artStrandInfos = [...nextLoopInfos];
        nextLoopInfos = [];
        lastNextToPush = null;
      }

      let artRow = artNodes[x];

      // if it's first row and first loop, add new strand infos
      // otherwise, update them
      let row = nodes[x];
      let isLongRow = row.length === nodes[0].length; 
      row.forEach((n, i) => {
        let doDecideTopStrands = true;

        
        if (!isFirstLoop && x === 0 && i === 2) {
          console.log('stop here');
        }

          if (isFirstLoop && x === 0) {
            artStrandInfos.push({
              index: n.topLeftStrand.index,
              letter: n.topLeftStrand.letter,
              color: n.topLeftStrand.color,
            });
            artStrandInfos.push({
              index: n.topRightStrand.index,
              letter: n.topRightStrand.letter,
              color: n.topRightStrand.color,
            });
  
            artRow.push({
              topLeftStrand: artStrandInfos[n.topLeftStrand.index],
              topRightStrand: artStrandInfos[n.topRightStrand.index],
              color: null,
              symbol: null,
              bottomLeftStrand: null,
              bottomRightStrand: null,
            });

            doDecideTopStrands = false;
          } else if (isFirstLoop) {
            artRow.push({
              topLeftStrand: null,
              topRightStrand: null,
              color: null,
              symbol: null,
              bottomLeftStrand: null,
              bottomRightStrand: null,
            });
          }

          let lastRowIndex = x - 1 >= 0
          ? x - 1
          : nodes.length - 1;

          let artNode = artRow[i]; 
          let lastRow = artNodes[lastRowIndex];

          rowType = isLongRow === true
            ? RowType.LONG
            : RowType.SHORT;

          if (doDecideTopStrands) {

            let topStrands = determineTopStrandsForNode(x, i, artNodes, artStrandInfos);

            // let nodeCount = i + 1;
            // let leftStrandCount = nodeCount * 2 - 1;
            // let rightStrandCount = nodeCount * 2;
            // let leftStrandIndex = leftStrandCount - 1;
            // let rightStrandIndex = rightStrandCount - 1;

            // let leftStrandInfo = x === 0
            //   ? artStrandInfos[leftStrandIndex]
            //   : null;
            // let rightStrandInfo = x === 0
            //   ? artStrandInfos[rightStrandIndex]
            //   : null;

            // let secondLastRowIndex = x - 2 >= 0
            // ? x - 2
            // : nodes.length - 2;
            // let secondLastRow = artNodes[secondLastRowIndex];

            // if (leftStrandInfo === null) {
            //   leftStrandInfo = {};
            //   let strandToCopyForLeft;
            //   if (isLongRow) {
            //     strandToCopyForLeft = secondLastRow[0].bottomLeftStrand;
            //   } else {
            //     strandToCopyForLeft = lastRow[i].bottomRightStrand;
            //   }
            //   leftStrandInfo.index = strandToCopyForLeft.index;
            //   leftStrandInfo.letter = strandToCopyForLeft.letter;
            //   leftStrandInfo.color = strandToCopyForLeft.color;
            // }

            // if (rightStrandInfo === null) {
            //   rightStrandInfo = {};
            //   let endIndex = row.length;
            //   let strandToCopyForRight;
            //   if (isLongRow) {
            //     strandToCopyForRight = secondLastRow[endIndex - 1].bottomRightStrand;
            //   } else {
            //     strandToCopyForRight = lastRow[endIndex].bottomLeftStrand;
            //   }
            //   rightStrandInfo.index = strandToCopyForRight.index;
            //   rightStrandInfo.letter = strandToCopyForRight.letter;
            //   rightStrandInfo.color = strandToCopyForRight.color;
            // }

            artNode.topLeftStrand = topStrands.topLeftStrand;
            artNode.topRightStrand = topStrands.topRightStrand;

            // artNode.topLeftStrand = leftStrandInfo;
            // artNode.topRightStrand = rightStrandInfo;

          }

          // determine node symbol
          artNode.symbol = isFirstLoop === true
            ? n.nodeSymbol
            : artNode.symbol;

          // determine color and bottom strands
          let grabStrand;
          let otherStrand;
          switch (artNode.symbol) {
            default:
            case NodeSymbol.LEFT:
              grabStrand = artNode.topRightStrand;
              otherStrand = artNode.topLeftStrand;
              artNode.bottomLeftStrand = grabStrand;
              artNode.bottomRightStrand = otherStrand;
              break;
            case NodeSymbol.LEFT_RIGHT:
              grabStrand = artNode.topRightStrand;
              otherStrand = artNode.topLeftStrand;
              artNode.bottomRightStrand = grabStrand;
              artNode.bottomLeftStrand = otherStrand;
              break;
            case NodeSymbol.RIGHT:
              grabStrand = artNode.topLeftStrand;
              otherStrand = artNode.topRightStrand;
              artNode.bottomRightStrand = grabStrand;
              artNode.bottomLeftStrand = otherStrand;
              break;
            case NodeSymbol.RIGHT_LEFT:
              grabStrand = artNode.topLeftStrand;
              otherStrand = artNode.topRightStrand;
              artNode.bottomLeftStrand = grabStrand;
              artNode.bottomRightStrand = otherStrand;
              break;
          }
          artNode.color = grabStrand.color;

          // if it's the last row OR 2nd to last and either the left or right end strand,
          // then store the bottom strands in the new strand infos to pass on during the next loop
          if (x === nodes.length - 2 && i === 0) {
            nextLoopInfos.push(artNode.bottomLeftStrand);
          } else if (x === nodes.length - 2 && i === row.length - 1) {
            lastNextToPush = artNode.bottomRightStrand;
          } else if (x === nodes.length - 1) {
            nextLoopInfos.push(artNode.bottomLeftStrand);
            nextLoopInfos.push(artNode.bottomRightStrand);
          }

      });

      let prevRow = !isLongRow
        ? artNodes[x - 1]
        : null;
      let newCol = createPatternColFromNodeRowNewWay(rowType, xStart, artNodes[x], prevRow, vertWidth);
      newPattern.push(newCol);
      xStart = newCol[0].xA.x;
    }

    count++;
    xStartBegin = xStart;

    isFirstLoop = false;

  } while (count < expectedCount);
    // this pattern will be sidesways so switch x and y


  return newPattern;

}

const createPatternColFromNodeRowNewWay = (rowType, xStart, row, prevRow, vertWidth) => {
  let leftColor = rowType === RowType.LONG
    ? null
    : prevRow[0].bottomLeftStrand.color;
  let rightColor = rowType === RowType.LONG
    ? null
    : prevRow[prevRow.length - 1].bottomRightStrand.color;
  
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
    newRow.push(createPatternTileObject(xStart, yStart, n.color));
  });


  if (rowType === RowType.SHORT) {
    yStart = -halfTileSize;
    // push right half tile
    newRow.push(createPatternTileObject(xStart, yStart, rightColor));
  }

  return newRow;
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

//#region Decisions/Determining

const determineTopStrandsForNode = (y, x, artNodes, artStrandInfos) => {
  let topLeft = null;
  let topRight = null;

  let rowType = getRowType(y);
  let nodesInRow = rowType === RowType.LONG
    ? artNodes[0].length
    : artNodes[0].length - 1;

  // if it's the first row
  if (y === 0) {
    let relXIndex = (x + 1) * 2;
    let relRightStrandIndex = relXIndex;

    let rightStrandIndex = relRightStrandIndex - 1;
    let leftStrandIndex = rightStrandIndex - 1;

    topLeft = artStrandInfos[leftStrandIndex];
    topRight = artStrandInfos[rightStrandIndex];

  } else if (rowType === RowType.SHORT) {   // otherwise if it's a short row
    let prevRow = artNodes[y - 1];

    let leftTopNode = prevRow[x];
    topLeft = leftTopNode.bottomRightStrand;

    let rightTopNode = prevRow[x + 1];
    topRight = rightTopNode.bottomLeftStrand;

  } else {   // otherwise if it's a long row
    let isFirstInRow = x === 0;
    let isLastInRow = x === nodesInRow - 1;

    let prevRow = artNodes[y - 1];
    if (isFirstInRow) {
      let prevLong = artNodes[y - 2];

      let leftTopNode = prevLong[0];
      topLeft = leftTopNode.bottomLeftStrand;

      let rightTopNode = prevRow[x];
      topRight = rightTopNode.bottomLeftStrand;

    } else if (isLastInRow) {
      let prevLong = artNodes[y - 2];

      let rightTopNode = prevLong[x];
      topRight = rightTopNode.bottomRightStrand;

      let leftTopNode = prevRow[x - 1];
      topLeft = leftTopNode.bottomRightStrand;
    } else {
      let leftTopNode = prevRow[x - 1];
      topLeft = leftTopNode.bottomRightStrand;

      let rightTopNode = prevRow[x];
      topRight = rightTopNode.bottomLeftStrand;
    }
  }

  return {
    topLeftStrand: topLeft,
    topRightStrand: topRight,
  }
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

//#endregion 