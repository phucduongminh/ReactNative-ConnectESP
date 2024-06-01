import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import {Button, Grouped, Rounded} from './Buttons';
import {Container, Row, Column} from './styled';

import {useSocketContext} from '../../../SocketContext'; // Assuming you have this context
import dgram from 'react-native-udp'; // Assuming you are using this library for UDP
import {port} from '../../../constants';

export default () => {
  const [currentDegree, setCurrentDegree] = useState(30);
  const [messageStageOn, setMessageStageOn] = useState(false);
  const {isSocketConnected, hostIP} = useSocketContext(); // Use the socket context here

  const handleTemperatureUp = () => {
    setCurrentDegree(prevDegree => prevDegree + 1);
  };

  const handleTemperatureDown = () => {
    setCurrentDegree(prevDegree => prevDegree - 1);
  };

  const learnPowerSignal = () => {
    const socket = dgram.createSocket('udp4');

    if (!isSocketConnected) {
      alert(
        'Socket is not connected. Please start the search to connect to the server.',
      );
      return;
    }

    const signalToSend = messageStageOn ? 'OFFAC' : 'ONAC';

    socket.bind(port);
    socket.once('listening', function () {
      socket.send(
        signalToSend,
        undefined,
        undefined,
        port,
        hostIP,
        function (err) {
          if (err) throw err;
          console.log(`Sent ${signalToSend} signal to server:`, hostIP);
          socket.close();
          setMessageStageOn(prevStatus => !prevStatus);
        },
      );
    });
  };

  const data = [
    {
      id: '1',
      type: 'rounded',
      buttons: {
        center: {
          action: () => {},
          icon: 'chevron-up',
        },
      },
    },
    {
      id: '2',
      type: 'rounded',
      buttons: {
        center: {
          action: () => {},
          icon: 'chevron-down',
        },
      },
    },
    {
      id: 'ac-power',
      type: 'rounded',
      buttons: {
        center: {
          action: learnPowerSignal,
          icon: 'power',
        },
      },
    },
    {
      id: 'ac-fan',
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
      id: 'ac-wing',
      type: 'rounded',
      buttons: {
        center: {
          action: () => {},
          icon: 'wind',
        },
      },
    },
    {
      id: 'ac-mode',
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
  ];

  return (
    <Container>
      <Column>
        <View style={styles.screen}>
          <Icon name="thermometer" size={60} color="#000" />
          <Text style={styles.currentDegreeText}>{currentDegree}°C</Text>
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
