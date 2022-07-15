import React, { useEffect, useRef } from 'react';
import '../resources/styling/stage.css';

const Stage = () => {

  const canvasRef = useRef();

  useEffect(() => {

  }, []);

  return (
    <div>
      <canvas ref={canvasRef} className="canvas-area" />
      <br></br>
      test
    </div>
  );
}

export default Stage;