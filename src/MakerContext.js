import React, {useState, createContext, useEffect} from 'react';

const MakerContext = createContext({});

const MakerProvider = ({children}) => {

  const [isSetupDecided, setIsSetupDecided] = useState(false);

  const [nodesAcross, setNodesAcross] = useState(3);
  const [strandsAcross, setStrandsAcross] = useState(6);
  const [rowCount, setRowCount] = useState(1);

  const [strandInfos, setStrandInfos] = useState([]);

  const [selectedColor, setSelectedColor] = useState({
    letter: "A",
    color: "#ffffff"
  });
  const [colors, setColors] = useState([
    {
      letter: "A",
      color: "#ffffff",
      isSelected: true
    },
    {
      letter: "B",
      color: "#000000",
      isSelected: false
    },
  ]);


    return (
        <MakerContext.Provider value={{
          isSetupDecided, setIsSetupDecided,
          nodesAcross, setNodesAcross,
          strandsAcross, setStrandsAcross,
          rowCount, setRowCount,
          strandInfos, setStrandInfos,
          selectedColor, setSelectedColor,
          colors, setColors,
        }}>
            {children}
        </MakerContext.Provider>
    );

}

export {MakerContext};
export default MakerProvider;