import React, {useState, createContext, useEffect} from 'react';
import { NodeDefaults } from './components/Maker/resources/constants/nodeConstants';
import { createAllNodesAfterSetup, createFirstRowOfNodes, updateNodeStrands } from './components/Maker/resources/logic/nodeLogic';
import { isMobile } from 'react-device-detect';

const MakerContext = createContext({});

const MakerProvider = ({children}) => {

  const [deviceType, setDeviceType] = useState(isMobile === true ? "Mobile" : "Desktop");

  const [isSetupDecided, setIsSetupDecided] = useState(false);

  const [nodesAcross, setNodesAcross] = useState(3);
  const [strandsAcross, setStrandsAcross] = useState(6);
  const [rowCount, setRowCount] = useState(1);

  const [startStrandInfos, setStartStrandInfos] = useState([]);
  const [nodes, setNodes] = useState([]);

  const [pattern, setPattern] = useState([]);

  const [selectedColor, setSelectedColor] = useState({
    letter: "A",
    color: "#01e0c1"
  });
  const [colors, setColors] = useState([
    {
      letter: "A",
      color: "#01e0c1",
      isSelected: true
    },
    {
      letter: "B",
      color: "#f7f7f7",
      isSelected: false
    },
    {
      letter: "C",
      color: "#3463f1",
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
    if (isSetupDecided) {
      let newNodes = updateNodeStrands(nodes);
      setNodes(newNodes);
    }
  }, [startStrandInfos]);

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
          deviceType, setDeviceType,
          isSetupDecided, setIsSetupDecided,
          nodesAcross, setNodesAcross,
          strandsAcross, setStrandsAcross,
          rowCount, setRowCount,
          startStrandInfos, setStartStrandInfos,
          nodes, setNodes,
          selectedColor, setSelectedColor,
          colors, setColors,
          pattern, setPattern,
        }}>
            {children}
        </MakerContext.Provider>
    );

}

export {MakerContext};
export default MakerProvider;