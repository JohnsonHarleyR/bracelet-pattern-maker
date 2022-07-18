import React, { useContext, useEffect, useState } from 'react';
import { MakerContext } from '../../../MakerContext';
import '../resources/styling/colors.css';
import ColorSquare from './ColorSquare';

const Colors = () => {

  const {
    colors, setColors,
    selectedColor, setSelectedColor,
  } = useContext(MakerContext);


  const [displayArray, setDisplayArray] = useState([]);

  useEffect(() => {
    if (colors) {
      console.log(`colors changed`);
      setDisplayArray(createColorsDisplay());
    }
  }, [colors]);

  useEffect(() => {
    if (displayArray) {
      console.log(`display changed`);
    }
  }, [displayArray]);

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

  return (
    <div className="colors-area">
      hi?
      {displayArray}
    </div>
  );
}

export default Colors;