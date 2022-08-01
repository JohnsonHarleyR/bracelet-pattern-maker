import { StrandOffset } from "./nodeConstants"

export const StageDefaults = {
  BG_COLOR: "#ffffff",
  COPYRIGHT_TEXT: "Made with Harlee's Creation Tools 2022",
  COPYRIGHT_TEXT_COLOR: "Grey",
  COPYRIGHT_TEXT_SIZE: 14,
}

export const ImageName = {
  CIRCLE_BLANK: "blank-circle.png",
  CIRCLE_POINT_LEFT: "circle-left-arrow.png",
  CIRCLE_POINT_LEFT_WHITE: "circle-left-arrow-white.png",
  CIRCLE_POINT_RIGHT: "circle-right-arrow.png",
  CIRCLE_POINT_RIGHT_WHITE: "circle-right-arrow-white.png",
  CIRCLE_CURVE_LEFT: "circle-left-curve.png",
  CIRCLE_CURVE_LEFT_WHITE: "circle-left-curve-white.png",
  CIRCLE_CURVE_RIGHT: "circle-right-curve.png",
  CIRCLE_CURVE_RIGHT_WHITE: "circle-right-curve-white.png",

  STRAND_LEFT: "strand-left.png",
  STRAND_RIGHT: "strand-right.png",
  STRAND_LEFT_FINAL_EDGE: "strand-left-final-edge.png",
  STRAND_RIGHT_FINAL_EDGE: "strand-right-final-edge.png",

  STRAND_START_LEFT: "strand-start-left.png",
  STRAND_START_RIGHT: "strand-start-right.png",
  STRAND_END_LEFT: "strand-end-left.png",
  STRAND_END_RIGHT: "strand-end-right.png",

  TILE: "tile.png",
  TILE_LEFT: "tile-left.png",
  TILE_RIGHT: "tile-right.png",

  TILE_START: "tile-start.png",
  TILE_START_LEFT: "tile-start-left.png",
  TILE_START_RIGHT: "tile-start-right.png",
  
  TILE_END: "tile-end.png",
  TILE_END_LEFT: "tile-end-left.png",
  TILE_END_RIGHT: "tile-end-right.png",
}

export const ImageWidth = {
  CIRCLE_BLANK: 44,
  CIRCLE_POINT_LEFT: 44,
  CIRCLE_POINT_RIGHT: 44,
  CIRCLE_CURVE_LEFT: 44,
  CIRCLE_CURVE_RIGHT: 44,

  STRAND_LEFT: 59,
  STRAND_RIGHT: 59,
  STRAND_LEFT_FINAL_EDGE: 59,
  STRAND_RIGHT_FINAL_EDGE: 59,

  STRAND_START_LEFT: 59,
  STRAND_START_RIGHT: 59,
  STRAND_END_LEFT: 59,
  STRAND_END_RIGHT: 59,

  TILE: 59,
  TILE_LEFT: 118,
  TILE_RIGHT: 118,

  TILE_START: 59,
  TILE_START_LEFT: 118,
  TILE_START_RIGHT: 118,
  
  TILE_END: 59,
  TILE_END_LEFT: 118,
  TILE_END_RIGHT: 118,
}

export const ImageHeight = {
  CIRCLE_BLANK: 44,
  CIRCLE_POINT_LEFT: 44,
  CIRCLE_POINT_RIGHT: 44,
  CIRCLE_CURVE_LEFT: 44,
  CIRCLE_CURVE_RIGHT: 44,

  STRAND_LEFT: 85,
  STRAND_RIGHT: 85,
  STRAND_LEFT_FINAL_EDGE: 85,
  STRAND_RIGHT_FINAL_EDGE: 85,

  STRAND_START_LEFT: 70,
  STRAND_START_RIGHT: 70,
  STRAND_END_LEFT: 68,
  STRAND_END_RIGHT: 68,

  TILE: 45,
  TILE_LEFT: 45,
  TILE_RIGHT: 45,

  TILE_START: 44,
  TILE_START_LEFT: 44,
  TILE_START_RIGHT: 44,
  
  TILE_END: 44,
  TILE_END_LEFT: 44,
  TILE_END_RIGHT: 44,
}

export const LeftOrRight = {
  LEFT: "LEFT",
  RIGHT: "RIGHT"
}

export const TileTextOffset = {
  X_LEFT_TILE: 10,
  X_RIGHT_TILE: ImageWidth.TILE_RIGHT - 18,
  Y_TILE: 25.5,
}

export const RenderCategory = {
  CIRCLE: 'CIRCLE',
  STRAND: 'STRAND',
  TILE: 'TILE',
  BG_FILL: 'BG_FILL',
  OVER_TEXT: 'OVER_TEXT',
  NONE: 'NONE',
}

export const ImageType = {
  CIRCLE_BLANK: 'CIRCLE_BLANK',
  CIRCLE_POINT_LEFT: 'CIRCLE_POINT_LEFT',
  CIRCLE_POINT_LEFT_WHITE: 'CIRCLE_POINT_LEFT_WHITE',
  CIRCLE_CURVE_LEFT: 'CIRCLE_CURVE_LEFT',
  CIRCLE_CURVE_LEFT_WHITE: 'CIRCLE_CURVE_LEFT_WHITE',
  CIRCLE_POINT_RIGHT: 'CIRCLE_POINT_RIGHT',
  CIRCLE_POINT_RIGHT_WHITE: 'CIRCLE_POINT_RIGHT_WHITE',
  CIRCLE_CURVE_RIGHT: 'CIRCLE_CURVE_RIGHT',
  CIRCLE_CURVE_RIGHT_WHITE: 'CIRCLE_CURVE_RIGHT_WHITE',

  STRAND_START_LEFT: 'STRAND_START_LEFT',
  STRAND_START_RIGHT: 'STRAND_START_RIGHT',

  STRAND_LEFT: 'STRAND_LEFT',
  STRAND_RIGHT: 'STRAND_RIGHT',

  STRAND_BOTTOM_LEFT: 'STRAND_BOTTOM_LEFT',
  STRAND_BOTTOM_RIGHT: 'STRAND_BOTTOM_RIGHT',

  STRAND_LEFT_FINAL_EDGE: 'STRAND_LEFT_FINAL_EDGE',
  STRAND_RIGHT_FINAL_EDGE: 'STRAND_RIGHT_FINAL_EDGE',

  STRAND_END_LEFT: 'STRAND_END_LEFT',
  STRAND_END_RIGHT: 'STRAND_END_RIGHT',

  TILE_START_LEFT: 'TILE_START_LEFT',
  TILE_START: 'TILE_START',
  TILE_START_RIGHT: 'TILE_START_RIGHT',

  TILE_LEFT: 'TILE_LEFT',
  TILE: 'TILE',
  TILE_RIGHT: 'TILE_RIGHT',
  
  TILE_END_LEFT: 'TILE_END_LEFT',
  TILE_END: 'TILE_END',
  TILE_END_RIGHT: 'TILE_END_RIGHT',

  BG_FILL: 'BG_FILL',
  OVER_TEXT: 'OVER_TEXT',
  NONE: 'NONE',
}

export const RenderInfo = {
  CIRCLE_BLANK: {
    sheet: "circle-sheet.png",
    x: 0,
    y: 0,
    width: ImageWidth.CIRCLE_BLANK,
    height: ImageHeight.CIRCLE_BLANK,
    category: RenderCategory.CIRCLE,
    getXStart: (node) => {
      return node.xStart;
    },
    getYStart: (node) => {
      return node.yStart;
    },
    getColor: (node) => {
      return node.getColor();
    },
    getText: () => {
      return null;
    }
  },
  CIRCLE_POINT_LEFT: {
    sheet: "circle-sheet.png",
    x: ImageWidth.CIRCLE_POINT_LEFT,
    y: 0,
    width: ImageWidth.CIRCLE_POINT_LEFT,
    height: ImageHeight.CIRCLE_POINT_LEFT,
    category: RenderCategory.CIRCLE,
    getXStart: (node) => {
      return node.xStart;
    },
    getYStart: (node) => {
      return node.yStart;
    },
    getColor: (node) => {
      return node.getColor();
    },
    getText: () => {
      return null;
    }
  },
  CIRCLE_POINT_LEFT_WHITE: {
    sheet: "circle-sheet.png",
    x: 2 * ImageWidth.CIRCLE_POINT_LEFT,
    y: 0,
    width: ImageWidth.CIRCLE_POINT_LEFT,
    height: ImageHeight.CIRCLE_POINT_LEFT,
    category: RenderCategory.CIRCLE,
    getXStart: (node) => {
      return node.xStart;
    },
    getYStart: (node) => {
      return node.yStart;
    },
    getColor: (node) => {
      return node.getColor();
    },
    getText: () => {
      return null;
    }
  },
  CIRCLE_CURVE_LEFT: {
    sheet: "circle-sheet.png",
    x: 0,
    y: ImageHeight.CIRCLE_CURVE_LEFT,
    width: ImageWidth.CIRCLE_CURVE_LEFT,
    height: ImageHeight.CIRCLE_CURVE_LEFT,
    category: RenderCategory.CIRCLE,
    getXStart: (node) => {
      return node.xStart;
    },
    getYStart: (node) => {
      return node.yStart;
    },
    getColor: (node) => {
      return node.getColor();
    },
    getText: () => {
      return null;
    }
  },
  CIRCLE_CURVE_LEFT_WHITE: {
    sheet: "circle-sheet.png",
    x: ImageWidth.CIRCLE_CURVE_LEFT,
    y: ImageHeight.CIRCLE_CURVE_LEFT,
    width: ImageWidth.CIRCLE_CURVE_LEFT,
    height: ImageHeight.CIRCLE_CURVE_LEFT,
    category: RenderCategory.CIRCLE,
    getXStart: (node) => {
      return node.xStart;
    },
    getYStart: (node) => {
      return node.yStart;
    },
    getColor: (node) => {
      return node.getColor();
    },
    getText: () => {
      return null;
    }
  },
  CIRCLE_POINT_RIGHT: {
    sheet: "circle-sheet.png",
    x: 2 * ImageWidth.CIRCLE_POINT_RIGHT,
    y: ImageHeight.CIRCLE_POINT_RIGHT,
    width: ImageWidth.CIRCLE_POINT_RIGHT,
    height: ImageHeight.CIRCLE_POINT_RIGHT,
    category: RenderCategory.CIRCLE,
    getXStart: (node) => {
      return node.xStart;
    },
    getYStart: (node) => {
      return node.yStart;
    },
    getColor: (node) => {
      return node.getColor();
    },
    getText: () => {
      return null;
    }
  },
  CIRCLE_POINT_RIGHT_WHITE: {
    sheet: "circle-sheet.png",
    x: 0,
    y: 2 * ImageHeight.CIRCLE_POINT_RIGHT,
    width: ImageWidth.CIRCLE_POINT_RIGHT,
    height: ImageHeight.CIRCLE_POINT_RIGHT,
    category: RenderCategory.CIRCLE,
    getXStart: (node) => {
      return node.xStart;
    },
    getYStart: (node) => {
      return node.yStart;
    },
    getColor: (node) => {
      return node.getColor();
    },
    getText: () => {
      return null;
    }
  },
  CIRCLE_CURVE_RIGHT: {
    sheet: "circle-sheet.png",
    x: ImageWidth.CIRCLE_CURVE_RIGHT,
    y: 2 * ImageHeight.CIRCLE_CURVE_RIGHT,
    width: ImageWidth.CIRCLE_CURVE_RIGHT,
    height: ImageHeight.CIRCLE_CURVE_RIGHT,
    category: RenderCategory.CIRCLE,
    getXStart: (node) => {
      return node.xStart;
    },
    getYStart: (node) => {
      return node.yStart;
    },
    getColor: (node) => {
      return node.getColor();
    },
    getText: () => {
      return null;
    }
  },
  CIRCLE_CURVE_RIGHT_WHITE: {
    sheet: "circle-sheet.png",
    x: 2 * ImageWidth.CIRCLE_CURVE_RIGHT,
    y: 2 * ImageHeight.CIRCLE_CURVE_RIGHT,
    width: ImageWidth.CIRCLE_CURVE_RIGHT,
    height: ImageHeight.CIRCLE_CURVE_RIGHT,
    category: RenderCategory.CIRCLE,
    getXStart: (node) => {
      return node.xStart;
    },
    getYStart: (node) => {
      return node.yStart;
    },
    getColor: (node) => {
      return node.getColor();
    },
    getText: () => {
      return null;
    }
  },

  STRAND_START_LEFT: {
    sheet: "strand-sheet.png",
    x: 0,
    y: 0,
    width: ImageWidth.STRAND_START_LEFT,
    height: ImageHeight.STRAND_START_LEFT,
    category: RenderCategory.STRAND,
    leftOrRight: LeftOrRight.LEFT,
    getXStart: (node) => {
      return node.xStart + StrandOffset.X_START_LEFT;
    },
    getYStart: (node) => {
      return node.yStart + StrandOffset.Y_START_LEFT;
    },
    getColor: (node) => {
      return node.topLeftStrand.color;
    },
    getText: (node) => {
      return node.topLeftStrand.letter;
    }
  },
  STRAND_START_RIGHT: {
    sheet: "strand-sheet.png",
    x: ImageWidth.STRAND_START_LEFT,
    y: 0,
    width: ImageWidth.STRAND_START_RIGHT,
    height: ImageHeight.STRAND_START_RIGHT,
    category: RenderCategory.STRAND,
    leftOrRight: LeftOrRight.RIGHT,
    getXStart: (node) => {
      return node.xStart + StrandOffset.X_START_RIGHT;
    },
    getYStart: (node) => {
      return node.yStart + StrandOffset.Y_START_RIGHT;
    },
    getColor: (node) => {
      return node.topRightStrand.color;
    },
    getText: (node) => {
      return node.topRightStrand.letter;
    }
  },

  STRAND_LEFT: {
    sheet: "strand-sheet.png",
    x: 0,
    y: ImageHeight.STRAND_START_LEFT,
    width: ImageWidth.STRAND_LEFT,
    height: ImageHeight.STRAND_LEFT,
    category: RenderCategory.STRAND,
    getXStart: (node) => {
      return node.xStart + StrandOffset.X_BOTTOM_LEFT;
    },
    getYStart: (node) => {
      return node.yStart + StrandOffset.Y_BOTTOM_LEFT;
    },
    getColor: (node) => {
      return node.getBottomStrandColor(LeftOrRight.LEFT);
    },
    getText: () => {
      return null;
    }
  },
  STRAND_RIGHT:  {
    sheet: "strand-sheet.png",
    x: ImageWidth.STRAND_LEFT,
    y: ImageHeight.STRAND_START_RIGHT,
    width: ImageWidth.STRAND_RIGHT,
    height: ImageHeight.STRAND_RIGHT,
    category: RenderCategory.STRAND,
    getXStart: (node) => {
      return node.xStart + StrandOffset.X_BOTTOM_RIGHT;
    },
    getYStart: (node) => {
      return node.yStart + StrandOffset.Y_BOTTOM_RIGHT;
    },
    getColor: (node) => {
      return node.getBottomStrandColor(LeftOrRight.RIGHT);
    },
    getText: () => {
      return null;
    }
  },

  STRAND_BOTTOM_LEFT: {
    sheet: "strand-sheet.png",
    x: 0,
    y: ImageHeight.STRAND_START_LEFT + ImageHeight.STRAND_LEFT / 2,
    width: ImageWidth.STRAND_LEFT,
    height: ImageHeight.STRAND_LEFT / 2,
    category: RenderCategory.STRAND,
    getXStart: (node) => {
      return node.xStart + StrandOffset.X_BOTTOM_LEFT;
    },
    getYStart: (node) => {
      return node.yStart + StrandOffset.Y_BOTTOM_LEFT;
    },
    getColor: (node) => {
      return node.getBottomStrandColor(LeftOrRight.LEFT);
    },
    getText: () => {
      return null;
    }
  },
  STRAND_BOTTOM_RIGHT:  {
    sheet: "strand-sheet.png",
    x: ImageWidth.STRAND_LEFT,
    y: ImageHeight.STRAND_START_RIGHT + ImageHeight.STRAND_RIGHT / 2,
    width: ImageWidth.STRAND_RIGHT,
    height: ImageHeight.STRAND_RIGHT / 2,
    category: RenderCategory.STRAND,
    getXStart: (node) => {
      return node.xStart + StrandOffset.X_BOTTOM_RIGHT;
    },
    getYStart: (node) => {
      return node.yStart + StrandOffset.Y_BOTTOM_RIGHT;
    },
    getColor: (node) => {
      return node.getBottomStrandColor(LeftOrRight.RIGHT);
    },
    getText: () => {
      return null;
    }
  },

  STRAND_LEFT_FINAL_EDGE: {
    sheet: "strand-sheet.png",
    x: 0,
    y: ImageHeight.STRAND_START_LEFT + ImageHeight.STRAND_LEFT,
    width: ImageWidth.STRAND_LEFT_FINAL_EDGE,
    height: ImageHeight.STRAND_LEFT_FINAL_EDGE,
    category: RenderCategory.STRAND,
    getXStart: (node) => {
      return node.xStart + StrandOffset.X_BOTTOM_LEFT;
    },
    getYStart: (node) => {
      return node.yStart + StrandOffset.Y_BOTTOM_LEFT;
    },
    getColor: (node) => {
      return node.getBottomStrandColor(LeftOrRight.LEFT);
    },
    getText: () => {
      return null;
    }
  },
  STRAND_RIGHT_FINAL_EDGE: {
    sheet: "strand-sheet.png",
    x: ImageWidth.STRAND_LEFT_FINAL_EDGE,
    y: ImageHeight.STRAND_START_RIGHT + ImageHeight.STRAND_RIGHT,
    width: ImageWidth.STRAND_RIGHT_FINAL_EDGE,
    height: ImageHeight.STRAND_RIGHT_FINAL_EDGE,
    category: RenderCategory.STRAND,
    getXStart: (node) => {
      return node.xStart + StrandOffset.X_BOTTOM_RIGHT;
    },
    getYStart: (node) => {
      return node.yStart + StrandOffset.Y_BOTTOM_RIGHT;
    },
    getColor: (node) => {
      return node.getBottomStrandColor(LeftOrRight.RIGHT);
    },
    getText: () => {
      return null;
    }
  },

  STRAND_END_LEFT: {
    sheet: "strand-sheet.png",
    x: 0,
    y: ImageHeight.STRAND_START_LEFT + ImageHeight.STRAND_LEFT + ImageHeight.STRAND_LEFT_FINAL_EDGE,
    width: ImageWidth.STRAND_END_LEFT,
    height: ImageHeight.STRAND_END_LEFT,
    category: RenderCategory.STRAND,
    getXStart: (node) => {
      return node.xStart + StrandOffset.X_BOTTOM_LEFT;
    },
    getYStart: (node) => {
      return node.yStart + StrandOffset.Y_BOTTOM_LEFT;
    },
    getColor: (node) => {
      return node.getBottomStrandColor(LeftOrRight.LEFT);
    },
    getText: () => {
      return null;
    }
  },
  STRAND_END_RIGHT: {
    sheet: "strand-sheet.png",
    x: ImageWidth.STRAND_END_LEFT,
    y: ImageHeight.STRAND_START_RIGHT + ImageHeight.STRAND_RIGHT + ImageHeight.STRAND_RIGHT_FINAL_EDGE,
    width: ImageWidth.STRAND_END_RIGHT,
    height: ImageHeight.STRAND_END_RIGHT,
    category: RenderCategory.STRAND,
    getXStart: (node) => {
      return node.xStart + StrandOffset.X_BOTTOM_RIGHT;
    },
    getYStart: (node) => {
      return node.yStart + StrandOffset.Y_BOTTOM_RIGHT;
    },
    getColor: (node) => {
      return node.getBottomStrandColor(LeftOrRight.RIGHT);
    },
    getText: () => {
      return null;
    }
  },

  TILE_START_LEFT: {
    sheet: "tile-sheet.png",
    x: 0,
    y: 0,
    width: ImageWidth.TILE_START_LEFT,
    height: ImageHeight.TILE_START_LEFT,
    category: RenderCategory.TILE,
    getXStart: (xIndex) => {
      return 0;
    },
    getYStart: (yOffset, yIndex, rowCount) => {
      return yOffset;
    },
    getColor: () => {
      return null;
    },
    getText: () => {
      return null;
    }
  },
  TILE_START: {
    sheet: "tile-sheet.png",
    x: ImageWidth.TILE_START_LEFT,
    y: 0,
    width: ImageWidth.TILE_START,
    height: ImageHeight.TILE_START,
    category: RenderCategory.TILE,
    getXStart: (xIndex) => {
      return ImageWidth.TILE_START_LEFT + (xIndex * ImageWidth.TILE_START);
    },
    getYStart: (yOffset, yIndex, rowCount) => {
      return yOffset;
    },
    getColor: () => {
      return null;
    },
    getText: () => {
      return null;
    }
  },
  TILE_START_RIGHT: {
    sheet: "tile-sheet.png",
    x: ImageWidth.TILE_START_LEFT + ImageWidth.TILE_START,
    y: 0,
    width: ImageWidth.TILE_START_RIGHT,
    height: ImageHeight.TILE_START_RIGHT,
    category: RenderCategory.TILE,
    getXStart: (xIndex) => {
      return ImageWidth.TILE_START_LEFT + (xIndex * ImageWidth.TILE_START);
    },
    getYStart: (yOffset, yIndex, rowCount) => {
      return yOffset;
    },
    getColor: () => {
      return null;
    },
    getText: () => {
      return null;
    }
  },

  TILE_LEFT: {
    sheet: "tile-sheet.png",
    x: 0,
    y: ImageHeight.TILE_START_LEFT,
    width: ImageWidth.TILE_LEFT,
    height: ImageHeight.TILE_LEFT,
    category: RenderCategory.TILE,
    leftOrRight: LeftOrRight.LEFT,
    getXStart: (xIndex) => {
      return 0;
    },
    getYStart: (yOffset, yIndex, rowCount) => {
      return yOffset + ImageHeight.TILE_START_LEFT + (yIndex * ImageHeight.TILE_LEFT);
    },
    getColor: () => {
      return null;
    },
    getText: (yIndex) => {
      return yIndex + 1;
    }
  },
  TILE: {
    sheet: "tile-sheet.png",
    x: ImageWidth.TILE_LEFT,
    y: ImageHeight.TILE_START,
    width: ImageWidth.TILE,
    height: ImageHeight.TILE,
    category: RenderCategory.TILE,
    getXStart: (xIndex) => {
      return ImageWidth.TILE_LEFT + (xIndex * ImageWidth.TILE);
    },
    getYStart: (yOffset, yIndex, rowCount) => {
      return yOffset + ImageHeight.TILE_START + (yIndex * ImageHeight.TILE);
    },
    getColor: () => {
      return null;
    },
    getText: () => {
      return null;
    }
  },
  TILE_RIGHT: {
    sheet: "tile-sheet.png",
    x: ImageWidth.TILE_LEFT + ImageWidth.TILE,
    y: ImageHeight.TILE_START_RIGHT,
    width: ImageWidth.TILE_RIGHT,
    height: ImageHeight.TILE_RIGHT,
    category: RenderCategory.TILE,
    leftOrRight: LeftOrRight.RIGHT,
    getXStart: (xIndex) => {
      return ImageWidth.TILE_LEFT + (xIndex * ImageWidth.TILE);
    },
    getYStart: (yOffset, yIndex, rowCount) => {
      return yOffset + ImageHeight.TILE_START_RIGHT + (yIndex * ImageHeight.TILE_RIGHT);
    },
    getColor: () => {
      return null;
    },
    getText: (yIndex) => {
      return yIndex + 1;
    }
  },
  
  TILE_END_LEFT: {
    sheet: "tile-sheet.png",
    x: 0,
    y: ImageHeight.TILE_START_LEFT + ImageHeight.TILE_LEFT,
    width: ImageWidth.TILE_END_LEFT,
    height: ImageHeight.TILE_END_LEFT,
    category: RenderCategory.TILE,
    getXStart: (xIndex) => {
      return 0;
    },
    getYStart: (yOffset, yIndex, rowCount) => {
      return yOffset + ImageHeight.TILE_START_LEFT + (rowCount * ImageHeight.TILE_LEFT);
    },
    getColor: () => {
      return null;
    },
    getText: () => {
      return null;
    }
  },
  TILE_END: {
    sheet: "tile-sheet.png",
    x: ImageWidth.TILE_END_LEFT,
    y: ImageHeight.TILE_START + ImageHeight.TILE,
    width: ImageWidth.TILE_END,
    height: ImageHeight.TILE_END,
    category: RenderCategory.TILE,
    getXStart: (xIndex) => {
      return ImageWidth.TILE_END_LEFT + (xIndex * ImageWidth.TILE_END);
    },
    getYStart: (yOffset, yIndex, rowCount) => {
      return yOffset + ImageHeight.TILE_START + (rowCount * ImageHeight.TILE);
    },
    getColor: () => {
      return null;
    },
    getText: () => {
      return null;
    }
  },
  TILE_END_RIGHT: {
    sheet: "tile-sheet.png",
    x: ImageWidth.TILE_END_LEFT + ImageWidth.TILE_END,
    y: ImageHeight.TILE_START_RIGHT + ImageHeight.TILE_RIGHT,
    width: ImageWidth.TILE_END_RIGHT,
    height: ImageHeight.TILE_END_RIGHT,
    category: RenderCategory.TILE,
    getXStart: (xIndex) => {
      return ImageWidth.TILE_END_LEFT + (xIndex * ImageWidth.TILE_END);
    },
    getYStart: (yOffset, yIndex, rowCount) => {
      return yOffset + ImageHeight.TILE_START_LEFT + (rowCount * ImageHeight.TILE);
    },
    getColor: () => {
      return null;
    },
    getText: () => {
      return null;
    }
  },
  BG_FILL: {
    sheet: null,
    x: null,
    y: null,
    width: null,
    height: null,
    category: RenderCategory.BG_FILL,
    getXStart: () => {
      return 0;
    },
    getYStart: (yOffset) => {
      return yOffset;
    },
    getColor: () => {
      return StageDefaults.BG_COLOR;
    },
    getText: () => {
      return '';
    }
  },
  OVER_TEXT: {
    sheet: null,
    x: null,
    y: null,
    width: null,
    height: null,
    category: RenderCategory.OVER_TEXT,
    getXStart: (canvas) => {
      return canvas.width - ImageWidth.TILE_END_RIGHT;
    },
    getYStart: (canvas) => {
      return canvas.height - ImageHeight.TILE_END_RIGHT / 2;
    },
    getColor: () => {
      return StageDefaults.COPYRIGHT_TEXT_COLOR;
    },
    getText: () => {
      return StageDefaults.COPYRIGHT_TEXT_SIZE;
    }
  },
}

