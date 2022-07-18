import React, { useContext, useEffect, useRef, useState } from 'react';
import { MakerContext } from '../../../MakerContext';
import { addNewColorReturnSuccess, alterColorHex, getSelectedColor } from '../resources/logic/controlLogic';
import '../resources/styling/colors.css';
import ColorSquare from './ColorSquare';

const Colors = () => {

  const selectorRef = useRef();
  const addRef = useRef();
  const deleteRef = useRef();

  const {
    isSetupDecided,
    strandsAcross,
    colors, setColors,
    selectedColor, setSelectedColor,
  } = useContext(MakerContext);

  const [inputColor, setInputColor] = useState(selectedColor);
  const [colorsDisplayArray, setColorsDisplayArray] = useState([]);

  //#region  effects

  useEffect(() => {
    if (isSetupDecided) {
      addRef.current.style.display = "none";
      deleteRef.current.style.display = "none";
    } else {
      addRef.current.style.display = "block";
      deleteRef.current.style.display = "block";
    }
  }, [isSetupDecided]);

  useEffect(() => {
    if (selectedColor) {
      setInputColor(selectedColor.color);
      selectorRef.current.value = selectedColor.color;
      console.log(`selected: ${selectedColor.color}, ref: ${selectorRef.current.value}`)
    }
  }, [selectedColor]);

  useEffect(() => {
    if (colors) {
      let newSelected = getSelectedColor(colors);
      setSelectedColor(newSelected);
      setColorsDisplayArray(createColorsDisplay());
    }
  }, [colors]);

  //#endregion

  //#region normal methods
  
  const createColorsDisplay = () => {
    let array = [];
    colors.forEach(c => {
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

  const addNewColor = () => {
    let colorsCopy = [...colors];
    let success = addNewColorReturnSuccess(inputColor, colorsCopy, strandsAcross);
    if (!success) {
      if (colors.length >= 26) {
        alert(`Could not add a new color. There are too many already.`);
      } else {
        alert(`Could not add a new color. More strands needed to add another.`);
      }
    } else {
      setColors(colorsCopy);
    }
  }

  //#endregion

  //#region event methods
  
  const changeInputColor = () => {
    setInputColor(selectorRef.current.value);
  }

  const clickAddButton = () => {
    addNewColor();
  }

  //#endregion

  return (
    <div className="colors-area">

      <div className="colors-display">
        {colorsDisplayArray}
        <button ref={deleteRef}>Remove</button>
      </div>
      <div className="changer">
        <input type="color" ref={selectorRef} onChange={changeInputColor} />
        <button ref={addRef} onClick={clickAddButton}>Add</button>
        <button onClick={changeSelectedColorHex}>Change</button>
      </div>
    </div>
  );
}

export default Colors;