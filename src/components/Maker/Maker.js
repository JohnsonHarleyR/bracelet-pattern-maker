import React from 'react';
import './resources/styling/maker.css';
import Stage from './subcomponents/Stage';
import Controls from './subcomponents/Controls';
import Instructions from './subcomponents/Instructions';
import { MainInstructionItems } from './resources/constants/instructionConstants';

const Maker = () => {

  return (
    <div>
      <h1>Bracelet Designer</h1>
      <Instructions
        linkText={"Instructions"}
        pages={MainInstructionItems}
      />
      <Controls />
      <br></br>
      <Stage />
    </div>
  );
}

export default Maker;