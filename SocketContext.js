// SocketContext.js
import React, {createContext, useContext, useState} from 'react';

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({children}) => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [hostIP, setHostIP] = useState('');
  const [isMqtt, setIsMqtt] = useState(false);
  const [client, setClient] = useState(null);

  return (
    <SocketContext.Provider
      value={{
        isSocketConnected,
        setIsSocketConnected,
        hostIP,
        setHostIP,
        isMqtt,
        setIsMqtt,
        client,
        setClient,
      }}>
      {children}
    </SocketContext.Provider>
  );
};
