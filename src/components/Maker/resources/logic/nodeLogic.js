import { ImageHeight, ImageWidth } from "../constants/stageConstants";
import NodeModel from "../models/nodeModel";
import { calculateOddNodeRenderingPosition } from "./calculationLogic";

//#region Create Nodes

export const createFirstRowOfNodes = (startStrandInfos) => {
  let nodes = [];

  for (let i = 0; i < startStrandInfos.length; i++) {
    // only do on odd strands (by index + 1)
    if ((i + 1) % 2 !== 0) {
      let newNode = new NodeModel(null, null, startStrandInfos[i], startStrandInfos[i + 1]);
      let xy = calculateOddNodeRenderingPosition(newNode, 0);
      newNode.xStart = xy.x;
      newNode.yStart = xy.y;
      nodes.push(newNode);
    }
  }

  return nodes;

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