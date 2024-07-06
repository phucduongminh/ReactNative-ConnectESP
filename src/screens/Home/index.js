import React, {useState} from 'react';
import {Container, Header, H1, PrimaryText} from './styles';
import {Text, ScrollView, StatusBar, TouchableOpacity} from 'react-native';
import db from '../../../db.json';
import * as Animatable from 'react-native-animatable';
import styleGlobal from '../../styles/global';
import {useSocketContext} from '../../../SocketContext';
import dgram from 'react-native-udp';
import {port} from '../../../constants';

export default ({navigation}) => {
  const {isSocketConnected, hostIP} = useSocketContext();
  //const socket = dgram.createSocket('udp4');
  //const [socket, setSocket] = useState(null);

  function sendHomeSignal() {
    // Implement the logic to send "HOME" signal to the server

    if (!isSocketConnected) {
      // Socket is not connected, show an alert or a message
      alert(
        'Socket is not connected. Please start the search to connect to the hardware.',
      );
      return;
    }

    // if (!socket) {
    //   // Tạo socket mới nếu chưa có
    //   setSocket(dgram.createSocket('udp4'));
    // }

    const socket = dgram.createSocket('udp4');

    const signalToSend = {
      command: 'RECEIVE',
    };

    const jsonString = JSON.stringify(signalToSend);

    // Reuse the existing socket instance to send "HOME" signal
    socket.bind(port);
    socket.once('listening', function () {
      socket.send(
        jsonString,
        undefined,
        undefined,
        port,
        hostIP,
        function (err) {
          if (err) throw err;
          console.log(hostIP);
          //socket.close();
        },
      );
      socket.on('message', function (msg, rinfo) {
        var buffer = {
          data: msg.toString(),
        };
        console.log('data.data', buffer.data);
        if (
          buffer.data !== 'UNKNOWN' &&
          buffer.data !== 'WAIT' &&
          buffer.data !== 'UNSUPPORTED'
        ) {
          alert('Remote Identified! Device: ' + buffer.data);
          navigation.navigate('ACControl', {Protocol: buffer.data});
          socket.close();
        }
        if (buffer.data === 'UNKNOWN') {
          alert('UNKNOWN device!');
        }
        if (buffer.data === 'UNSUPPORTED') {
          alert('Unsupported device!');
          socket.close(); // Đóng socket sau khi nhận được UNSUPPORTED
        }
      });
    });
  }

  function learnSignal() {
    if (!isSocketConnected) {
      alert(
        'Socket is not connected. Please start the search to connect to the hardware.',
      );
      navigation.navigate('NewHardware');
    } else {
      navigation.navigate('DeviceTypes');
    }
  }

  return (
    <Container>
      <StatusBar
        backgroundColor={db.theme.colors.statuBar}
        barStyle="light-content"
      />
      <Header>
        <H1>Welcome!</H1>
      </Header>
      <Animatable.View animation="fadeInUpBig" style={[styleGlobal.footer]}>
        <ScrollView
          style={styleGlobal.scrollViewSignIn}
          keyboardShouldPersistTaps={'handled'}>
          <PrimaryText>Good to see you!</PrimaryText>
          <TouchableOpacity
            onPress={() => sendHomeSignal()}
            style={[styleGlobal.signIn, styleGlobal.signInColor]}>
            <Text style={styleGlobal.textBtnSignUp}>Add New Remote</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Devices')}
            style={[styleGlobal.signIn, styleGlobal.signInColor]}>
            <Text style={styleGlobal.textBtnSignUp}>Choose Device</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styleGlobal.signIn, styleGlobal.signInColor]}
            onPress={() => learnSignal()}>
            <Text style={styleGlobal.textBtnSignUp}>Learn Signal</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animatable.View>
    </Container>
  );
};
