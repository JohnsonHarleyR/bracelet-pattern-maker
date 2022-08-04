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

      array.push(
        <>
          <span key={`hex${i}`}>{h.letter}: {h.hex}</span>
          <button key={`hex-btn${i}`} onClick={(evt) => {copyText(h.hex, evt)}}>Copy</button>
        </>
      );

      if ((i + 1) % 2 === 0) {
        array.push(<br key={`hex-br${i}`}></br>);
      }
    });
    return array;
  }

  const generateNodesCodeDisplay = () => {
    let array = [];
    nodesCode.forEach((l, i) => {
      array.push(<span key={`nodeC${i}`}>{l}</span>);
      if (i !== nodesCode.length - 1) {
        array.push(<br key={`nodeC-br${i}`}></br>);
      }
    });
    return array;
  }

  const copyText = (text, e) => {
    navigator.clipboard.writeText(text);

    e.target.focus();
  }


  //#endregion

  //#region Event Handlers

  const closeModal = () => {
    setShowCode(false);
  }

  const copyStrandString = (evt) => {
    let text = strandStringRef.current.innerText;
    copyText(text, evt);
  }

  const copyNodesString = (evt) => {
    let text = nodesStringRef.current.innerText;
    copyText(text, evt);
  }

  //#endregion

  return (
    <div ref={modalRef} className='modal-container'>
      <div className='modal'>
        <div className="modal-header">
          <span className="close" onClick={closeModal}>&times;</span>
        </div>
        <div className="modal-body">
          <div>
            {hexDisplay}
          </div>
          <div ref={strandStringRef}>
            {strandString}
          </div>
          <button onClick={copyStrandString}>Copy</button>
          <div ref={nodesStringRef}>
            {nodeCodeDisplay}
          </div>
          <button onClick={copyNodesString}>Copy</button>
        </div>
      </div>
      
    </div>
  );
}

export default PatternCoder;