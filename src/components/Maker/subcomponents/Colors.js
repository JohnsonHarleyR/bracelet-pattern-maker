import React, { useContext, useEffect, useRef, useState } from 'react';
import { MakerContext } from '../../../MakerContext';
import { alterColorHex, getSelectedColor } from '../resources/logic/controlLogic';
import '../resources/styling/colors.css';
import ColorSquare from './ColorSquare';

const Colors = () => {

  const selectorRef = useRef();

  const {
    colors, setColors,
    selectedColor, setSelectedColor,
  } = useContext(MakerContext);

  const [inputColor, setInputColor] = useState(selectedColor);
  const [colorsDisplayArray, setColorsDisplayArray] = useState([]);

  //#region  effects

  useEffect(() => {
    if (selectedColor) {
      setInputColor(selectedColor);
      selectorRef.current.value = selectedColor.color;
    }
  }, [selectedColor]);

  useEffect(() => {
    if (colors) {
      let newSelected = getSelectedColor(colors);
      setSelectedColor(newSelected);
      setColorsDisplayArray(createColorsDisplay());
    }
  }, [colors]);

  useEffect(() => {
    if (colorsDisplayArray) {
      console.log(`display changed`);
    }
  }, [colorsDisplayArray]);

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

  const changeSelectedColorHex = () => {
    let newColors = alterColorHex(selectedColor.letter, [...colors], inputColor);
    setColors(newColors);
  }

  //#endregion

  //#region event methods
  
  const changeInputColor = () => {
    setInputColor(selectorRef.current.value);
  }

  //#endregion

  return (
    <div className="colors-area">

      <div className="colors-display">
        {colorsDisplayArray}
      </div>
      <div className="changer">
        <input type="color" ref={selectorRef} onChange={changeInputColor} />
        <button onClick={changeSelectedColorHex}>Change</button>
      </div>
    </div>
  );
}

export default Colors;