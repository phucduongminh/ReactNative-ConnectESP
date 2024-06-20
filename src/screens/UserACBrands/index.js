import React, {useState} from 'react';
import {Modal, TouchableWithoutFeedback, View} from 'react-native';
import t from 'prop-types';

import Input from './Input';
import List from './List';
import TimerScript from '../../components/TimerScript';

import {Container, styles} from './styled';

import {API_URL} from '../../../constants';
import axios from 'axios';

export default ({navigation, route}) => {
  const [visible, setVisible] = useState(false);
  const [device_id, setDevice_id] = useState(null);
  const [Protocol, setProtocol] = useState(null);

  const modalVisible = (device_id, Protocol) => {
    setVisible(previousState => !previousState);
    setDevice_id(device_id);
    setProtocol(Protocol);
  };

  const {type_id} = route.params;
  async function handleNavigate(device_id) {
    const response = await axios.get(
      `${API_URL}/api/device/getprotocolbyid?device_id=${device_id}`,
    );
    const resdata = response.data;
    console.log(resdata);
    if (resdata.success) {
      if (resdata.Protocol) {
        navigation.navigate('ACControl', {Protocol: resdata.Protocol});
      } else {
        navigation.navigate('UserACControl', {device_id});
      }
    } else {
      console.error('Error fetching device types:', resdata.message);
    }
  }

  return (
    <Container>
      <Input />
      <List
        handleNavigate={handleNavigate}
        typeId={type_id}
        modalVisible={modalVisible}
      />
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <TimerScript device_id={device_id} Protocol={Protocol} />
        </View>
      </Modal>
    </Container>
  );
};

propTypes = {
  navigation: t.shape({
    navigate: t.func,
  }).isRequired,
};
