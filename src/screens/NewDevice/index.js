import React, {useState, useEffect} from 'react';
import {
  ButtonView,
  SecondaryText,
  Container,
  Header,
  H1,
  PrimaryText,
  LoadingIcon,
} from './styles';
import {Text, StatusBar, TouchableOpacity, View, FlatList} from 'react-native';
import db from '../../../db.json';
import * as Animatable from 'react-native-animatable';
import styleGlobal from '../../styles/global';
import {useSocketContext} from '../../../SocketContext';
import dgram from 'react-native-udp';
import {port} from '../../constants';


export default () => {
  const notFoundText = 'Search result';

  const [loading, setLoading] = useState(false);
  const [foundEspList, setFoundEspList] = useState([{key: notFoundText}]);
  //const [isSocketConnected, setIsSocketConnected] = useState(false);
  const {isSocketConnected, setIsSocketConnected, hostIP, setHostIP} =
    useSocketContext();
  //const [hostIP, setHostIP] = useState('');

  const socket = dgram.createSocket('udp4');

  /*useEffect(() => {
    if (foundEspList.length > 1) {
      console.log('I found an esp8266 on the network!', hostIP);
    }
  }, [foundEspList]);*/

  function tryToConnect(options) {
    socket.bind(options.port);
    socket.once('listening', function () {
      setIsSocketConnected(true);
      socket.send(
        'ESP-ACK',
        undefined,
        undefined,
        options.port,
        options.host,
        function (err) {
          if (err) throw err;
          console.log('Message sent!');
        },
      );
    });
    socket.on('message', function (msg, rinfo) {
      var buffer = {
        data: msg.toString(),
      };
      if (buffer.data.includes('192.168')) {
        if (
          buffer.data !== 'ESP-ACK' &&
          buffer.data !== 'CANCEL' &&
          buffer.data !== 'WAIT'
        ) {
          console.log('data.data', buffer.data);
          setHostIP(buffer.data);
          // Check if the list already contains an item with the new value
          if (!foundEspList.some(item => item.key === buffer.data)) {
            setFoundEspList(prevList => [
              ...prevList,
              {key: 'ESP # IP:: ' + buffer.data},
            ]);
          }
        }
        socket.close();
      }
      console.log('Message received', msg);
    });
  }

  function beginSearch() {
    setLoading(true);
    setFoundEspList([{key: notFoundText}]);
    const options = {
      port: port,
      host: '192.168.1.255',
      localAddress: '0.0.0.0',
      reuseAddress: true,
    };
    tryToConnect(options);

    // Set a timeout to stop loading after 2 minutes (120,000 milliseconds)
    if (isSocketConnected) {
      setTimeout(() => {
        setLoading(false);
        socket.removeAllListeners();
        socket.close();
        setIsSocketConnected(false);
        if (foundEspList.length === 1 && foundEspList[0].key === notFoundText) {
          // No devices found within 2 minutes
          setFoundEspList([{key: 'No devices found!'}]);
        }
      }, 120000); // 2 minutes in milliseconds
    }
  }

  function cancelSearch() {
    socket.bind(port);
    socket.once('listening', function () {
      socket.send('CANCEL', undefined, undefined, port, hostIP, function (err) {
        if (err) throw err;
      });
      socket.on('message', function (msg, rinfo) {});
      socket.removeAllListeners();
      setIsSocketConnected(false);
      setLoading(false);
      socket.close();
    });
  }

  return (
    <Container>
      <StatusBar
        backgroundColor={db.theme.colors.statuBar}
        barStyle="light-content"
      />
      <Header>
        <H1>NEW DEVICE</H1>
      </Header>
      <Animatable.View animation="fadeInUpBig" style={[styleGlobal.footer]}>
        <View
          style={styleGlobal.scrollViewSignIn}
          keyboardShouldPersistTaps={'handled'}>
          <PrimaryText>Find your ESP8266!</PrimaryText>
          <SecondaryText>
            Click the button below to search the ESP8266 over the network!
          </SecondaryText>
          <ButtonView>
            {!loading && (
              <TouchableOpacity
                onPress={() => beginSearch()}
                style={[styleGlobal.signIn, styleGlobal.signInColor]}>
                <Text style={styleGlobal.textBtnSignUp}>Search</Text>
              </TouchableOpacity>
            )}
            {loading && (
              <>
                <LoadingIcon size="large" color={db.theme.colors.primary} />
                <TouchableOpacity
                  onPress={() => cancelSearch()}
                  style={[styleGlobal.signIn, styleGlobal.signInColor]}>
                  <Text style={styleGlobal.textBtnSignUp}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </ButtonView>
          <View>
            <FlatList
              data={foundEspList}
              renderItem={({item}) => (
                <View style={{backgroundColor: 'white'}}>
                  <Text style={{color: 'black', padding: 10}}>{item.key}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </View>
      </Animatable.View>
    </Container>
  );
};
