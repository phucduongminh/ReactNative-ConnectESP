import React from 'react';
import t from 'prop-types';

import Input from './Input';
import List from './List';

import {Container} from './styled';

import {API_URL} from '../../../constants';
import axios from 'axios';

export default ({navigation, route}) => {
  const {type_id} = route.params;
  async function handleNavigate(device_id) {
    //navigation.navigate('UserACControl', {device_id});
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
      <List handleNavigate={handleNavigate} typeId={type_id} />
    </Container>
  );
};

propTypes = {
  navigation: t.shape({
    navigate: t.func,
  }).isRequired,
};
