import React from 'react';
import './resources/styling/maker.css';
import Stage from './subcomponents/Stage';
import Controls from './subcomponents/Controls';

const Maker = () => {

  return (
    <div>
      <Controls />
      <br></br>
      <Stage />
    </div>
  );
}

export default Maker;