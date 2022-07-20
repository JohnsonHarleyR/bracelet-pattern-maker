import { ImageHeight, ImageWidth } from "../constants/stageConstants";
import NodeModel from "../models/nodeModel";
import { calculateOddNodeRenderingPosition } from "./calculationLogic";

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