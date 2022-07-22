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
      let newNode = new NodeModel(null, null, startStrandInfos[i], startStrandInfos[i + 1]);
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
      let newRow = rowCount === 2
        ? createRowOfNodesAfterSetupFirstComplete(i, nodes, nodesAcross, rowCount)
        : createRowOfNodesAfterFirstTwo(getRowType(i), i, copy);
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

  // NOTE dont worry about any splicing because the number of strands cannot be changed
  // by the time this method is used. The bool isSetupDecided should be true to use this.

  // The important thing is deciding where the top left and right edge strands are coming from.
  // **If it is a "short" row, it should come from the row right before it.
  // (Top left at start should come from bottom right, top right at end should come from bottom left.
  // (Above node with bottom right strand for top left at start node should have same xindex.)
  // (Above node with bottom left strand for top right at end node should have xindex + 1.)
  // **If it is a "long" row, it should come from the previous long row - so two above it.
  // (Top left start should come from bottom left same index.)
  // (Top right end should come from bottom right same index.)



  //let endIndex = nodesAcross - 1;
  // let prevRowForEdges = rowType === RowType.SHORT
  //   ? nodes[rowIndex - 1]
  //   : nodes[rowIndex - 2];
  // let topLeftNode = rowType === RowType.SHORT
  //   ? prevRowForEdges[0].bottomRightStrand
  //   : prevRowForEdges[0].bottomLeftStrand;
  // let topRightEndStrand = rowType === RowType.SHORT
  //   ? prevRowForEdges[endIndex].bottomLeftStrand
  //   : prevRowForEdges[endIndex].bottomRightStrand;

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


    // let leftStrand = i === 0
    //   ? topLeftNode
    //   : rowType === RowType.SHORT
    //     ? prevRow[i].bottomRightStrand
    //     : prevRow[i].bottomLeftStrand;

    // let rightStrand = i === rowNodeCount - 1
    //   ? topRightEndStrand
    //   : rowType === RowType.SHORT
    //     ? prevRow[endIndex].bottomLeftStrand
    //     : prevRow[prevRow.length - 1].bottomRightStrand;

    let newNode = new NodeModel(leftNodeAbove, rightNodeAbove);
    newNode.yStart = prevRow[0].yStart + NodeOffset.Y_BETWEEN_NODES;
    let xFromEdge = rowType === RowType.LONG
      ? NodeOffset.X_FROM_EDGE_LONG
      : NodeOffset.X_FROM_EDGE_SHORT;
    newNode.xStart = xFromEdge + (i * NodeOffset.X_BETWEEN_NODES);
    // let xy = rowType === RowType.SHORT
    //   ? calculateEvenNodeRenderingPosition(rowIndex, i, prevRow)
    //   : calculateOddNodeRenderingPosition(newNode, 0);
    // newNode.xStart = xy.x;
    // newNode.yStart = xy.y;
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