import React, { useContext, useEffect, useRef, useState } from 'react';
import { MakerContext } from '../../../MakerContext';
import '../resources/styling/controls.css';
import Colors from './Colors';

const Controls = () => {

  const strandCountRef = useRef();

  const {
    strandsAcross, setStrandsAcross,
    setNodesAcross,
  } = useContext(MakerContext);

  //#region effects
  useEffect(() => {
    strandCountRef.current.value = strandsAcross;
  }, []);
  //#endregion

  //#region methods

  const changeStrandCount = () => {
    let count = parseInt(strandCountRef.current.value);
    setStrandsAcross(count);
    setNodesAcross(count / 2);
  }

  //#endregion

  return (
    <div className="controls">
      <div className="strand-count">
        Strands: 
        <select ref={strandCountRef} onChange={changeStrandCount}>
          <option value={4}>4</option>
          <option value={6}>6</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
          <option value={12}>12</option>
        </select>
      </div>
      <Colors />
    </div>
  );
}

export default Controls;