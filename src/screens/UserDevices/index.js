import React from 'react';
import t from 'prop-types';

import List from './List';

import {Container} from './styled';

export default ({navigation}) => {
  function handleNavigate(type_id, type) {
    if (type_id === 1) {
      navigation.navigate('UserBrands');
    } else if (type_id === 3) {
      navigation.navigate('UserACBrands', {type_id});
    } else {
      // You can add other conditions and navigations for different device names
    }
  }

  return (
    <Container>
      <List handleNavigate={handleNavigate} />
    </Container>
  );
};

propTypes = {
  navigation: t.shape({
    navigate: t.func,
  }).isRequired,
};
