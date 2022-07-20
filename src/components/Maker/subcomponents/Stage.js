import React, { useContext, useEffect, useRef, useState } from 'react';
import '../resources/styling/stage.css';
import { MakerContext } from '../../../MakerContext';
import {
  calculateCanvasHeight,
  calculateCanvasWidth,
  calculateNumberOfBackgroundImages,
  calculateNumberOfStrandImages
} from '../resources/logic/calculationLogic';
import { renderBackground, renderCircleFill, renderNodes, renderStrands } from '../resources/logic/drawLogic';
import { getNodeFromMouseClick, getStartStrandIndexFromMouseClick } from '../resources/logic/nodeLogic';
import { ClickType } from '../resources/constants/nodeConstants';

const Stage = () => {

  const canvasRef = useRef();
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const {
    isSetupDecided,
    nodesAcross,
    rowCount,
    startStrandInfos, setStartStrandInfos,
    selectedColor,
    nodes, setNodes,
    colors,
  } = useContext(MakerContext);

  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const [totalBgImages, setTotalBgImages] = useState(calculateNumberOfBackgroundImages(nodesAcross, rowCount));
  let loadedBgImageCount = 0;
  const [bgLoadCount, setBgLoadCount] = useState(0);

  // TODO implement the next two constants
  const [areStrandsLoaded, setAreStrandsLoaded] = useState(false);
  const [totalStrandImages, setTotalStrandImages] = useState(calculateNumberOfStrandImages(nodesAcross, rowCount));
  let loadedStrandImageCount = 0;
  const [strandLoadCount, setStrandLoadCount] = useState(0);

  //#region Effect Area

  useEffect(() => {
    if (nodesAcross) {
      setCanvasWidth(calculateCanvasWidth(nodesAcross));
      setTotalBgImages(calculateNumberOfBackgroundImages(nodesAcross, rowCount));
      setTotalStrandImages(calculateNumberOfStrandImages(nodesAcross, rowCount));
    }
  }, [nodesAcross]);

  useEffect(() => {
    if (rowCount) {
      setCanvasHeight(calculateCanvasHeight(rowCount));
      setTotalBgImages(calculateNumberOfBackgroundImages(nodesAcross, rowCount));
      setTotalStrandImages(calculateNumberOfStrandImages(nodesAcross, rowCount));
    }
  }, [rowCount]);

  useEffect(() => {
    if (bgLoadCount && bgLoadCount !== 0) {
      //console.log(`loaded: ${bgLoadCount}/${totalBgImages}`);
      if (bgLoadCount === totalBgImages) {
        setIsBgLoaded(true);
        console.log(`bg images loaded`);
      }
    }
  }, [bgLoadCount]);

  useEffect(() => {
    if (strandLoadCount && strandLoadCount !== 0) {
      //console.log(`loaded: ${bgLoadCount}/${totalBgImages}`);
      if (strandLoadCount === totalStrandImages) {
        setAreStrandsLoaded(true);
        console.log(`strand images loaded`);
      }
    } else {
      setAreStrandsLoaded(false);
    }
  }, [strandLoadCount]);

  useEffect(() => {
    if (isBgLoaded) {
      //renderStartStrandRow(canvasRef.current, startStrandInfos, rowCount, clearStrandLoadCount, addToStrandLoadCount);
      renderStrands(canvasRef.current, nodes, rowCount, isSetupDecided, clearStrandLoadCount, addToStrandLoadCount);
    }
  }, [isBgLoaded]);

  useEffect(() => {
    if (areStrandsLoaded) {
      renderNodes(canvasRef.current, nodes);
    }
  }, [areStrandsLoaded]);

  useEffect(() => {
    if (colors) {
      if (!isSetupDecided) {
      renderBackground(canvasRef.current, nodesAcross, rowCount, clearBgLoadCount, addToBgLoadCount);

      }
      renderStrands(canvasRef.current, nodes, rowCount, isSetupDecided, clearStrandLoadCount, addToStrandLoadCount);
      // renderNodes(canvasRef.current, nodes);
      if (areStrandsLoaded) {
        renderNodes(canvasRef.current, nodes);
      }
    }
  }, [colors, nodes]);

  useEffect(() => {
    if (canvasWidth) {
      canvasRef.current.width = canvasWidth;
      
      if (canvasHeight) {
        renderBackground(canvasRef.current, nodesAcross, rowCount, clearBgLoadCount, addToBgLoadCount);
      }
      if (isBgLoaded) {
        //renderStartStrandRow(canvasRef.current, startStrandInfos, rowCount, clearStrandLoadCount, addToStrandLoadCount);
        renderStrands(canvasRef.current, nodes, rowCount, isSetupDecided, clearStrandLoadCount, addToStrandLoadCount);
      }

      if (areStrandsLoaded) {
        renderNodes(canvasRef.current, nodes);
      }
    }
  }, [canvasWidth]);

  useEffect(() => {
    if (canvasHeight) {
      canvasRef.current.height = canvasHeight;
      
      if (canvasWidth) {
        renderBackground(canvasRef.current, nodesAcross, rowCount, clearBgLoadCount, addToBgLoadCount);
      }
      if (isBgLoaded) {
        //renderStartStrandRow(canvasRef.current, startStrandInfos, rowCount, clearStrandLoadCount, addToStrandLoadCount);
        renderStrands(canvasRef.current, nodes, rowCount, isSetupDecided, clearStrandLoadCount, addToStrandLoadCount);
      }

      if (areStrandsLoaded) {
        renderNodes(canvasRef.current, nodes);
      }
    }
  }, [canvasHeight]);

  //#endregion

  //#region normal methods

  const clearBgLoadCount = () => {
    //console.log(`clearing loaded image count.`);
    loadedBgImageCount = 0;
    setBgLoadCount(0);
    //setIsBgLoaded(false);
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

  //#region Event Methods

  const rightClickCanvas = (evt) => {
    evt.preventDefault();
    clickCanvas(evt, true);
  }

  const clickCanvas = (evt, isRightClick = false) => {
    let mousePos = getMousePos(canvasRef.current, evt);
    console.log(`Mouse pos: {x: ${Math.round(mousePos.x)}, y: ${Math.round(mousePos.y)}}`);

    // do different checks depending on whether setup is complete or not
    let nodesCopy = [...nodes];
    let nodeClicked = getNodeFromMouseClick(mousePos, nodesCopy);

    if (nodeClicked === null) {
      if (!isSetupDecided) {
        // see if they clicked a start strand
        let strandIndex = getStartStrandIndexFromMouseClick(mousePos, startStrandInfos);
        if (strandIndex !== null) {
          let copy = [...startStrandInfos];
          copy[strandIndex].letter = selectedColor.letter;
          copy[strandIndex].color = selectedColor.color;
          setStartStrandInfos(copy);
        }
      }
    } else {
      console.log(`node clicked`);
      if (isRightClick) {
        nodeClicked.clickNode(ClickType.RIGHT);
      } else {
        nodeClicked.clickNode(ClickType.LEFT);
      }
      setNodes(nodesCopy);
    }

  }

  const getMousePos = (canvas, evt) => {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  //#endregion

  return (
    <div className="stage">
      <canvas ref={canvasRef} className="canvas-area"
        onClick={clickCanvas}
        onContextMenu={rightClickCanvas}/>
      <br></br>
      test
    </div>
  );
}

export default Stage;