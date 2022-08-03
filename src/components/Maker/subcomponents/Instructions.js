import { useState } from 'react';
import '../resources/styling/instructions.css';
import ModalPage from './ModalPage';

const Instructions = ({linkText, pages}) => {

  const [showModal, setShowModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

  const clickInstructionLink = () => {
    setShowModal(true);
  }

  return (
    <>
      <div className='instruction-div'>
        <span onClick={clickInstructionLink} className="instruction-link">{linkText}</span>
      </div>
      <>
        <ModalPage
          showModal={showModal}
          pages={pages}
          index={pageIndex}
          setIndex={setPageIndex}
          setShowModal={setShowModal}
        />
      </>
    </>

  );
}

export default Instructions;