import React from 'react';
import {Container, Header, H1, PrimaryText} from './styles';
import {Text, ScrollView, StatusBar, TouchableOpacity,} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import db from '../../../db.json';
import * as Animatable from 'react-native-animatable';
import styleGlobal from '../../styles/global';
import { useSocketContext } from '../../../SocketContext';
import dgram from 'react-native-udp'

export default () => {
  const { isSocketConnected,hostIP } = useSocketContext();
  const socket = dgram.createSocket('udp4');
  socket.on('message', function (msg, rinfo) {})

  function sendHomeSignal() {
    // Implement the logic to send "HOME" signal to the server
    const port = 12345;

    if (!isSocketConnected) {
      // Socket is not connected, show an alert or a message
      alert('Socket is not connected. Please start the search to connect to the server.');
      return;
    }

    // Reuse the existing socket instance to send "HOME" signal
    socket.bind(port)
    socket.once('listening', function() {
      socket.send('HOME', undefined, undefined, port, hostIP, function(err) {
        if (err) throw err  
        console.log(hostIP) 
        socket.close();
      })
    })
  }

  return (
    <Container>
      <StatusBar
        backgroundColor={db.theme.colors.statuBar}
        barStyle="light-content"
      />
      <Header>
        <H1>HOME</H1>
      </Header>
      <Animatable.View animation="fadeInUpBig" style={[styleGlobal.footer]}>
      <ScrollView
        style={styleGlobal.scrollViewSignIn}
        keyboardShouldPersistTaps={'handled'}>
        <PrimaryText>Home</PrimaryText>
        <TouchableOpacity
          onPress={() => sendHomeSignal()}
          style={[styleGlobal.signIn, styleGlobal.signInColor]}>
          <Text style={styleGlobal.textBtnSignUp}>Test</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animatable.View>
  </Container>
  );
};
