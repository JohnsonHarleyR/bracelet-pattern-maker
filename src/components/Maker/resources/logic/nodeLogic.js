

//#region Create Nodes

import NodeModel from "../models/nodeModel";

export const createFirstRowOfNodes = (startStrandInfos) => {
  let nodes = [];

  for (let i = 0; i < startStrandInfos.length; i++) {
    // only do on odd strands (by index + 1)
    if ((i + 1) % 2 !== 0) {
      let newNode = new NodeModel(null, null, startStrandInfos[i], startStrandInfos[i + 1]);
      nodes.push(newNode);
    }
  }

  return nodes;

}

//#endregion