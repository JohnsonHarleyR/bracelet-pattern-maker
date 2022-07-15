import React, {useState, createContext, useEffect} from 'react';

const MakerContext = createContext({});

const MakerProvider = ({children}) => {

  const [nodesAcross, setNodesAcross] = useState(4);
  const [strandsAcross, setStrandsAcross] = useState(0);

  useEffect(() => {
    if (nodesAcross) {
      setStrandsAcross(nodesAcross * 2);
    }
  }, [nodesAcross]);


    return (
        <MakerContext.Provider value={{
          nodesAcross, strandsAcross,
          setNodesAcross, setStrandsAcross,
        }}>
            {children}
        </MakerContext.Provider>
    );

}

export {MakerContext};
export default MakerProvider;