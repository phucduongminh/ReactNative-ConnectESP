import React from 'react';
import { View, Button, Alert } from 'react-native';

const MyCustomAlert = () => {
  const showAlert = () => {
    Alert.alert(
      'Custom Title',
      'This is a custom alert dialog.',
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
    );
  };

  return (
    <View>
      <Button title="Show Custom Alert" onPress={showAlert} />
    </View>
  );
};

export default MyCustomAlert;
