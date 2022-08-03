import { useContext, useEffect, useRef } from 'react';
import '../resources/styling/instructions.css';
import { MakerContext } from '../../../MakerContext';


const ModalPage = ({showModal, pages, index, setIndex, setShowModal}) => {

  const modalRef = useRef();
  const {deviceType} = useContext(MakerContext);

  useEffect(() => {
    if (showModal) {
      modalRef.current.style.display = "block";
    } else {
      modalRef.current.style.display = "none";
    }
  }, [showModal]);

  const closeModal = () => {
    console.log('click close modal');
    setShowModal(false);
    setIndex(0);
  }

  return (
    <div ref={modalRef} className='modal'>
      <div className="modal-header">
        <span className="close" onClick={closeModal}>&times;</span>
        <h2>Modal Header</h2>
      </div>
      <div className="modal-body">
        <p>Some text in the Modal Body</p>
        <p>Some other text...</p>
      </div>
      <div className="modal-footer">
        <h3>Modal Footer</h3>
      </div>
    </div>
  );
}

export default ModalPage;