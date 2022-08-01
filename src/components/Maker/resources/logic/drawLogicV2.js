
import Tiles from "../images/tile-sheet.png";
import Circles from "../images/circle-sheet.png";
import Strands from '../images/strand-sheet.png';
import { RenderInfo } from "../constants/stageConstants";

export const drawNodeFromRenderTypeAray = (canvas, types, yIndex, xIndex, nodes) => {
  let row = nodes[yIndex];
  let node = row[xIndex];

  types.forEach(t => {
    let info = RenderInfo[t];
  });
}

const renderNextFromInfo = (canvas, info, yIndex, xIndex, nodes) => {

}