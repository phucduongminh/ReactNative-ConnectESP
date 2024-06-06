import React from 'react';
import t from 'prop-types';

import Input from './Input';
import List from './List';

import {Container} from './styled';

export default ({navigation, route}) => {
  const {type_id} = route.params;
  function handleNavigate(device_id) {
    navigation.navigate('UserACControl', {device_id});
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
