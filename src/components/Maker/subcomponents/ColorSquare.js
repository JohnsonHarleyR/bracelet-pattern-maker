import React, { useContext, useEffect, useRef, useState } from 'react';
import { MakerContext } from '../../../MakerContext';
import { doesIdExist, getColorIndexById } from '../resources/logic/controlLogic';
import '../resources/styling/colors.css';

const ColorSquare = ({id}) => {

  const colorRef = useRef();

  const {colors, setColors} = useContext(MakerContext);

  const [index, setIndex] = useState(0);
  const [color, setColor] = useState(null);
  const [isSelected, setIsSelected] = useState(null);

  //#region effects

  useEffect(() => {
    if (index !== undefined && colors) {
      if (!doesIdExist(id, colors)) {
        return;
      }
      
      let ind = getColorIndexById(id, colors);
      if (ind !== index) {
        setIndex(ind);
      }
      if (colors[ind].color !== color) {
        setColor(colors[ind].color);
      }
      if (colors[ind].isSelected !== isSelected) {
        setIsSelected(colors[ind].isSelected);
      }
    }
  }, [index, colors]);

  useEffect(() => {
    if (color) {
      changeColor();
    }
  }, [color]);

  useEffect(() => {
    if (isSelected !== undefined && isSelected !== null) {
      changeClassName();
    }
  }, [isSelected]);

  //#endregion

  //#region normal methods

  const changeColor = () => {
    colorRef.current.style.background = color;
  }

  const changeClassName = () => {
    if (isSelected) {
      colorRef.current.className = "color-square select";
    } else {
      colorRef.current.className = "color-square";
    }
  }

  const selectColor = (id) => {
    let copy = [...colors];
    copy.forEach(c => {
      if (c.letter === id) {
        c.isSelected = true;
      } else {
        c.isSelected = false;
      }
    });
    setColors(copy);
  }

  //#endregion

  //#region event methods

  // TODO change mouse when hovering over square
  const clickColor = () => {
    console.log(`classname before: ${colorRef.current.className}`);
    selectColor(id);
    console.log(`color ${color} clicked (id=${id})`);
  }

  //#endregion

  return (
    <div className="color-square" ref={colorRef} onClick={clickColor}>
    </div>
  );
}

export default ColorSquare;