import { NodeDefaults, NodeSymbol } from "../constants/nodeConstants";


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
  }

  changeNodeSymbol = (newSymbol) => {
    this.nodeSymbol = newSymbol;
    this.changeBottomStrands();
    this.nodeColor = this.determineNodeColor();
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