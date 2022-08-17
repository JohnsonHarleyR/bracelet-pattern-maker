
import { NodeSymbol } from "../constants/nodeConstants";

//#region Code Colors



export const generateHexCodes = (colors) => {
  let array = [];
  colors.forEach(c => {
    let letter = c.letter;
    let hex = c.color.substring(1);
    array.push({
      letter: letter,
      hex: hex.toLowerCase(),
    });
  });

  return array;
}

//#endregion

//#region Strands

export const generateStrandLetterString = (strandInfos) => {
  console.log(`strand infos count: `, strandInfos.length);
  let str = '';
  strandInfos.forEach(s => {
    str += s.letter.toLowerCase();
  });
  return str;
}

//#endregion

//#region Node texts

export const generateNodesCodeArray = (nodes) => {
  let array = [];
  nodes.forEach((r, y) => {
    let str = '';
    r.forEach((n, x) => {
      let toAdd = '';
      switch (n.nodeSymbol) {
        case NodeSymbol.LEFT:
          toAdd = 'b';
          break;
        case NodeSymbol.RIGHT:
          toAdd = 'f';
          break;
        case NodeSymbol.LEFT_RIGHT:
          toAdd = 'bf';
        case NodeSymbol.RIGHT_LEFT:
          toAdd = 'fb';
        default:
          break;
      }

      str += toAdd;

      if (x !== r.length - 1 && toAdd !== '') {
        str += ',';
      }
    });

    array.push(str);
  });
  return array;
}

//#endregion