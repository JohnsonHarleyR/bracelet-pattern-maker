import React, { useContext, useEffect, useRef, useState } from 'react';
import '../resources/styling/stage.css';
import { MakerContext } from '../../../MakerContext';
import {
  calculateCanvasHeight,
  calculateCanvasWidth,
  calculateNumberOfBackgroundImages
} from '../resources/logic/calculationLogic';
import { renderBackground, renderCircleFill, renderStartStrandRow } from '../resources/logic/drawLogic';

const Stage = () => {

  const canvasRef = useRef();
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const {
    nodesAcross,
    rowCount,
    startStrandInfos,
  } = useContext(MakerContext);

  const [totalBgImages, setTotalBgImages] = useState(calculateNumberOfBackgroundImages(nodesAcross, rowCount));
  let loadedBgImageCount = 0;
  const [bgLoadCount, setBgLoadCount] = useState(0);

  // TODO implement the next two constants
  const [totalStrandImages, setTotalStrandImages] = useState(0);
  let loadedStrandImageCount = 0;
  const [strandLoadCount, setStrandLoadCount] = useState(0);

  //#region Effect Area

  useEffect(() => {
    if (nodesAcross) {
      setCanvasWidth(calculateCanvasWidth(nodesAcross));
      setTotalBgImages(calculateNumberOfBackgroundImages(nodesAcross, rowCount));
    }
  }, [nodesAcross]);

  useEffect(() => {
    if (rowCount) {
      setCanvasHeight(calculateCanvasHeight(rowCount));
      setTotalBgImages(calculateNumberOfBackgroundImages(nodesAcross, rowCount));
    }
  }, [rowCount]);

  useEffect(() => {
    if (bgLoadCount && bgLoadCount !== 0) {
      //console.log(`loaded: ${bgLoadCount}/${totalBgImages}`);
      if (bgLoadCount === totalBgImages) {
        // RENDER STRAND IMAGES
        renderStartStrandRow(canvasRef.current, startStrandInfos, rowCount, clearStrandLoadCount, addToStrandLoadCount);
        renderCircleFill(canvasRef.current, "#ffff00", 5, 5);
      }
    }
  }, [bgLoadCount]);

  useEffect(() => {
    if (startStrandInfos) {
      renderBackground(canvasRef.current, nodesAcross, rowCount, clearBgLoadCount, addToBgLoadCount);
    }
  }, [startStrandInfos]);

  useEffect(() => {
    if (canvasWidth) {
      canvasRef.current.width = canvasWidth;
      
      if (canvasHeight) {
        renderBackground(canvasRef.current, nodesAcross, rowCount, clearBgLoadCount, addToBgLoadCount);
      }
    }
  }, [canvasWidth]);

  useEffect(() => {
    if (canvasHeight) {
      canvasRef.current.height = canvasHeight;
      
      if (canvasWidth) {
        renderBackground(canvasRef.current, nodesAcross, rowCount, clearBgLoadCount, addToBgLoadCount);
      }
    }
  }, [canvasHeight]);

  //#endregion

  //#region normal methods

  const clearBgLoadCount = () => {
    //console.log(`clearing loaded image count.`);
    loadedBgImageCount = 0;
    setBgLoadCount(0);
  }

  const clearStrandLoadCount = () => {
    //console.log(`clearing loaded image count.`);
    loadedStrandImageCount = 0;
    setStrandLoadCount(0);
  }

  const addToBgLoadCount = () => {
    loadedBgImageCount++;
    //console.log(`adding to loaded count: ${loadedBgImageCount}`);
    if (loadedBgImageCount === totalBgImages) {
      setBgLoadCount(loadedBgImageCount);
    }
  }

  const addToStrandLoadCount = () => {
    loadedStrandImageCount++;
    //console.log(`adding to loaded count: ${loadedBgImageCount}`);
    if (loadedStrandImageCount === totalStrandImages) {
      setStrandLoadCount(loadedStrandImageCount);
    }
  }

  //#endregion

  return (
    <div>
      <canvas ref={canvasRef} className="canvas-area" />
      <br></br>
      test
    </div>
  );
}

export default Stage;