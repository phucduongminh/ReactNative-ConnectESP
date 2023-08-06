import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { v4 } from 'uuid';

import { Button, Grouped, Rounded } from './Buttons';

import { Container, Row, Column } from './styled';

import { useSocketContext } from '../../../SocketContext'; // Assuming you have this context
import dgram from 'react-native-udp'; // Assuming you are using this library for UDP

export default () => {
  const [currentDegree, setCurrentDegree] = useState(30);
  const [messageStageOn, setMessageStageOn] = useState(false);

  const handleTemperatureUp = () => {
    setCurrentDegree(prevDegree => prevDegree + 1);
  };

  const handleTemperatureDown = () => {
    setCurrentDegree(prevDegree => prevDegree - 1);
  };

  const toggleMessageStage = () => {
    setMessageStageOn(prevStatus => !prevStatus);
  };

  const sendPowerSignal = () => {
    toggleMessageStage();
    const { isSocketConnected, hostIP } = useSocketContext();
    const socket = dgram.createSocket('udp4');
    const port = 12345;

    if (!isSocketConnected) {
      alert('Socket is not connected. Please start the search to connect to the server.');
      return;
    }

    const signalToSend = messageStageOn ? 'OFF' : 'ON';

    socket.bind(port);
    socket.once('listening', function () {
      socket.send(signalToSend, undefined, undefined, port, hostIP, function (err) {
        if (err) throw err;
        console.log(`Sent ${signalToSend} signal to server:`, hostIP);
        socket.close();
      });
    });

    // Toggle the message stage after sending the signal
    toggleMessageStage();
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
                  icon: 'chevron-up'
                }
              }
        },
        {
          id: v4(),
          type: 'rounded',
          buttons: {
            center: {
              action: () => {},
              icon: 'chevron-down'
            }
          }
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
                  action: {sendPowerSignal},
                  icon: 'power'
                }
              }
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
              icon: 'plus'
            },
            down: {
              action: () => {},
              icon: 'minus'
            }
          }
        },
        {
          id: v4(),
              type: 'rounded',
              buttons: {
                center: {
                  action: () => {},
                  icon: 'wind'
                }
              }
        },
        {
          id: v4(),
          type: 'grouped',
          label: 'mode',
          buttons: {
            up: {
              action: () => {},
              icon: 'cloud-snow'
            },
            down: {
              action: () => {},
              icon: 'sun'
            }
          }
        }
      ],
    },
  ];

  return (
    <Container>
      <Column>
        <View style={styles.screen}>
          <Icon name="thermometer" size={60} color="#000" />
          <Text style={styles.currentDegreeText}>{currentDegree}°C</Text>
        </View>
      </Column>
      {data.map(({ id, buttons }) => (
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
    padding: 20,
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
