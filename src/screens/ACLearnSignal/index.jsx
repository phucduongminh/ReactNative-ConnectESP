import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {v4} from 'uuid';

import {Button, Grouped, Rounded} from './Buttons';
import {Container, Row, Column} from './styled';

import {useSocketContext} from '../../../SocketContext'; // Assuming you have this context
import dgram from 'react-native-udp'; // Assuming you are using this library for UDP
import {port} from '../../../constants';

export default ({navigation, route}) => {
  const [currentDegree, setCurrentDegree] = useState(30);
  const [messageStageOn, setMessageStageOn] = useState(false);
  const {device_id} = route.params;
  const {isSocketConnected, hostIP} = useSocketContext(); // Use the socket context here

  const handleTemperatureUp = () => {
    setCurrentDegree(prevDegree => prevDegree + 1);
  };

  const handleTemperatureDown = () => {
    setCurrentDegree(prevDegree => prevDegree - 1);
  };

  const learnPowerSignal = id => () => {
    console.log(device_id);
    const socket = dgram.createSocket('udp4');

    if (!isSocketConnected) {
      alert(
        'Socket is not connected. Please start the search to connect to the server.',
      );
      return;
    }

    if (id === 'power') {
      id = messageStageOn ? 'power-off' : 'power';
    }

    const signalToSend = {
      command: 'LEARN',
      device_id: device_id,
      button_id: id,
    };

    const jsonString = JSON.stringify(signalToSend);
    console.log('Sending JSON object to server:', jsonString);

    socket.bind(port);
    socket.once('listening', function () {
      socket.send(
        jsonString,
        undefined,
        undefined,
        port,
        hostIP,
        function (err) {
          if (err) {
            throw err;
          }
          console.log('Sent JSON object to server:', hostIP);
          //socket.close();
        },
      );
      socket.on('message', function (msg, rinfo) {
        var buffer = {
          data: msg.toString(),
        };
        console.log('data.data', buffer.data);
        if (buffer.data !== 'LEARN-FAIL' && buffer.data !== 'PRO') {
          console.log('data.data', buffer.data);
          alert('Learn signal successfully! ');
          setMessageStageOn(prevStatus => !prevStatus);
          socket.close();
        }
        if (buffer.data === 'LEARN-FAIL') {
          alert('Check Hardware or Remote Control and try again!');
        }
        if (buffer.data === 'NETWORK-ERR') {
          alert('Server is not available!');
        }
      });
    });
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
              action: learnPowerSignal('power'),
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
          icon: 'mic-off',
          action: () => {},
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
});
