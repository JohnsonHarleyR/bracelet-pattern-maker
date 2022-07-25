import React, { useContext, useEffect, useRef, useState } from 'react';
import '../resources/styling/stage.css';
import { MakerContext } from '../../../MakerContext';
import {
  calculateCanvasHeight,
  calculateCanvasWidth,
  calculateNumberOfBackgroundImages,
  calculateNumberOfStrandImages,
  calculateNumberOfStrandImagesAfterSetup
} from '../resources/logic/calculationLogic';
import { renderBackground, renderCircleFill, renderNodes, renderPattern, renderStrands, renderTest } from '../resources/logic/drawLogic';
import { getNodeFromMouseClick, getStartStrandIndexFromMouseClick } from '../resources/logic/nodeLogic';
import { ClickType, NodeDefaults } from '../resources/constants/nodeConstants';
import { calculatePatternLength, calculatePatternThickness, createPatternFromNodes } from '../resources/logic/patternLogic';
import { renderAll } from '../resources/logic/renderLogicV2';

const Stage = () => {

  const canvasRef = useRef();
  const patternCanvasRef = useRef();
  //TODO move add and remove buttons to own component
  const rowsAreaRef = useRef();
  const addButtonRef = useRef();
  const removeButtonRef = useRef();

  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const {
    isSetupDecided,
    nodesAcross,
    rowCount, setRowCount,
    startStrandInfos, setStartStrandInfos,
    selectedColor,
    nodes, setNodes,
    colors,
    pattern, setPattern,
  } = useContext(MakerContext);

  const [isBgLoaded, setIsBgLoaded] = useState(false);
  //console.log(`calculate # of bg images`);
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
    if (isSetupDecided) {
      loadedBgImageCount = 0;
      loadedStrandImageCount = 0;
      //console.log(`calculate # of bg images`);
      setTotalBgImages(calculateNumberOfBackgroundImages(nodesAcross, NodeDefaults.ROWS_AFTER_SETUP));
      setTotalStrandImages(calculateNumberOfStrandImagesAfterSetup(nodesAcross, NodeDefaults.ROWS_AFTER_SETUP));
      setBgLoadCount(0);
      setStrandLoadCount(0);
      setIsBgLoaded(false);
      setAreStrandsLoaded(false);

      
      patternCanvasRef.current.width = canvasRef.current.width;
      // patternCanvasRef.current.width = calculatePatternLength();
      patternCanvasRef.current.height = calculatePatternThickness(nodes);

      rowsAreaRef.current.style.display = "block";
    } else {
      rowsAreaRef.current.style.display = "none";
    }
  }, [isSetupDecided]);

  useEffect(() => {
    console.log(`isBgLoaded: ${isBgLoaded}`);
    // if (isSetupDecided && !isBgLoaded) {
    //   console.log(`rendering bg`);
    //   renderBackground(canvasRef.current, nodesAcross, rowCount, clearBgLoadCount, addToBgLoadCount);
    // } else 
    if (
      // isSetupDecided &&
      isBgLoaded) {
      console.log('rendering strands');
      renderStrands(canvasRef.current, nodes, rowCount, isSetupDecided, clearStrandLoadCount, addToStrandLoadCount);
    }

  },[isBgLoaded]);

  useEffect(() => {
    if (nodesAcross) {
      setCanvasWidth(calculateCanvasWidth(nodesAcross));
      //console.log(`calculate # of bg images`);
      setTotalBgImages(calculateNumberOfBackgroundImages(nodesAcross, rowCount));
      if (!isSetupDecided) {
        setTotalStrandImages(calculateNumberOfStrandImages(nodesAcross, rowCount));
      } else {
        setTotalStrandImages(calculateNumberOfStrandImagesAfterSetup(nodesAcross, NodeDefaults.ROWS_AFTER_SETUP));
      }

    }
  }, [nodesAcross]);

  useEffect(() => {
    if (rowCount) {
      setCanvasHeight(calculateCanvasHeight(rowCount));
      //console.log(`calculate # of bg images`);
      setTotalBgImages(calculateNumberOfBackgroundImages(nodesAcross, rowCount));
      if (!isSetupDecided) {
        setTotalStrandImages(calculateNumberOfStrandImages(nodesAcross, rowCount));
      } else {
        setTotalStrandImages(calculateNumberOfStrandImagesAfterSetup(nodesAcross, NodeDefaults.ROWS_AFTER_SETUP));
      }

      if (canRemoveRows()) {
        removeButtonRef.current.disabled = false;
      } else {
        removeButtonRef.current.disabled = true;
      }
    }
  }, [rowCount]);

  useEffect(() => {
    //console.log(`bgLoadCount: ${bgLoadCount}`);
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
        //console.log(`strand images loaded: ${strandLoadCount}/${totalStrandImages}`);
      }
    } else {
      //console.log(`strand images loaded: ${strandLoadCount}/${totalStrandImages}`);
      // setAreStrandsLoaded(false);
    }
  }, [strandLoadCount]);

  // useEffect(() => {
  //   console.log(`isBgLoaded: ${isBgLoaded}`);
  //   if (!isSetupDecided && isBgLoaded) {
  //     //renderStartStrandRow(canvasRef.current, startStrandInfos, rowCount, clearStrandLoadCount, addToStrandLoadCount);
  //     renderStrands(canvasRef.current, nodes, rowCount, isSetupDecided, clearStrandLoadCount, addToStrandLoadCount);
  //   }
  // }, [isBgLoaded]);

  useEffect(() => {
    if (areStrandsLoaded) {
      renderNodes(canvasRef.current, nodes);
    }
  }, [areStrandsLoaded]);

  useEffect(() => {
    if (colors) {
      if (!isSetupDecided) {
        startRenderBg();
      }
      else {
        // also the pattern
        setPattern(createPatternFromNodes(nodes));
      }

      if (isBgLoaded) {
        console.log('rendering strands');

        renderStrands(canvasRef.current, nodes, rowCount, isSetupDecided, clearStrandLoadCount, addToStrandLoadCount);
      }
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
        console.log(`rendering bg`);
        startRenderBg();
        //renderBackground(canvasRef.current, nodesAcross, rowCount, clearBgLoadCount, addToBgLoadCount);
      }
      if (isBgLoaded) {
        //renderStartStrandRow(canvasRef.current, startStrandInfos, rowCount, clearStrandLoadCount, addToStrandLoadCount);
        console.log('rendering strands');
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

      if (isSetupDecided) {
        //console.log(`calculate # of bg images`);
        setTotalBgImages(calculateNumberOfBackgroundImages(nodesAcross, rowCount));
        setTotalStrandImages(calculateNumberOfStrandImagesAfterSetup(nodesAcross, NodeDefaults.ROWS_AFTER_SETUP));

        // test render all
        renderAll(canvasRef.current, nodes, true);
      }
      
      if (canvasWidth) {
        console.log(`rendering bg`);
        startRenderBg();
        //renderBackground(canvasRef.current, nodesAcross, rowCount, clearBgLoadCount, addToBgLoadCount);
      }
      if (isBgLoaded) {
        //renderStartStrandRow(canvasRef.current, startStrandInfos, rowCount, clearStrandLoadCount, addToStrandLoadCount);
        console.log('rendering strands');
        renderStrands(canvasRef.current, nodes, rowCount, isSetupDecided, clearStrandLoadCount, addToStrandLoadCount);
      }

      if (areStrandsLoaded) {
        renderNodes(canvasRef.current, nodes);
      }
    }
  }, [canvasHeight]);

  useEffect(() => {
    if (pattern && isSetupDecided) {
      renderPattern(patternCanvasRef.current, pattern);
    }
  }, [pattern]);

  //#endregion

  //#region normal methods

  const canRemoveRows = () => {
    if (rowCount > NodeDefaults.MIN_ROWS) {
      return true;
    }
    return false;
  }

  const startRenderBg = () => {
    clearBgLoadCount();
    renderBackground(canvasRef.current, nodesAcross, rowCount, clearBgLoadCount, addToBgLoadCount);
  }

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
    //console.log(`loaded bg images: ${loadedBgImageCount}/${totalBgImages}`);
    //console.log(`adding to loaded count: ${loadedBgImageCount}`);
    if (loadedBgImageCount >= totalBgImages) {
      console.log('done Loading');
      setBgLoadCount(loadedBgImageCount);
      loadedBgImageCount = 0;
    }
  }

  const addToStrandLoadCount = () => {
    loadedStrandImageCount++;
    //console.log(`adding to loaded count: ${loadedBgImageCount}`);
    if (loadedStrandImageCount === totalStrandImages) {
      setStrandLoadCount(loadedStrandImageCount);
    }
  }

  const addRows = () => {
    setRowCount(rowCount + NodeDefaults.ROWS_AT_TIME);
  }

  const removeRows = () => {
    let newRowCount = rowCount - NodeDefaults.ROWS_AT_TIME;
    let copy = [...nodes];
    copy = copy.splice(0, newRowCount);
    setNodes(copy);
    setRowCount(newRowCount);
  }

  //#endregion

  //#region Event Methods

  const clickAddButton = () => {
    addRows();
  }

  const clickRemoveButton = () => {
    removeRows();
  }

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

  // const showMousePos = (evt) => {
  //   let pos = getMousePos(testCanvasRef.current, evt);
  //   console.log(pos);
  // }

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
      {!isSetupDecided
        ? <></>
        : <canvas className="pattern-canvas" ref={patternCanvasRef} />
      }
      <canvas ref={canvasRef} className="canvas-area"
        onClick={clickCanvas}
        onContextMenu={rightClickCanvas}/>
      <br></br>
      <div className="add-remove-buttons" ref={rowsAreaRef}>
        <button 
          ref={addButtonRef}
          className="button"
          onClick={clickAddButton}
        >
          Add
        </button>
        <button
          ref={removeButtonRef}
          className="button"
          onClick={clickRemoveButton}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default Stage;