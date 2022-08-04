import { useContext, useEffect, useRef, useState } from 'react';
import '../resources/styling/modal.css';
import { MakerContext } from '../../../MakerContext';


const PatternCoder = ({showCode, setShowCode}) => {

  const modalRef = useRef();

  const {colors, startStrandInfos, nodes} = useContext(MakerContext);
  //#region Effects

  useEffect(() => {
    if (showCode) {
      modalRef.current.style.display = "flex";
    } else {
      modalRef.current.style.display = "none";
    }
  }, [showCode]);

  //#endregion

  //#region Normal Methods


  //#endregion

  //#region Event Handlers

  const closeModal = () => {
    setShowCode(false);
  }

  //#endregion

  return (
    <div ref={modalRef} className='modal-container'>
      <div className='modal'>
        <div className="modal-header">
          <span className="close" onClick={closeModal}>&times;</span>
        </div>
        <div className="modal-body">
          <p>Some text in the Modal Body</p>
          <p>Some other text...</p>
        </div>
      </div>
      
    </div>
  );
}

export default PatternCoder;