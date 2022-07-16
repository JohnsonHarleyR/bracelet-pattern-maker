import React, {useState, createContext, useEffect} from 'react';

const MakerContext = createContext({});

const MakerProvider = ({children}) => {

  const [nodesAcross, setNodesAcross] = useState(4);
  const [strandsAcross, setStrandsAcross] = useState(0);
  const [rowCount, setRowCount] = useState(3);

  useEffect(() => {
    if (nodesAcross) {
      setStrandsAcross(nodesAcross * 2);
    }
  }, [nodesAcross]);


    return (
        <MakerContext.Provider value={{
          nodesAcross, setNodesAcross,
          strandsAcross, setStrandsAcross,
          rowCount, setRowCount,
        }}>
            {children}
        </MakerContext.Provider>
    );

}

export {MakerContext};
export default MakerProvider;