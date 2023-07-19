import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import 'react-native-get-random-values'
import { v4 } from 'uuid'

import { Button, Grouped, Rounded } from './Buttons'

import { Container, Row , Column} from './styled'

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
                action: () => {},
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

export default () => {
  const [currentDegree, setCurrentDegree] = useState(22); // Step 1

  const handleTemperatureUp = () => {
    setCurrentDegree(prevDegree => prevDegree + 1); // Step 3
  };

  const handleTemperatureDown = () => {
    setCurrentDegree(prevDegree => prevDegree - 1); // Step 3
  };

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
                  action: handleTemperatureUp, // Step 3
                },
                down: {
                  ...button.buttons.down,
                  action: handleTemperatureDown, // Step 3
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
    justifyContent: 'center', // Added to horizontally center the content
  },
  currentDegreeText: {
    fontSize: 60,
    marginLeft: 10,
    fontFamily: 'Arial', // Replace with the font family of your choice
    fontWeight: 'bold', // Add other font styles as needed
  },
});