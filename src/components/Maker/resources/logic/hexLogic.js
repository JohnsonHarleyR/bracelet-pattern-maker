import { ColorValue } from "../constants/designConstants";

//#region Comparing Color Values

export const getClosestEndOfColorSpectrum = (hexValue) => {
  let whiteDif = getDifferenceOfHexColors(hexValue, "#ffffff");
  let blackDif = getDifferenceOfHexColors(hexValue, "#000000");

  if (blackDif < whiteDif) {
    return ColorValue.BLACK;
  } else {
    return ColorValue.WHITE;
  }
}

const getDifferenceOfHexColors = (valueA, valueB) => {
  let rgbA = hexToRgb(valueA);
  let rgbB = hexToRgb(valueB);

  let difference = getColorDifference(rgbA, rgbB);
  return difference;
}

//#endregion

//#region Converting Color Values

const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const rgbToHex = (r, g, b) => {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
}

const componentToHex = (c) => {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const getColorDifference = (color1, color2) => {
  let R = color1.r - color2.r;
  let G = color1.g - color2.g;
  let B = color1.b - color2.b;
  let r = (color1.r + color2.r) / 2;

  let preC = (2 + r) * Math.pow(R, 2) + 4 * Math.pow(G,2) + 
      (2 + ((255 - r) / 256)) * Math.pow(B,2);
  let C = Math.sqrt(preC);
  return C;
}

const getColorDifferenceDeltaE = (color1, color2) => {
  let dif = deltaE(color1, color2);
  return dif;
}

const deltaE = (rgbA, rgbB) => {
  // test
  let testJson = 
  [
      {
          r: rgbA.r,
          g: rgbA.g,
          b: rgbA.b,
          rgba: rgbA.rgba,
          hex: rgbA.hex
      },
      {
          r: rgbB.r,
          g: rgbB.g,
          b: rgbB.b,
          rgba: rgbB.rgba,
          hex: rgbB.hex
      }
  ];
  console.log(JSON.stringify(testJson));

  let labA = convertRGBtoLAB(rgbA.r, rgbA.g, rgbA.b);
  let labB = convertRGBtoLAB(rgbB.r, rgbB.g, rgbB.b);
  let deltaL = labA[0] - labB[0];
  let deltaA = labA[1] - labB[1];
  let deltaB = labA[2] - labB[2];
  let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
  let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
  let deltaC = c1 - c2;
  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  let sc = 1.0 + 0.045 * c1;
  let sh = 1.0 + 0.015 * c1;
  let deltaLKlsl = deltaL / (1.0);
  let deltaCkcsc = deltaC / (sc);
  let deltaHkhsh = deltaH / (sh);
  let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return i < 0 ? 0 : Math.sqrt(i);
}

export const convertRGBtoLAB = (red, green, blue) => {
  let r = red / 255;
  let g = green / 255;
  let b = blue / 255;

  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
  y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
  z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

export const convertRGBtoXYZ = (color) => {
  let r = color.r / 255;
  let g = color.g / 255;
  let b = color.b / 255;

  // Inverse sRGB Companding
  r = inverseRGOCompanding(r);
  g = inverseRGOCompanding(g);
  b = inverseRGOCompanding(b);

  // multiply by matrix
  r = (0.4124 * r) + (0.3576 * r) + (0.1805 * r);
  g = (0.2126 * g) + (0.7152 * g) + (0.0722 * g);
  b = (0.0193 * b) + (0.1192 * b) + (0.9505 * b);

  return ({
      r: r,
      g: g,
      b: b
  });
}

const inverseRGOCompanding = (value) => {
  let v;
  if (value <= 0.04045) {
      v = value / 12.92;
  } else {
      v = Math.pow((value + 0.055 / 1.055), 2.4);
  }
  return v;
}

//#endregion