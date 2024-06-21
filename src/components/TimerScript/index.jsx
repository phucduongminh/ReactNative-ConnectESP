import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {RadioButton} from 'react-native-paper'; // Optional
import {Button} from 'react-native-paper';
import {styles} from './styled';

import {useSocketContext} from '../../../SocketContext';
import dgram from 'react-native-udp';
import {port} from '../../../constants';
import {useSelector} from 'react-redux';

const TimerScript = ({device_id, Protocol}) => {
  const [isOn, setIsOn] = useState(false);
  const [degree, setDegree] = useState(20);
  const [selectedTime, setSelectedTime] = useState(new Date()); // Default to current time
  const [showTimePicker, setShowTimePicker] = useState(false);

  const {isSocketConnected} = useSocketContext(); // Use the socket context here
  const {hostIp} = useSelector(state => state.user.hostIp);

  const handleTimeChange = (event, selectedDate) => {
    if (selectedDate) {
      setSelectedTime(selectedDate);
      setShowTimePicker(Platform.OS === 'ios');
    } else {
      setShowTimePicker(false);
    }
  };

  const hours = selectedTime.getHours();
  const minutes = selectedTime.getMinutes();

  const handleSetTime = () => {
    console.log(device_id);
    const socket = dgram.createSocket('udp4');

    if (!isSocketConnected) {
      alert(
        'Socket is not connected. Please start the search to connect to the server.',
      );
      return;
    }

    const subCommand = isOn ? 'ON-AC' : 'OFF-AC';

    const signalToSend = {
      command: Protocol ? subCommand : 'SEND-LEARN',
      device_id: device_id,
      button_id: isOn ? 'power' : 'power-off',
      degree: degree,
      hour: hours,
      minute: minutes,
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
        hostIp,
        function (err) {
          if (err) {
            throw err;
          }
          console.log('Sent JSON object to server:', hostIp);
          //socket.close();
        },
      );
      socket.on('message', function (msg, rinfo) {
        var buffer = {
          data: msg.toString(),
        };
        console.log('data.data', buffer.data);
        if (buffer.data === 'DONE-SET-TIME') {
          alert(
            `Time set to ${hours}:${minutes < 10 ? `0${minutes}` : minutes}`,
          );
          socket.close();
        }
        if (buffer.data === 'NETWORK-ERR') {
          alert('Server is not available!');
        }
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Option</Text>
      <RadioButton.Group
        onValueChange={value => setIsOn(value === 'on')}
        value={isOn ? 'on' : 'off'}>
        <View style={styles.radioButtonRow}>
          <RadioButton.Item
            label="Turn On"
            value="on"
            labelStyle={styles.radioButtonLabel}
          />
          <RadioButton.Item
            label="Turn Off"
            value="off"
            labelStyle={styles.radioButtonLabel}
          />
        </View>
      </RadioButton.Group>

      <Text style={styles.label}>Set Degree</Text>
      <View style={styles.degreePickerContainer}>
        <Picker
          selectedValue={degree}
          onValueChange={itemValue => setDegree(itemValue)}
          style={styles.picker}>
          {[...Array(11)].map((_, i) => (
            <Picker.Item
              key={i + 20}
              label={(i + 20).toString()}
              value={i + 20}
              style={styles.pickerItem} // Style for picker items
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Choose Time</Text>
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        style={styles.timePickerButton}>
        <View style={styles.timeDisplay}>
          <Text style={styles.timeText}>{hours} h</Text>
          <Text style={styles.colon}>|</Text>
          <Text style={styles.timeText}>
            {minutes < 10 ? `0${minutes}` : minutes} m
          </Text>
        </View>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="spinner" // Change to 'spinner' for a mobile alarm-style
          onChange={handleTimeChange}
        />
      )}

      <Button
        mode="contained"
        onPress={() => {
          handleSetTime();
        }}
        style={styles.button}>
        SET
      </Button>
    </View>
  );
};

export default TimerScript;
