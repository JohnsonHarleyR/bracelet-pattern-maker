import { NodeOffset, RowType } from "../constants/nodeConstants";
import { ImageHeight, ImageWidth } from "../constants/stageConstants";
import NodeModel from "../models/nodeModel";
import { calculateEvenNodeRenderingPosition, calculateOddNodeRenderingPosition } from "./calculationLogic";

//#region Create Nodes

export const createFirstRowOfNodes = (startStrandInfos, nodes) => {
  let nodeRow = nodes.length > 0
    ? [...nodes[0]]
    : [];

  if (nodeRow.length === startStrandInfos.length / 2) {
    return nodeRow;
  }

  // splice row if there are fewer strands than needed for nodes
  if (startStrandInfos.length / 2 < nodeRow.length) {
    nodeRow = nodeRow.splice(0, startStrandInfos.length / 2);
  }

    // TODO transfer/change existing first? (if necessary)
    // TODO replace missing infos if there are any?? (if necessary)

  let startI = nodeRow.length * 2;
  for (let i = startI; i < startStrandInfos.length; i++) {
    // only do on odd strands (by index + 1)
    if ((i + 1) % 2 !== 0) {
      let isLongLeft = i / 2 === 0;
      let isLongRight = i / 2 === startStrandInfos.length / 2;
      let newNode = new NodeModel(`0-${i / 2}`, null, null, isLongLeft, isLongRight, startStrandInfos[i], startStrandInfos[i + 1]);
      let xy = calculateOddNodeRenderingPosition(newNode, 0);
      newNode.xStart = xy.x;
      newNode.yStart = xy.y;
      nodeRow.push(newNode);
    }
  }

  return nodeRow;
}

export const createAllNodesAfterSetup = (nodes, nodesAcross, rowCount) => {
  let copy = [...nodes];
  
  if (nodes.length > rowCount) {
    copy = copy.splice(0, rowCount - 1);
  } else if (nodes.length < rowCount) {
    let startI = nodes.length;
    for (let i = startI; i < rowCount; i++) {
      let newRow = createRowOfNodesAfterSetupFirstComplete(i, copy, nodesAcross, rowCount);
      copy.push(newRow);
    }
  }

  return copy;

}

const createRowOfNodesAfterFirstTwo = (rowType, rowIndex, nodes) => {

}

const createRowOfNodesAfterSetupFirstComplete = (rowIndex, nodes, nodesAcross, rowCount) => {
  // get existing or create new row
  let nodeRow = rowCount >= rowIndex + 1 && nodes.length < rowCount
    ? []
    : [...nodes[rowIndex]];

  // determine type of row - short or long
  let rowType = getRowType(rowIndex);

  // decide how many nodes should be in the row
  let rowNodeCount = rowType === RowType.LONG
    ? nodesAcross
    : nodesAcross - 1;

  // get the row before it
  let prevRow = nodes[rowIndex - 1];
  let prevTypeRow = nodes[rowIndex - 2] !== undefined
    ? nodes[rowIndex - 2]
    : null;

  // if the nodes already exist, just return the exist row.
  if (nodeRow.length === rowNodeCount) {
    return nodeRow;
  }

  // now create all the nodes
  let startI = nodeRow.length;
  for (let i = startI; i < rowNodeCount; i++) {

    let isFirst = i === 0;
    let isLast = i === rowNodeCount - 1;

    // let leftNodeAbove = isFirst && rowType === RowType.LONG
    //   ? prevTypeRow[0]
    //   : 

    let leftNodeAbove = null;
    if (isFirst && rowType === RowType.LONG) {
      leftNodeAbove = prevTypeRow[i];
    } else if (rowType === RowType.LONG) {
      leftNodeAbove = prevRow[i - 1];
    } else {
      leftNodeAbove = prevRow[i];
    }

    let rightNodeAbove = null;
    if (isLast && rowType === RowType.LONG) {
      rightNodeAbove = prevTypeRow[i];
    } else if (rowType === RowType.LONG) {
      rightNodeAbove = prevRow[i];
    } else {
      rightNodeAbove = prevRow[i + 1];
    }

    let isLongLeft = isFirst && rowType === RowType.LONG;
    let isLongRight = isLast && rowType === RowType.LONG;
    let newNode = new NodeModel(`${rowIndex}-${i}`, leftNodeAbove, rightNodeAbove, isLongLeft, isLongRight);
    newNode.yStart = prevRow[0].yStart + NodeOffset.Y_BETWEEN_NODES;
    let xFromEdge = rowType === RowType.LONG
      ? NodeOffset.X_FROM_EDGE_LONG
      : NodeOffset.X_FROM_EDGE_SHORT;
    newNode.xStart = xFromEdge + (i * NodeOffset.X_BETWEEN_NODES);

    nodeRow.push(newNode);
  }

  return nodeRow;
}

//#endregion

//#region Row Logic

export const getRowType = (rowIndex) => {
  let relIndex = rowIndex + 1;
  if (relIndex % 2 === 0) {
    return RowType.SHORT;
  } else {
    return RowType.LONG;
  }
}

//#endregion

//#region Mouse Logic

export const getNodeFromMouseClick = (mousePos, nodes) => {
  for (let y = 0; y < nodes.length; y++) {
    let row = nodes[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x].isMouseOnCircle(mousePos)) {
        return row[x];
      }
    }
  }
  return null;
}

export const getStartStrandIndexFromMouseClick = (mousePos, strands) => {
  for (let i = 0; i < strands.length; i++) {
    let xEnd = strands[i].xStart + ImageWidth.STRAND_LEFT;
    let yEnd = strands[i].yStart + ImageHeight.STRAND_LEFT;
    if (mousePos.x >= strands[i].xStart &&
        mousePos.x <= xEnd &&
        mousePos.y >= strands[i].yStart &&
        mousePos.y <= yEnd) {
      return i;
    }
  }
  return null;
}

//#endregion