import { useContext, useEffect, useRef, useState } from 'react';
import '../resources/styling/modal.css';
import { MakerContext } from '../../../MakerContext';
import { createPageContentArray, findNavIndex, getNavItems, getPageContent, isNavPage } from '../resources/logic/modalLogic';
import { loadPatternText } from '../resources/logic/decoderLogic';


const StartModal = ({showModal, setShowModal}) => {


  //#region Enums

  const PageType = {
    WELCOME: 'WELCOME',
    LOAD: 'LOAD',
  }

  //#endregion

  const modalRef = useRef();
  const loadInputRef = useRef();
  const errorMsgRef = useRef();

  const [pageType, setPageType] = useState(PageType.WELCOME);

  const [title, setTitle] = useState('Title');
  const [description, setDescription] = useState(<></>);
  const [pageContent, setPageContent] = useState(<></>);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Error message here");

  //#region Effects

  useEffect(() => {
    if (showModal) {
      modalRef.current.style.display = "flex";
    } else {
      modalRef.current.style.display = "none";
    }
  }, [showModal]);

  useEffect(() => {
    if (pageType === PageType.LOAD) {
      if (showError) {
        errorMsgRef.current.innerText = errorMessage;
        errorMsgRef.current.className = '';
      } else {
        errorMsgRef.current.className = 'hide-error';
      }
    }
  }, [showError, errorMessage]);

  useEffect(() => {
    if (pageType) {
      //console.log('page type changed');
      populatePage();
    }
  }, [pageType]);

  //#endregion

  //#region Normal Methods

  const populatePage = () => {
    let content = {title: 'no title', description: 'no description', body: 'no body'};
    switch (pageType) {
      default:
        break;
      case PageType.WELCOME:
        content = createWelcomeContent();
        break;
      case PageType.LOAD:
        content = createLoadContent();
    }

    setTitle(content.title);
    setDescription(content.description);
    setPageContent(content.body);
  }

  const createWelcomeContent = () => {
    let content = {};
    content.title = "Welcome!";
    content.description = <span>To get started, please choose whether to load an existing pattern or start from scratch. (If this is your first time, we recommend the 'Create' option.)</span>
    content.body = 
      <div className="btn-options-div">
        <button className='starting-btn' onClick={clickCreateOptionBtn}>Create</button>
        <button className='starting-btn' onClick={clickLoadOptionBtn}>Load</button>
      </div>
    ;
    return content;
  }

  const createLoadContent = () => {
    let content = {};
    content.title = "Load a Pattern";
    content.description = <>
      <div className='go-back-link' onClick={clickBackBtn}><span className='ignore-to-center'>←</span>Go Back</div>
      If you saved the code after creating a pattern (via the "Show Code" option by clicking the "Copy Everything" button), it can be pasted here in order to load that pattern again!
      {/* <br></br>
      <br></br>
      The first line should be hex value values separated by spaces. The second should be the strand letter order. The final lines should be knot directions.*/}
      </>
    let placeholder = 'ffffff 000000\nababab\nf,f,f\nf,f';
    content.body = 
      <>
        <textarea className='load-pattern-input' ref={loadInputRef} placeholder={placeholder} />
        <sup id="load-pattern-error" className='hide-error' ref={errorMsgRef}>{errorMessage}</sup>
        <button className='starting-btn' onClick={clickLoadPatternBtn}>Load Pattern</button>
      </>
    ;
    return content;
  }

  const closeModal = () => {
    setShowModal(false);
  }

  //#endregion

  //#region Event Handlers


  const clickCreateOptionBtn = () => {
    closeModal();
  }

  const clickLoadOptionBtn = () => {
    setPageType(PageType.LOAD);
  }


  const clickBackBtn = () => {
    setPageType(PageType.WELCOME);
  }

  const clickLoadPatternBtn = () => {
    let text = loadInputRef.current.value;
    let result = loadPatternText(text);

    setErrorMessage(result.error);
    setShowError(!result.isSuccessful);

    if (result.isSuccessful) {
      console.log(`result content: `, result.content);

      closeModal();
    }

  };

  //#endregion

  return (
    <div ref={modalRef} className='modal-container'>
      <div className='modal start-modal'>
        <div className="modal-header">
          <span className='title start-title'>{title}</span>
          <div className='description'>{description}</div>
        </div>
        <div className="modal-body start-body">
          {pageContent}
        </div>
      </div>
      
    </div>
  );
}

export default StartModal;