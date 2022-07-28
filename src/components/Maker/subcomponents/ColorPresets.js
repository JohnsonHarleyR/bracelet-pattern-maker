import { useEffect, useRef, useState } from "react";
import '../resources/styling/color-presets.css';
import { PresetHexValues } from "../resources/constants/designConstants";
import PresetSquare from "./PresetSquare";

const ColorPresets = ({showPresets, setInputColor}) => {

  const containerRef = useRef();

  const [displayColors, setDisplayColors] = useState([]);

  useEffect(() => {
    setDisplayColors(createDisplayColors);
  }, []);

  useEffect(() => {
    if (!showPresets) {
      containerRef.current.style.display = "none";
    } else {
      containerRef.current.style.display = "flex";
    }
  }, [showPresets]);

  const createDisplayColors = () => {
    let array = [];

    PresetHexValues.forEach((col, y) => {
      let subArray = [];
      col.forEach((hex, x) => {
        subArray.push(
          <PresetSquare
            key={`${y}-${x}`}
            color={hex}
            setInputColor={setInputColor}
          />
        );
      });
      array.push(
        <div key={`col-${y}`} className="col">
          {subArray}
        </div>
      );
    });

    return array;
  }


  return (
    <div className="container" ref={containerRef}>
      {displayColors}
    </div>
  )

}

export default ColorPresets;