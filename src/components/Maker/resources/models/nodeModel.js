import { ClickType, NodeDefaults, NodeSymbol, NodeSymbolType as NodeSymbolShape } from "../constants/nodeConstants";
import { ImageHeight, ImageWidth, LeftOrRight, OldOrNew, StageDefaults } from "../constants/stageConstants";


export default class NodeModel {
  constructor(id, leftNodeAbove, rightNodeAbove, isLeftLongEdge, isRightLongEdge, topLeftStrand = null, topRightStrand = null) {
    this.id = id;
    this.topLeftStrand = this.determineTopLeftStrand(leftNodeAbove, topLeftStrand);
    this.topRightStrand =this.determineTopRightStrand(rightNodeAbove, topRightStrand);

    this.bottomLeftStrand = null;
    this.bottomRightStrand = null;

    this.leftNodeAbove = leftNodeAbove;
    this.rightNodeAbove = rightNodeAbove;

    // center position?

    this.nodeSymbol = StageDefaults.NODE_AND_PATTERN_METHOD === OldOrNew.OLD
      ? NodeSymbol.NONE
      : NodeSymbol.LEFT;
    this.nodeSymbolShape = StageDefaults.NODE_AND_PATTERN_METHOD === OldOrNew.OLD
      ? NodeSymbolShape.NONE
      : NodeSymbolShape.POINT;
    this.prevClickType = StageDefaults.NODE_AND_PATTERN_METHOD === OldOrNew.OLD
      ? ClickType.NONE
      : ClickType.LEFT;

    this.xStart = 0;
    this.yStart = 0;

    this.isLeftLongEdge = isLeftLongEdge;
    this.isRightLongEdge = isRightLongEdge;

    if (StageDefaults.NODE_AND_PATTERN_METHOD === OldOrNew.NEW) {
      this.changeBottomStrands();
    }
  }

  clickNode = (clickType) => {

    this.checkForNullStrands();
    
    // first cycle symbol type
    if (this.prevClickType === ClickType.NONE ||
      this.prevClickType === clickType) {
        this.cycleNodeSymbolType();
    }

    this.prevClickType = clickType;

    // now decide which symbol to change to
    let symbol = NodeSymbol.NONE;

    // Dont allow left or right symbols if the top strands are null
    if (this.topLeftStrand !== null && this.topRightStrand !== null) {
      switch(clickType) {
        case ClickType.LEFT:
          symbol = this.getLeftClickSymbolBySymbolType();
          break;
        case ClickType.RIGHT:
          symbol = this.getRightClickSymbolBySymbolType();
      }
    }

    this.changeNodeSymbol(symbol);
  }

  getColor = () => {
    this.refreshStrands();
    this.checkForNullStrands();
    switch (this.nodeSymbol) {
      default:
      case NodeSymbol.NONE:
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

  
  getBottomStrandColor = (leftOrRight) => {
    this.refreshStrands();
    if (this.nodeSymbol === NodeSymbol.NONE) {
      return NodeDefaults.EMPTY_COLOR;
    }
    if (leftOrRight === LeftOrRight.LEFT) {
      return this.bottomLeftStrand !== null
        ? this.bottomLeftStrand.color
        : NodeDefaults.EMPTY_COLOR;
    } else {
      return this.bottomRightStrand !== null
      ? this.bottomRightStrand.color
      : NodeDefaults.EMPTY_COLOR;
    }
    // let nodeAbove = this.getNodeAbove(leftOrRight);
    // if (nodeAbove === null) {
    //   let strand = this.getBottomStrand(leftOrRight);
    //   return strand !== null
    //     ? strand.color
    //     : NodeDefaults.EMPTY_COLOR;
    // }
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

  changeNodeSymbol = (newSymbol) => {
    this.nodeSymbol = newSymbol;
    this.refreshStrands();
    this.changeBottomStrands();
    // this.nodeColor = this.getNodeColor();
  }

  cycleNodeSymbolType = () => {
    if (this.nodeSymbolShape === NodeSymbolShape.NONE) {
      this.nodeSymbolShape = NodeSymbolShape.POINT;
    } else if (this.nodeSymbolShape === NodeSymbolShape.POINT) {
      this.nodeSymbolShape = NodeSymbolShape.CURVE;
    } else if (this.nodeSymbolShape === NodeSymbolShape.CURVE) {
      //this.nodeSymbolType = NodeSymbolType.NONE;
      this.nodeSymbolShape = NodeSymbolShape.POINT;
    }
  }

  getRightClickSymbolBySymbolType = () => {
    if (this.nodeSymbolShape === NodeSymbolShape.NONE) {
      return NodeSymbol.NONE;
    } else if (this.nodeSymbolShape === NodeSymbolShape.POINT) {
      return NodeSymbol.RIGHT;
    } else if (this.nodeSymbolShape === NodeSymbolShape.CURVE) {
      return NodeSymbol.LEFT_RIGHT;
    }
  }

  getLeftClickSymbolBySymbolType = () => {
    if (this.nodeSymbolShape === NodeSymbolShape.NONE) {
      return NodeSymbol.NONE;
    } else if (this.nodeSymbolShape === NodeSymbolShape.POINT) {
      return NodeSymbol.LEFT;
    } else if (this.nodeSymbolShape === NodeSymbolShape.CURVE) {
      return NodeSymbol.RIGHT_LEFT;
    }
  }

  
  refreshStrands = () => {
    if (this.leftNodeAbove !== null) {
      this.topLeftStrand = this.isLeftLongEdge
        ? this.leftNodeAbove.bottomLeftStrand
        : this.leftNodeAbove.bottomRightStrand;
    }

    if (this.rightNodeAbove !== null) {
      this.topRightStrand = this.isRightLongEdge
        ? this.rightNodeAbove.bottomRightStrand
        : this.rightNodeAbove.bottomLeftStrand;
    }

    this.changeBottomStrands();
  }

  
  getBottomStrand = (leftOrRight) => {
    if (leftOrRight === LeftOrRight.LEFT) {
      return this.bottomLeftStrand;
    } else {
      return this.bottomRightStrand;
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

  
  checkForNullStrands = () => {
    if ((this.topLeftStrand === null || this.topRightStrand === null) &&
        this.nodeSymbol !== NodeSymbol.NONE) {
          this.nodeSymbolShape = NodeSymbolShape.NONE;
          this.prevClickType(ClickType.NONE);
          this.changeNodeSymbol(NodeSymbol.NONE);
      }
  }

  
  getNodeAbove = (leftOrRight) => {
    if (leftOrRight === LeftOrRight.LEFT) {
      return this.leftNodeAbove;
    } else {
      return this.rightNodeAbove;
    }
  }

}