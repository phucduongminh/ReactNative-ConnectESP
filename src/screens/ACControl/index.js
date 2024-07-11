import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {v4} from 'uuid';

import {Button, Grouped, Rounded} from './Buttons';
import {Container, Row, Column} from './styled';

import {useSocketContext} from '../../../SocketContext'; // Assuming you have this context
import dgram from 'react-native-udp'; // Assuming you are using this library for UDP
import {port} from '../../../constants';
import {useSelector} from 'react-redux';

import SpeechControl from '../SpeechControl'; // Import the SpeechControl component

export default ({route}) => {
  const [currentDegree, setCurrentDegree] = useState(28);
  const [messageStageOn, setMessageStageOn] = useState(false);
  const [isVoiceScreenVisible, setIsVoiceScreenVisible] = useState(false); // State to manage the visibility of SpeechControl
  const {isSocketConnected, isMqtt, client} = useSocketContext(); // Use the socket context here
  const {Protocol} = route.params || '';
  const {hostIp} = useSelector(state => state.user.hostIp);

  const handleTemperature = id => {
    if (id === 'up') {
      setCurrentDegree(prevDegree => prevDegree + 1);
    } else if (id === 'down') {
      setCurrentDegree(prevDegree => prevDegree - 1);
    }
    const newDegree = currentDegree + (id === 'up' ? 1 : -1);
    if (!isSocketConnected && !isMqtt) {
      // Check both connection states
      alert(
        'Neither Socket nor MQTT is connected. Please check your connections.',
      );
      return;
    }

    const signalToSend = {
      command: 'ON-AC',
      mode: '0',
      Protocol: Protocol || '',
      degree: newDegree,
      ...(isMqtt && {client_id: 'app-01'}), // Thêm client_id nếu là MQTT
    };
    const jsonString = JSON.stringify(signalToSend);

    if (isSocketConnected) {
      const socket = dgram.createSocket('udp4');
      socket.bind(port);
      socket.once('listening', function () {
        socket.send(
          jsonString,
          undefined,
          undefined,
          port,
          hostIp,
          function (err) {
            if (err) throw err;
          },
        );
        socket.on('message', function (msg, rinfo) {
          var buffer = {
            data: msg.toString(),
          };
          console.log('data.data', buffer.data);
          if (buffer.data === 'RECEIVE') {
            socket.close();
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
        if (parsedMessage.message === 'RECEIVE') {
          console.log('Message received:', parsedMessage);
        }
      };
    }
  };

  const sendPowerSignal = () => {
    if (!isSocketConnected && !isMqtt) {
      // Check both connection states
      alert(
        'Neither Socket nor MQTT is connected. Please check your connections.',
      );
      return;
    }

    const signalToSend = {
      command: messageStageOn ? 'OFF-AC' : 'ON-AC',
      mode: '0',
      Protocol: Protocol || '',
      degree: currentDegree,
      ...(isMqtt && {client_id: 'app-01'}), // Thêm client_id nếu là MQTT
    };
    const jsonString = JSON.stringify(signalToSend);

    if (isSocketConnected) {
      const socket = dgram.createSocket('udp4');
      socket.bind(port);
      socket.once('listening', function () {
        socket.send(
          jsonString,
          undefined,
          undefined,
          port,
          hostIp,
          function (err) {
            if (err) throw err;
          },
        );
        socket.on('message', function (msg, rinfo) {
          var buffer = {
            data: msg.toString(),
          };
          console.log('data.data', buffer.data);
          if (buffer.data === 'RECEIVE') {
            setMessageStageOn(prevStatus => !prevStatus);
            socket.close();
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
        if (parsedMessage.message === 'RECEIVE') {
          console.log('Message received:', parsedMessage);
          setMessageStageOn(prevStatus => !prevStatus);
        }
      };
    }
  };

  const data = [
    {
      id: v4(),
      buttons: [
        {
          id: v4(),
          type: 'rounded',
          buttons: {
            center: {
              action: () => {handleTemperature('up')},
              icon: 'chevron-up',
            },
          },
        },
        {
          id: v4(),
          type: 'rounded',
          buttons: {
            center: {
              action: () => {handleTemperature('down')},
              icon: 'chevron-down',
            },
          },
        },
      ],
    },
    {
      id: v4(),
      buttons: [
        {
          id: v4(),
          type: 'rounded',
          buttons: {
            center: {
              action: sendPowerSignal,
              icon: 'power',
            },
          },
        },
      ],
    },
    {
      id: v4(),
      buttons: [
        {
          id: v4(),
          type: 'button',
          icon: 'mic',
          action: () => {
            setIsVoiceScreenVisible(true); // Show the SpeechControl when the mic button is pressed
          },
        },
        {
          id: v4(),
          type: 'button',
          icon: 'wind',
          action: () => {},
        },
      ],
    },
    {
      id: v4(),
      buttons: [
        {
          id: v4(),
          type: 'grouped',
          label: 'fan',
          buttons: {
            up: {
              action: () => {},
              icon: 'plus',
            },
            down: {
              action: () => {},
              icon: 'minus',
            },
          },
        },
        {
          id: v4(),
          type: 'rounded',
          buttons: {
            center: {
              action: () => {},
              icon: 'clock',
            },
          },
        },
        {
          id: v4(),
          type: 'grouped',
          label: 'mode',
          buttons: {
            up: {
              action: () => {},
              icon: 'cloud-snow',
            },
            down: {
              action: () => {},
              icon: 'sun',
            },
          },
        },
      ],
    },
  ];

  return (
    <Container>
      <Column>
        <View style={styles.screen}>
          {messageStageOn && (
            <>
              <Icon name="thermometer" size={60} color="#000" />
              <Text style={styles.currentDegreeText}>{currentDegree}°C</Text>
            </>
          )}
        </View>
      </Column>
      {data.map(({id, buttons}) => (
        <Row key={id}>
          {buttons.map(button => {
            if (button.type === 'button') {
              return (
                <Button
                  key={button.id}
                  icon={button.icon}
                  onPress={() => {
                    button.action();
                  }}
                />
              );
            }

            if (button.type === 'rounded') {
              const roundedButtons = {
                ...button.buttons,
                up: {
                  ...button.buttons.up,
                  //action: () => {},
                },
                down: {
                  ...button.buttons.down,
                  //action: () => {},
                },
              };

              return <Rounded key={button.id} buttons={roundedButtons} />;
            }

            if (button.type === 'grouped') {
              return (
                <Grouped
                  key={button.id}
                  label={button.label}
                  buttons={button.buttons}
                />
              );
            }
            return null;
          })}
        </Row>
      ))}
      <Modal
        visible={isVoiceScreenVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsVoiceScreenVisible(false)}>
        <TouchableWithoutFeedback
          onPress={() => setIsVoiceScreenVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <SpeechControl mode={0} />
        </View>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFF',
    height: 100,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentDegreeText: {
    fontSize: 60,
    marginLeft: 10,
    fontFamily: 'Arial',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f1f3f4',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '40%',
  },
});
