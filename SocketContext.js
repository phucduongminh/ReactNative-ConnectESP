// SocketContext.js

import {createContext, useContext, useState} from 'react';
//import dgram from 'react-native-udp'

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({children}) => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [hostIP, setHostIP] = useState('');
  //const socket = dgram.createSocket('udp4');

  return (
    <SocketContext.Provider
      value={{isSocketConnected, setIsSocketConnected, hostIP, setHostIP}}>
      {children}
    </SocketContext.Provider>
  );
};
