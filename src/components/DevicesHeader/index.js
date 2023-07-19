import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ViewMain} from './styles';

const DevicesHeader = ({addButtonPress}) => {
  return (
    <ViewMain
      style={{
        flex: 0.2,
        backgroundColor: 'black',
        flexDirection: 'row',
      }}>
      <View style={{flex: 0.2}}></View>
      <Text
        style={{
          paddingTop: 20,
          paddingLeft: 20,
          fontSize: 20,
          flex: 0.6,
          textAlign: 'center',
        }}>
        DISPOSITIVOS
      </Text>
      <TouchableOpacity
        onPress={addButtonPress}
        style={{
          paddingTop: 22,
          paddingRight: 22,
          flex: 0.2,
          alignItems: 'flex-end',
        }}>
        <AntDesign name="pluscircleo" size={26} color="tomato" />
      </TouchableOpacity>
    </ViewMain>
  );
};

export default DevicesHeader;
