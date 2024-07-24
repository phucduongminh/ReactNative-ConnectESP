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
import SpeechControl from '../SpeechControl'; // Import the SpeechControl component

import {useSocketContext} from '../../../SocketContext'; // Assuming you have this context
import dgram from 'react-native-udp'; // Assuming you are using this library for UDP
import {port} from '../../../constants';
import {useSelector} from 'react-redux';

export default ({navigation, route}) => {
  const [currentDegree, setCurrentDegree] = useState(30);
  const [messageStageOn, setMessageStageOn] = useState(false);
  const {device_id} = route.params;
  //console.log(device_id);
  const {isSocketConnected, isMqtt, client} = useSocketContext(); // Use the socket context here
  const {hostIp} = useSelector(state => state.user.hostIp);
  const [isVoiceScreenVisible, setIsVoiceScreenVisible] = useState(false); // State to manage the visibility of SpeechControl

  const handleTemperatureUp = () => {
    setCurrentDegree(prevDegree => prevDegree + 1);
  };

  const handleTemperatureDown = () => {
    setCurrentDegree(prevDegree => prevDegree - 1);
  };

  const sendLearnPowerSignal = () => () => {
    if (!isSocketConnected && !isMqtt) {
      alert(
        'Neither Socket nor MQTT is connected. Please check your connections.',
      );
      return;
    }

    const signalToSend = {
      command: 'SEND-LEARN',
      device_id: device_id,
      button_id: messageStageOn ? 'power-off' : 'power',
      ...(isMqtt && {client_id: 'app-01'}), // Thêm client_id nếu là MQTT
    };

    console.log('Sending JSON object to server:', JSON.stringify(signalToSend));
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
            if (err) {
              throw err;
            }
            console.log('Sent JSON object to server:', hostIp);
          },
        );

        socket.on('message', function (msg, rinfo) {
          const data = msg.toString();
          console.log('Received data from server:', data);

          if (data !== 'NETWORK-ERR') {
            setMessageStageOn(prevStatus => !prevStatus);
            socket.close();
          } else if (data === 'NETWORK-ERR') {
            alert('Server is not available!');
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
        if (parsedMessage.message !== 'NETWORK-ERR') {
          setMessageStageOn(prevStatus => !prevStatus);
        } else if (parsedMessage.message === 'NETWORK-ERR') {
          alert('Server is not available!');
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
              action: () => {},
              icon: 'chevron-up',
            },
          },
        },
        {
          id: v4(),
          type: 'rounded',
          buttons: {
            center: {
              action: () => {},
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
              action: sendLearnPowerSignal('power'),
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
                  action: handleTemperatureUp,
                },
                down: {
                  ...button.buttons.down,
                  action: handleTemperatureDown,
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
          <SpeechControl mode={1} />
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
