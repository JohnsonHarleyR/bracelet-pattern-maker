import React, {useState, createContext, useEffect} from 'react';
import { NodeDefaults } from './components/Maker/resources/constants/nodeConstants';
import { createAllNodesAfterSetup, createFirstRowOfNodes } from './components/Maker/resources/logic/nodeLogic';

const MakerContext = createContext({});

const MakerProvider = ({children}) => {

  const [isSetupDecided, setIsSetupDecided] = useState(false);

  const [nodesAcross, setNodesAcross] = useState(3);
  const [strandsAcross, setStrandsAcross] = useState(6);
  const [rowCount, setRowCount] = useState(1);

  const [startStrandInfos, setStartStrandInfos] = useState([]);
  const [nodes, setNodes] = useState([]);

  const [selectedColor, setSelectedColor] = useState({
    letter: "A",
    color: "#ff00ff"
  });
  const [colors, setColors] = useState([
    {
      letter: "A",
      color: "#ff00ff",
      isSelected: true
    },
    {
      letter: "B",
      color: "#000000",
      isSelected: false
    },
  ]);

  useEffect(() => {
    if (startStrandInfos && !isSetupDecided) {
      let n = nodes ? nodes : [];
      let firstRow = createFirstRowOfNodes(startStrandInfos, n);
      setNodes([firstRow]);
    }
  }, [nodesAcross, startStrandInfos]);

  useEffect(() => {
    if (isSetupDecided && rowCount > 1) {
      setNodes(createAllNodesAfterSetup(nodes, nodesAcross, rowCount));
    }
  }, [rowCount]);

  useEffect(() => {
    if (isSetupDecided) {
      setRowCount(NodeDefaults.ROWS_AFTER_SETUP);
    }
  }, [isSetupDecided]);


    return (
        <MakerContext.Provider value={{
          isSetupDecided, setIsSetupDecided,
          nodesAcross, setNodesAcross,
          strandsAcross, setStrandsAcross,
          rowCount, setRowCount,
          startStrandInfos, setStartStrandInfos,
          nodes, setNodes,
          selectedColor, setSelectedColor,
          colors, setColors,
        }}>
            {children}
        </MakerContext.Provider>
    );

}

export {MakerContext};
export default MakerProvider;