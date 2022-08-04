import React, { useContext, useEffect, useRef, useState } from 'react';
import '../resources/styling/stage.css';
import { MakerContext } from '../../../MakerContext';
import {
  calculateCanvasHeight,
  calculateCanvasScale,
  calculateCanvasWidth,
  calculateNumberOfBackgroundImages,
  calculateNumberOfStrandImages,
  calculateNumberOfStrandImagesAfterSetup,
  countNodes,
  isCanvasScaledUp
} from '../resources/logic/calculationLogic';
import { renderBackground, renderCircleFill, renderNodes, renderPattern, renderStrands, renderTest } from '../resources/logic/drawLogic';
import { getNodeFromMouseClick, getStartStrandIndexFromMouseClick } from '../resources/logic/nodeLogic';
import { ClickType, NodeDefaults } from '../resources/constants/nodeConstants';
import { calculatePatternLength, calculatePatternThickness, createImageOfCanvas, createPatternFromNodes, doesPatternAlignCorrectly } from '../resources/logic/patternLogic';
import { renderAll } from '../resources/logic/renderLogicV2';
import { renderAllV2, renderEverything } from '../resources/logic/renderLogicV3';
import { StageDefaults } from '../resources/constants/stageConstants';
import PatternCoder from './PatternCoder';

const Stage = () => {

  const canvasRef = useRef();
  const canvasAreaRef = useRef();
  //TODO move add and remove buttons to own component
  const rowsAreaRef = useRef();
  const addButtonRef = useRef();
  const removeButtonRef = useRef();
  const alignRef = useRef();
  const saveBtnRef = useRef();
  const codeBtnRef = useRef();

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

  //const [bgRenderArray, setBgRenderArray] = useState([]);
  const [prevNodeCount, setPrevNodeCount] = useState(0);

  const [doesPatternAlign, setDoesPatternAlign] = useState(false);
  const [patternHeight, setPatternHeight] = useState(0);

  const [doScaleCanvas, setDoScaleCanvas] = useState(false);
  const [showPatternCode, setShowPatternCode] = useState(false);

  //#region Effect Area


  useEffect(() => {
    if (isSetupDecided) {
      alignRef.current.style.display = "flex";

      rowsAreaRef.current.style.display = "flex";
      saveBtnRef.current.style.display = "block";
      codeBtnRef.current.style.display = "block";
    } else {
      alignRef.current.style.display = "none";

      rowsAreaRef.current.style.display = "none";
      saveBtnRef.current.style.display = "none";
      codeBtnRef.current.style.display = "none";
    }
  }, [isSetupDecided]);

  useEffect(() => {
    if (doScaleCanvas) {
      // double check
      canvasAreaRef.current.style.alignItems = "normal";
    } else {
      canvasAreaRef.current.style.alignItems = "center";
    }

  }, [doScaleCanvas]);


  useEffect(() => {
    console.log(`isBgLoaded: ${isBgLoaded}`);
    if (!isSetupDecided &&
      isBgLoaded) {
      console.log('rendering strands');
      renderStrands(canvasRef.current, nodes, rowCount, isSetupDecided, clearStrandLoadCount, addToStrandLoadCount);
    }

  },[isBgLoaded]);

  useEffect(() => {
    if (!isSetupDecided && nodesAcross) {

      setDoScaleCanvas(true); // start with it as true in order to determine whether to keep it that way

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
      if (!isSetupDecided) {
        
        //console.log(`calculate # of bg images`);
        setTotalBgImages(calculateNumberOfBackgroundImages(nodesAcross, rowCount));
        setTotalStrandImages(calculateNumberOfStrandImages(nodesAcross, rowCount));
        // if (!isSetupDecided) {
        //   setTotalStrandImages(calculateNumberOfStrandImages(nodesAcross, rowCount));
        // } else {
        //   setTotalStrandImages(calculateNumberOfStrandImagesAfterSetup(nodesAcross, NodeDefaults.ROWS_AFTER_SETUP));
        // }

        // determine whether or not to scale canvas or not

      } else {
        
        if (canRemoveRows()) {
          removeButtonRef.current.style.display = "flex";
        } else {
          removeButtonRef.current.style.display = "none";
        }
      }
    }
  }, [rowCount]);

  useEffect(() => {
    //console.log(`bgLoadCount: ${bgLoadCount}`);
    if (!isSetupDecided && bgLoadCount && bgLoadCount !== 0) {
      //console.log(`loaded: ${bgLoadCount}/${totalBgImages}`);
      if (bgLoadCount === totalBgImages) {
        setIsBgLoaded(true);
        console.log(`bg images loaded`);
      }
    }
  }, [bgLoadCount]);

  useEffect(() => {
    if (!isSetupDecided && strandLoadCount && strandLoadCount !== 0) {
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
    if (!isSetupDecided && areStrandsLoaded) {
      renderNodes(canvasRef.current, nodes);
    }
  }, [areStrandsLoaded]);

  useEffect(() => {
    if (colors) {
      console.log(`canvas width: ${canvasRef.current.width}`);
      console.log(`canvas height: ${canvasRef.current.height}`);
      let newNodeCount = nodes !== undefined
        ? countNodes(nodes)
        : 0;

      if (!isSetupDecided) {
        startRenderBg();
        if (nodes && nodes.length > 0) {
          setPatternHeight(calculatePatternThickness(nodes));
        }

      } else {
        // also the pattern
        setPattern(createPatternFromNodes(nodes));
        // test render all
        if (prevNodeCount !== newNodeCount) {
          renderEverything(canvasRef.current, nodes, patternHeight, isSetupDecided, true);
          //renderAll(canvasRef.current, nodes, patternHeight, true);
        } else {
          renderEverything(canvasRef.current, nodes, patternHeight, isSetupDecided, false);
          //renderAll(canvasRef.current, nodes, patternHeight, false);
        }
      }

      if (!isSetupDecided && isBgLoaded) {
        console.log('rendering strands');

        renderStrands(canvasRef.current, nodes, rowCount, isSetupDecided, clearStrandLoadCount, addToStrandLoadCount);
      }
      // renderNodes(canvasRef.current, nodes);
      if (!isSetupDecided && areStrandsLoaded) {
        renderNodes(canvasRef.current, nodes);
      }
      if (nodes !== undefined) {
        setPrevNodeCount(newNodeCount);

        if (isSetupDecided) {
          console.log(`checking alignment`);
          setDoesPatternAlign(doesPatternAlignCorrectly(nodes));
        }
      }
    }
  }, [colors, nodes]);

  useEffect(() => {
    if (canvasWidth) {
      canvasRef.current.width = canvasWidth;
      
      if (!isSetupDecided && canvasHeight) {

        // decide whether to scale the canvas or not
        setDoScaleCanvas(!isCanvasScaledUp(canvasRef.current));

        console.log(`rendering bg`);
        startRenderBg();
        //renderBackground(canvasRef.current, nodesAcross, rowCount, clearBgLoadCount, addToBgLoadCount);
      }
      if (!isSetupDecided && isBgLoaded) {
        //renderStartStrandRow(canvasRef.current, startStrandInfos, rowCount, clearStrandLoadCount, addToStrandLoadCount);
        console.log('rendering strands');
        renderStrands(canvasRef.current, nodes, rowCount, isSetupDecided, clearStrandLoadCount, addToStrandLoadCount);
      }

      if (!isSetupDecided && areStrandsLoaded) {
        renderNodes(canvasRef.current, nodes);
      }
    }
  }, [canvasWidth]);

  useEffect(() => {
    if (canvasHeight) {
      canvasRef.current.height = !isSetupDecided
        ? canvasHeight
        : StageDefaults.SHOW_COPYRIGHT
          ? canvasHeight + patternHeight + StageDefaults.CANVAS_END_EXTRA
          : canvasHeight + patternHeight;

      if (isSetupDecided) {
        //console.log(`calculate # of bg images`);
        //setTotalBgImages(calculateNumberOfBackgroundImages(nodesAcross, rowCount));
        //setTotalStrandImages(calculateNumberOfStrandImagesAfterSetup(nodesAcross, NodeDefaults.ROWS_AFTER_SETUP));

        // test render all
        renderEverything(canvasRef.current, nodes, patternHeight, isSetupDecided, true);
        //renderAll(canvasRef.current, nodes, patternHeight, true);
      }
      
      if (!isSetupDecided && canvasWidth) {
        console.log(`rendering bg`);
        startRenderBg();
        //renderBackground(canvasRef.current, nodesAcross, rowCount, clearBgLoadCount, addToBgLoadCount);
      }
      if (!isSetupDecided && isBgLoaded) {
        //renderStartStrandRow(canvasRef.current, startStrandInfos, rowCount, clearStrandLoadCount, addToStrandLoadCount);
        console.log('rendering strands');
        renderStrands(canvasRef.current, nodes, rowCount, isSetupDecided, clearStrandLoadCount, addToStrandLoadCount);
      }

      if (!isSetupDecided && areStrandsLoaded) {
        renderNodes(canvasRef.current, nodes);
      }
    }
  }, [canvasHeight]);

  useEffect(() => {
    if (pattern && isSetupDecided) {
      renderPattern(canvasRef.current, patternHeight, pattern);
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
    if (isSetupDecided) {
      mousePos.y -= patternHeight;
    }
    console.log(`Mouse pos: {x: ${Math.round(mousePos.x)}, y: ${Math.round(mousePos.y)}}`);

    // do different checks depending on whether setup is complete or not
    let nodesCopy = [...nodes];
    let nodeClicked = getNodeFromMouseClick(mousePos, nodesCopy);

    if (nodeClicked === null) {
      // see if they clicked a start strand
      let strandIndex = getStartStrandIndexFromMouseClick(mousePos, startStrandInfos);
      if (strandIndex !== null) {
        let copy = [...startStrandInfos];
        copy[strandIndex].letter = selectedColor.letter;
        copy[strandIndex].color = selectedColor.color;
        setStartStrandInfos(copy);
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

  const clickShowCode = () => {
    setShowPatternCode(true);
  }

  const clickSave = (evt) => {
    let newImage = createImageOfCanvas(canvasRef.current);
  }

  // const showMousePos = (evt) => {
  //   let pos = getMousePos(testCanvasRef.current, evt);
  //   console.log(pos);
  // }

  const getMousePos = (canvas, evt) => {
    var rect = canvas.getBoundingClientRect();
    let xScale =  canvas.width / rect.width;
    let yScale =  canvas.height / rect.height;
    return {
      x: (evt.clientX - rect.left) * xScale,
      y: (evt.clientY - rect.top) * yScale
    };
  }

  //#endregion

  return (
    <div className="stage">
      <div ref={canvasAreaRef} className="canvas-area">
        <canvas ref={canvasRef}
          onClick={clickCanvas}
          onContextMenu={rightClickCanvas}/>
      </div>

      <div className="does-align-message" ref={alignRef}>
        {doesPatternAlign === true
          ? <>Pattern aligns properly.</>
          : <>Strands at start and end of pattern do not yet align.</>
        }
      </div>
      
      <div className="add-remove-buttons" ref={rowsAreaRef}>
        <div
          ref={addButtonRef}
          className="circle-button"
          onClick={clickAddButton}
        >
          +
        </div>
        <div
          ref={removeButtonRef}
          className="circle-button"
          onClick={clickRemoveButton}
        >
          -
        </div>
      </div>
      <div className='bottom-btns-div'>
        <button className="get-image btn" ref={saveBtnRef} onClick={clickSave}>Get Image</button>
        <button className="get-image btn" ref={codeBtnRef} onClick={clickShowCode}>Show Code</button>
      </div>
        <PatternCoder
          showCode={showPatternCode}
          setShowCode={setShowPatternCode}
        />
    </div>
  );
}

export default Stage;