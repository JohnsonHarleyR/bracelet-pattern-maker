import React, { useEffect, useRef } from 'react';
import '../resources/styling/color-presets.css';

const PresetSquare = ({color, setInputColor}) => {

  const colorRef = useRef();

  //#region effects

  useEffect(() => {
    if (color) {
      changeColor();
    }
  }, [color]);

  //#endregion

  //#region normal methods

  const changeColor = () => {
    colorRef.current.style.background = color;
  }

  //#endregion

  //#region event methods

  const clickColor = () => {
    //console.log(`preset ${color}`);
    setInputColor(color);
  }

  //#endregion

  return (
    <div className="preset-square" ref={colorRef} onClick={clickColor}>
    </div>
  );
}

export default PresetSquare;