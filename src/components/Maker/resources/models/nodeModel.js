import { ClickType, NodeDefaults, NodeSymbol, NodeSymbolType } from "../constants/nodeConstants";
import { ImageHeight, ImageWidth } from "../constants/stageConstants";


export default class NodeModel {
  constructor(leftNodeAbove, rightNodeAbove, topLeftStrand = null, topRightStrand = null) {
    this.topLeftStrand = this.determineTopLeftStrand(leftNodeAbove, topLeftStrand);
    this.topRightStrand =this.determineTopRightStrand(rightNodeAbove, topRightStrand);

    this.bottomLeftStrand = null;
    this.bottomRightStrand = null;

    this.leftNodeAbove = leftNodeAbove;
    this.rightNodeAbove = rightNodeAbove;

    // center position?

    this.nodeSymbol = NodeSymbol.NONE;
    this.nodeColor = this.determineNodeColor();
    this.nodeSymbolType = NodeSymbolType.NONE;

    this.xStart = 0;
    this.yStart = 0;
  }

  clickNode = (clickType) => {
    // first cycle symbol type
    this.cycleNodeSymbolType();

    // now decide which symbol to change to
    let symbol = NodeSymbol.NONE;
    switch(clickType) {
      case ClickType.LEFT:
        symbol = this.getLeftClickSymbolBySymbolType();
        break;
      case ClickType.RIGHT:
        symbol = this.getRightClickSymbolBySymbolType();
    }

    this.changeNodeSymbol(symbol);
  }

  changeNodeSymbol = (newSymbol) => {
    this.nodeSymbol = newSymbol;
    this.changeBottomStrands();
    this.nodeColor = this.determineNodeColor();
  }

  isMouseOnCircle = (position) => {
    let xEnd = this.xStart + ImageWidth.CIRCLE_BLANK;
    let yEnd = this.yStart + ImageHeight.CIRCLE_BLANK;

    if (position.x >= this.xStart &&
        position.x <= xEnd &&
        position.y >= this.yStart &&
        position.y <= yEnd) {
          return true;
    }
    return false;
  }

  cycleNodeSymbolType = () => {
    if (this.nodeSymbolType === NodeSymbolType.NONE) {
      this.nodeSymbolType = NodeSymbolType.POINT;
    } else if (this.nodeSymbolType === NodeSymbolType.POINT) {
      this.nodeSymbolType = NodeSymbolType.CURVE;
    } else if (this.nodeSymbolType === NodeSymbolType.CURVE) {
      //this.nodeSymbolType = NodeSymbolType.NONE;
      this.nodeSymbolType = NodeSymbolType.POINT;
    }
  }

  getRightClickSymbolBySymbolType = () => {
    if (this.nodeSymbolType === NodeSymbolType.NONE) {
      return NodeSymbol.NONE;
    } else if (this.nodeSymbolType === NodeSymbolType.POINT) {
      return NodeSymbol.RIGHT;
    } else if (this.nodeSymbolType === NodeSymbolType.CURVE) {
      return NodeSymbol.LEFT_RIGHT;
    }
  }

  getLeftClickSymbolBySymbolType = () => {
    if (this.nodeSymbolType === NodeSymbolType.NONE) {
      return NodeSymbol.NONE;
    } else if (this.nodeSymbolType === NodeSymbolType.POINT) {
      return NodeSymbol.LEFT;
    } else if (this.nodeSymbolType === NodeSymbolType.CURVE) {
      return NodeSymbol.RIGHT_LEFT;
    }
  }

  determineNodeColor = () => {
    switch (this.nodeSymbol) {
      default:
        return NodeDefaults.EMPTY_COLOR;
      case NodeSymbol.LEFT:
        return this.topRightStrand !== null
          ? this.topRightStrand.color
          : NodeDefaults.EMPTY_COLOR;
      case NodeSymbol.LEFT_RIGHT:
        return this.topRightStrand !== null
        ? this.topRightStrand.color
        : NodeDefaults.EMPTY_COLOR;
      case NodeSymbol.RIGHT:
        return this.topLeftStrand !== null
        ? this.topLeftStrand.color
        : NodeDefaults.EMPTY_COLOR;
      case NodeSymbol.RIGHT_LEFT:
        return this.topLeftStrand !== null
        ? this.topLeftStrand.color
        : NodeDefaults.EMPTY_COLOR;
    }
  }

  changeBottomStrands = () => {
    switch (this.nodeSymbol) {
      default:
        this.bottomLeftStrand = null;
        this.bottomRightStrand = null;
        break;
      case NodeSymbol.LEFT:
        this.bottomLeftStrand = this.topRightStrand;
        this.bottomRightStrand = this.topLeftStrand;
        break;
      case NodeSymbol.LEFT_RIGHT:
        this.bottomLeftStrand = this.topLeftStrand;
        this.bottomRightStrand = this.topRightStrand;
        break;
      case NodeSymbol.RIGHT:
        this.bottomRightStrand = this.topLeftStrand;
        this.bottomLeftStrand = this.topRightStrand;
        break;
      case NodeSymbol.RIGHT_LEFT:
        this.bottomRightStrand = this.topRightStrand;
        this.bottomLeftStrand = this.topLeftStrand;
        break;
    }
  }

  determineTopLeftStrand = (leftNodeAbove, topLeftStrand) => {
    if (leftNodeAbove !== null) {
      return leftNodeAbove.bottomRightStrand;
    }
    return topLeftStrand;
  }

  determineTopRightStrand = (rightNodeAbove, topRightStrand) => {
    if (rightNodeAbove !== null) {
      return rightNodeAbove.bottomLeftStrand;
    }
    return topRightStrand;
  }

}