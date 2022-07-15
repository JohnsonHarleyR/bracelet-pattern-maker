import React, {useState, createContext} from 'react';

const MakerContext = createContext({});

const MakerProvider = ({children}) => {


    return (
        <MakerContext.Provider value={{}}>
            {children}
        </MakerContext.Provider>
    );

}

export {MakerContext};
export default MakerProvider;