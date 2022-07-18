import React, { useContext, useEffect, useState } from 'react';
import { MakerContext } from '../../../MakerContext';
import { getSelectedColor } from '../resources/logic/controlLogic';
import '../resources/styling/colors.css';
import ColorSquare from './ColorSquare';

const Colors = () => {

  const {
    colors, setColors,
    selectedColor, setSelectedColor,
  } = useContext(MakerContext);


  const [displayArray, setDisplayArray] = useState([]);

  //#region  effects

  useEffect(() => {
    if (colors) {
      setSelectedColor(getSelectedColor(colors));
      setDisplayArray(createColorsDisplay());
    }
  }, [colors]);

  useEffect(() => {
    if (displayArray) {
      console.log(`display changed`);
    }
  }, [displayArray]);

  //#endregion

  //#region normal methods
  
  const createColorsDisplay = () => {
    let array = [];
    colors.forEach(c => {
      console.log(`creating color ${c.color}`);
      array.push(
        <ColorSquare
          key={c.letter}
          id={c.letter}
        />
      )
    });
    return array;
  }

  //#endregion


  return (
    <div className="colors-area">
      hi?
      {displayArray}
    </div>
  );
}

export default Colors;