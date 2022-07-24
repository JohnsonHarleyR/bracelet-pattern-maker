
export const NodeDefaults = {
  EMPTY_COLOR: "#ffffff",
  SHORT_ROW_X_OFFSET: 59,
  ROWS_AFTER_SETUP: 2,
}

export const NodeOffset = {
  X_BETWEEN_NODES: 118,
  Y_BETWEEN_NODES: 45,
  X_FROM_EDGE_LONG: 96, // from left wall - first node in row
  X_FROM_EDGE_SHORT: 155,
}

export const StrandOffset = {
  X_BOTTOM_LEFT: -37, // relative position from node's starting position
  Y_BOTTOM_LEFT: 26,
  X_BOTTOM_RIGHT: 22,
  Y_BOTTOM_RIGHT: 26,
}

export const NodeSymbol = {
  NONE: 'NONE',
  LEFT: 'LEFT',
  LEFT_RIGHT: 'LEFT_RIGHT',
  RIGHT: 'RIGHT',
  RIGHT_LEFT: 'RIGHT_LEFT',
}

export const NodeSymbolType = {
  NONE: 'NONE',
  POINT: 'POINT',
  CURVE: 'CURVE',
}

export const RowType = {
  LONG: "LONG",
  SHORT: "SHORT",
}

export const ClickType = {
  RIGHT: "RIGHT",
  LEFT: "LEFT",
  NONE: "NONE",
}