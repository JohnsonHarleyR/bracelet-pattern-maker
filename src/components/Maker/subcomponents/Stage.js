import React, { useContext, useEffect, useRef, useState } from 'react';
import '../resources/styling/stage.css';
import { MakerContext } from '../../../MakerContext';
import {
  calculateCanvasHeight,
  calculateCanvasWidth,
  calculateNumberOfBackgroundImages
} from '../resources/logic/calculationLogic';
import { renderBackground, renderCircleFill } from '../resources/logic/drawLogic';

const Stage = () => {

  const canvasRef = useRef();
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const {
    nodesAcross,
    rowCount,
  } = useContext(MakerContext);
  const [totalBgImages, setTotalBgImages] = useState(calculateNumberOfBackgroundImages(nodesAcross, rowCount));
  let loadedBgImageCount = 0;
  const [bgLoadCount, setBgLoadCount] = useState(0);

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
      console.log(`loaded: ${bgLoadCount}/${totalBgImages}`);
      if (bgLoadCount === totalBgImages) {
        renderCircleFill(canvasRef.current, "#ffff00", 5, 5);
      }
    }
  }, [bgLoadCount]);

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

  const clearBgLoadCount = () => {
    console.log(`clearing loaded image count.`);
    loadedBgImageCount = 0;
    setBgLoadCount(0);
  }

  const addToBgLoadCount = () => {
    loadedBgImageCount++;
    console.log(`adding to loaded count: ${loadedBgImageCount}`);
    if (loadedBgImageCount === totalBgImages) {
      setBgLoadCount(loadedBgImageCount);
    }
  }

  return (
    <div>
      <canvas ref={canvasRef} className="canvas-area" />
      <br></br>
      test
    </div>
  );
}

export default Stage;