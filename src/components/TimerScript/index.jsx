import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {RadioButton} from 'react-native-paper'; // Optional
import {Button} from 'react-native-paper';
import {styles} from './styled';

const TimerScript = () => {
  const [isOn, setIsOn] = useState(false);
  const [degree, setDegree] = useState(20);
  const [selectedTime, setSelectedTime] = useState(new Date()); // Default to current time
  const [showTimePicker, setShowTimePicker] = useState(false);

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
        onPress={() =>
          alert(
            `Time set to ${hours}:${minutes < 10 ? `0${minutes}` : minutes}`,
          )
        }
        style={styles.button}>
        SET
      </Button>
    </View>
  );
};

export default TimerScript;
