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
  const {isSocketConnected, hostIP, isMqtt, client} = useSocketContext();
  //const socket = dgram.createSocket('udp4');
  //const [socket, setSocket] = useState(null);

  function sendHomeSignal() {
    if (!isSocketConnected && !isMqtt) {
      // Check both connection states
      alert(
        'Neither Socket nor MQTT is connected. Please check your connections.',
      );
      return;
    }

    const signalToSend = {
      command: 'RECEIVE',
      ...(isMqtt && {client_id: 'app-01'}), //
    };

    const jsonString = JSON.stringify(signalToSend);

    if (isSocketConnected) {
      const socket = dgram.createSocket('udp4');
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
    } else if (isMqtt) {
      const request = new Paho.MQTT.Message(jsonString);
      request.destinationName = 'esp32/request';
      request.retained = false;
      client.send(request);
      client.onMessageArrived = message => {
        const parsedMessage = JSON.parse(message.payloadString);
        if (parsedMessage.message === 'UNSUPPORTED') {
          alert('Unsupported device!');
        }
        if (
          parsedMessage.message !== 'UNKNOWN' &&
          parsedMessage.message !== 'WAIT' &&
          parsedMessage.message !== 'UNSUPPORTED'
        ) {
          alert('Remote Identified! Protocol: ' + parsedMessage.message);
          navigation.navigate('ACControl', {Protocol: parsedMessage.message});
        }
        if (parsedMessage.message === 'UNKNOWN') {
          alert('UNKNOWN device!');
        }
      };
    }
  }

  function learnSignal() {
    if (!isSocketConnected && !isMqtt) {
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
