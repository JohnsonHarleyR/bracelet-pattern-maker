import React from 'react';
import './resources/styling/maker.css';
import Stage from './subcomponents/Stage';
import Controls from './subcomponents/Controls';

const Maker = () => {

  return (
    <div>
      <h1>Bracelet Designer</h1>
      <Controls />
      <br></br>
      <Stage />
    </div>
  );
}

export default Maker;