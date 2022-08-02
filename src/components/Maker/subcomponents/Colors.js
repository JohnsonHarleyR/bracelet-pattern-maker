import React, { useContext, useEffect, useRef, useState } from 'react';
import { MakerContext } from '../../../MakerContext';
import { addNewColorReturnSuccess, alterColorHex, doesSelectedColorExist, getSelectedColor, removeColorReturnSuccess } from '../resources/logic/controlLogic';
import '../resources/styling/colors.css';
import ColorSquare from './ColorSquare';
import ColorPresets from './ColorPresets';

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
  const [showPresets, setShowPresets] = useState(false);
  const [presetToggleText, setPresetToggleText] = useState('');

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
    }
  }, [selectedColor]);

  useEffect(() => {
    if (colors) {
      let newSelected = doesSelectedColorExist(colors)
        ? getSelectedColor(colors)
        : { letter: colors[0].letter, color: colors[0].color};
      setSelectedColor(newSelected);
      setColorsDisplayArray(createColorsDisplay());
    }
  }, [colors]);

  useEffect(() => {
    if (inputColor && inputColor !== selectorRef.current.value) {
      selectorRef.current.value=inputColor;
    }
  }, [inputColor]);

  useEffect(() => {
    if (showPresets) {
      setPresetToggleText('^');
    } else {
      setPresetToggleText('v');
    }
  }, [showPresets]);

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

  const removeColor = () => {
    let colorsCopy = [...colors];
    let success = removeColorReturnSuccess(selectedColor.letter, colorsCopy);
    if (!success) {
      alert(`Could not remove color. Must have at least one.`);
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

  const clickRemoveButton = () => {
    removeColor();
  }

  const clickTogglePresets = () => {
    if (showPresets) {
      setShowPresets(false);
    } else {
      setShowPresets(true);
    }
  }

  //#endregion

  return (
    <div className="colors-area">

      <div className="colors-display">
        {colorsDisplayArray}
        <button
          className='btn setup-item'
          ref={deleteRef}
          onClick={clickRemoveButton}>
            Remove
        </button>
      </div>
      <div className="changer">
        <div className='preset-toggle' onClick={clickTogglePresets}>{presetToggleText}</div>
        <input
          type="color"
          ref={selectorRef}
          onChange={changeInputColor}
          className="setup-item"
        />
        <button
          className='btn setup-item'
          ref={addRef}
          onClick={clickAddButton}
        >
          Add
        </button>
        <button
        className='btn setup-item'
          onClick={changeSelectedColorHex}
        >
          Change
        </button>
      </div>
      <div>
        <ColorPresets
          showPresets={showPresets}
          setInputColor={setInputColor}
        />
      </div>
    </div>
  );
}

export default Colors;