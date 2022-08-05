import { useContext, useEffect, useRef, useState } from 'react';
import '../resources/styling/modal.css';
import { MakerContext } from '../../../MakerContext';
import { generateHexCodes, generateNodesCodeArray, generateStrandLetterString } from '../resources/logic/coderLogic';


const PatternCoder = ({showCode, setShowCode}) => {

  const modalRef = useRef();
  const strandStringRef = useRef();
  const nodesStringRef = useRef();

  const {colors, startStrandInfos, nodes} = useContext(MakerContext);
  
  const [hexCodes, setHexCodes] = useState(generateHexCodes(colors));
  const [strandString, setStrandString] = useState(generateStrandLetterString(startStrandInfos));
  const [nodesCode, setNodesCode] = useState(generateNodesCodeArray(nodes));

  const [hexDisplay, setHexDisplay] = useState(<></>);
  const [nodeCodeDisplay, setNodeCodeDisplay] = useState(<></>);
  
  //#region Effects

  useEffect(() => {
    if (showCode) {
      modalRef.current.style.display = "flex";
    } else {
      modalRef.current.style.display = "none";
    }
  }, [showCode]);

  useEffect(() => {
    if (colors) {
      setHexCodes(generateHexCodes(colors));
    }
  }, [colors]);

  useEffect(() => {
    if (startStrandInfos) {
      setStrandString(generateStrandLetterString(startStrandInfos));
    }
  }, [startStrandInfos]);

  useEffect(() => {
    if (nodes) {
      setNodesCode(generateNodesCodeArray(nodes));
    }
  }, [nodes]);

  useEffect(() => {
    if (hexCodes) {
      setHexDisplay(generateHexDisplay());
    }
  }, [hexCodes]);

  useEffect(() => {
    if (nodesCode) {
      setNodeCodeDisplay(generateNodesCodeDisplay());
    }
  }, [nodesCode]);

  //#endregion

  //#region Normal Methods

  const generateHexDisplay = () => {
    let array = [];
    hexCodes.forEach((h, i) => {
      let toolTipId = `hex-tip-${i}`;
      array.push(
        <div key={`hexdiv${i}`} className="hex-item">
          <span key={`hex${i}`}><b>{h.letter}:</b> {h.hex}</span>
          <button
            key={`hex-btn${i}`}
            className="copy-btn"
            onClick={(evt) => {copyText(h.hex, evt, toolTipId)}}
          >Copy</button><span className='tool-tip' id={toolTipId}>Copied</span>
        </div>
      );
    });
    return array;
  }

  const generateNodesCodeDisplay = () => {
    let array = [];
    nodesCode.forEach((l, i) => {
      array.push(<span key={`nodeC${i}`}>{l}</span>);
      // if (i !== nodesCode.length - 1) {
      //   array.push(<br key={`nodeC-br${i}`}></br>);
      // }
    });
    return array;
  }

  const copyText = (text, e, toolTipId) => {
    navigator.clipboard.writeText(text);
    let toolTip = document.getElementById(toolTipId);
    toolTip.style.display = 'inline';
    setTimeout( function() {
      toolTip.style.display = "none";
  }, 1000);
    e.target.focus();
  }


  //#endregion

  //#region Event Handlers

  const closeModal = () => {
    setShowCode(false);
  }

  const copyStrandString = (evt) => {
    let text = strandStringRef.current.innerText;
    copyText(text, evt, 'strand-tip-id');
  }

  const copyNodesString = (evt) => {
    let text = nodesStringRef.current.innerText;
    copyText(text, evt, 'node-tip-id');
  }

  //#endregion

  return (
    <div ref={modalRef} className='modal-container'>
      <div className='modal coder'>
        <div className="modal-header coder">
          <span className="close" onClick={closeModal}>&times;</span>
          <div>
            <p>
            These codes are provided for anyone who wishes to submit a pattern onto braceletbook.com.
            </p>
            {/* <p className='permission'>
            Permission is granted as long as credit is provided in the notes so that more people may use this tool. Thank you!
            <br></br>
            ♥ Harlee ♥
            </p> */}
          </div>
        </div>
        <div className="modal-body coder">
          
          <div className='code-section'>
            <h4>Color Values</h4>
            <div className='hex-values'>
              {hexDisplay}
            </div>
          </div>
          <div className='code-section'>
            <h4>Strand Color Order</h4>
            <div className='strand-values'  ref={strandStringRef}>
            {strandString}
            </div>

            <div className='copy-btn-div'>
              <button
                className="copy-btn"
                onClick={copyStrandString}
              >
                Copy
              </button>
              <span className='tool-tip' id="strand-tip-id">Copied</span>
            </div>
          </div>

          <div className='code-section'>
            <h4>Knot Setup</h4>
            <div className='knot-values'  ref={nodesStringRef}>
              {nodeCodeDisplay}
            </div>
            <div className='copy-btn-div'>
              <button
                className="copy-btn"
                onClick={copyNodesString}
              >
                Copy
              </button>
              <span className='tool-tip' id="node-tip-id">Copied</span>
            </div>
          </div>
        </div>
        <div className='modal-footer coder'>
        <p className='permission'>
            Permission is granted as long as credit is provided in the notes so that more people may use this tool.
            <br></br>
            Thank you!
            </p>
            ♥ Harlee's Creation Tools ♥

        </div>
      </div>
      
    </div>
  );
}

export default PatternCoder;