import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StatusBar,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {API_URL} from '../../../constants';
import {useSelector} from 'react-redux';
import axios from 'axios';

import List from './List';
import db from '../../../db';

import {Container, styles, Header, H1} from './styled';

export default ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceType, setDeviceType] = useState('');
  const [deviceTypeId, setDeviceTypeId] = useState('');

  function handleNavigate(type_id, type) {
    setDeviceType(type);
    setDeviceTypeId(type_id);
    setModalVisible(true);
  }

  function setInvisible() {
    setModalVisible(false);
  }

  function handleNavigateModal(device_id) {
    if (deviceTypeId === 1) {
      navigation.navigate('LearnSignal');
    } else if (deviceTypeId === 3) {
      navigation.navigate('ACLearnSignal', {device_id});
    } else {
      // Add other conditions and navigations for different device types
    }
  }

  return (
    <Container>
      <StatusBar
        backgroundColor={db.theme.colors.primary}
        barStyle="light-content"
      />
      <Header>
        <H1>Choose a device</H1>
      </Header>
      <List handleNavigate={handleNavigate} />
      <ModalForm
        modalVisible={modalVisible}
        setInvisible={setInvisible}
        deviceType={deviceType}
        deviceTypeId={deviceTypeId}
        handleNavigateModal={handleNavigateModal}
      />
    </Container>
  );
};

const ModalForm = ({
  modalVisible,
  setInvisible,
  deviceType,
  deviceTypeId,
  handleNavigateModal,
}) => {
  const [deviceName, setDeviceName] = useState('');
  const {userId} = useSelector(state => state.user.userId);

  const addDevice = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/device/add`, {
        device_name: deviceName,
        type_id: deviceTypeId,
        user_id: userId,
      });

      const data = response.data;

      if (data.success) {
        console.log('Device added successfully:', data.message);
        const device_id = data.device_id;
        setDeviceName('');
        setInvisible();
        handleNavigateModal(device_id);
      } else {
        console.error('Error adding device:', data.message);
      }
    } catch (error) {
      console.error('Error adding device:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Device</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Device Name"
            value={deviceName}
            onChangeText={setDeviceName}
          />
          <Text style={styles.modalText}>Device Type: {deviceType}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={setInvisible}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={addDevice}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
