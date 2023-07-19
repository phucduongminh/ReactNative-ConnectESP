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
import {
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import db from '../../../db.json';
import * as Animatable from 'react-native-animatable';
import styleGlobal from '../../styles/global';
import dgram from 'react-native-udp'

export default () => {
  const navigation = useNavigation();
  const port = 12345;
  const notFoundText = 'Search result';

  const [loading, setLoading] = useState(false);
  const [foundEspList, setFoundEspList] = useState([{key:notFoundText}]);
  const [countEspList, setCountEspList] = useState(1);

  const socket = dgram.createSocket('udp4');
  socket.on('message', function(msg, rinfo) {
    var buffer = {
      data: msg.toString(),
    };
    if (buffer.data !== 'ESP-ACKER') 
    {
      console.log('data.data', buffer.data);
      var localFoundEspList = foundEspList;
      if (foundEspList.find(i => i.key == notFoundText))
      {
        localFoundEspList = [];
      }
      setFoundEspList([
        ...localFoundEspList,
        {
          key: "ESP #" + countEspList + " :: " + buffer.data
        }
      ]);
      setCountEspList(countEspList+1);
    }
    console.log('Message received', msg);
  });

  useEffect(() => {
    if (foundEspList.length > 1) {
      console.log('I found an esp8266 on the network!', foundEspList[-1]?.host);
    }
  }, [foundEspList]);

  function tryToConnect(options) {
    socket.bind(options.port)
    socket.once('listening', function() {
      socket.send('ESP-ACKER', undefined, undefined, options.port, options.host, function(err) {
        if (err) throw err
        console.log('Message sent!')
      })
    })
  }

  function beginSearch() {
    setLoading(true);
    setFoundEspList([{key:notFoundText}]);
    const options = {
      port: port,
      host: '192.168.1.255',
      localAddress: '0.0.0.0',
      reuseAddress: true,
    };
    tryToConnect(options);
  }

  function cancelSearch() {
    setLoading(false);
    socket.close();
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
        renderItem={({item}) => <Text style={{color: 'black', marginTop: 20}}>{item.key}</Text>}
      />
          </View>
        </View>
      </Animatable.View>
    </Container>
  );
};