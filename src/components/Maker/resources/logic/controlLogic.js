

//#region colors

export const getColorIndexById = (id, colors) => {
  for (let i = 0; i < colors.length; i++) {
    if (colors[i].letter === id) {
      return i;
    }
  }
  throw `Error finding color id ${id}. (getColorIndexByid: controlLogic.js)`;
}

//#endregion