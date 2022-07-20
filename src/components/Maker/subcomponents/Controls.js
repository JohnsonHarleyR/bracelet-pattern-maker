import React, { useContext, useEffect, useRef, useState } from 'react';
import { MakerContext } from '../../../MakerContext';
import { canCompleteSetup, createNewDefaultStrandInfosArray } from '../resources/logic/controlLogic';
import '../resources/styling/controls.css';
import Colors from './Colors';

const Controls = () => {

  const strandCountRef = useRef();
  const strandCountDivRef = useRef();
  const completeSetupRef = useRef();

  const {
    isSetupDecided, setIsSetupDecided,
    strandsAcross, setStrandsAcross,
    setNodesAcross,
    startStrandInfos, setStartStrandInfos,
    nodes,
    selectedColor,
    colors,
  } = useContext(MakerContext);

  const [canComplete, setCanComplete] = useState(false);

  //#region effects
  useEffect(() => {
    strandCountRef.current.value = strandsAcross;
  }, []);

  useEffect(() => {
    if (colors) {
      if (startStrandInfos !== undefined) {
        let newStrandInfos = createNewDefaultStrandInfosArray(strandsAcross, selectedColor, colors, startStrandInfos);
        console.log(`new strand infos: ${JSON.stringify(newStrandInfos)}`);
        setStartStrandInfos(newStrandInfos);
      }
    }
  }, [colors, strandsAcross]);

  useEffect(() => {
    if (isSetupDecided) {
      strandCountDivRef.current.style.display = "none";
      completeSetupRef.current.style.display = "none";
    } else {
      strandCountDivRef.current.style.display = "block";
      completeSetupRef.current.style.display = "block";
    }
  }, [isSetupDecided]);

  useEffect(() => {
    if (nodes) {
      setCanComplete(canCompleteSetup(nodes));
    }
  }, [nodes]);

  useEffect(() => {
    if (canComplete) {
      completeSetupRef.current.disabled = false;
    } else {
      completeSetupRef.current.disabled = true;
    }
  }, [canComplete]);
  //#endregion

  //#region normal methods

  const changeStrandCount = () => {
    let count = parseInt(strandCountRef.current.value);

    if (count < colors.length) {
      let dif = colors.length - count;
      strandCountRef.current.value = strandsAcross;
      alert(`Cannot have more colors than strands. Please remove ${dif} colors to decrease number of strands.`);
    } else {
      setStrandsAcross(count);
      setNodesAcross(count / 2);
    }
  }

  //#endregion

  //#region event methods

  const clickCompleteSetup = () => {
    setIsSetupDecided(true);
  }

  //#endregion

  return (
    <div className="controls">
      <div className="top-div">
        <div className="strand-count" ref={strandCountDivRef}>
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
      <div className="bottom-div">
        <button ref={completeSetupRef} onClick={clickCompleteSetup}>Complete Setup</button>
      </div>
    </div>
  );
}

export default Controls;