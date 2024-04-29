import React from 'react';
import t from 'prop-types';

import List from './List';

import {Container} from './styled';

export default ({navigation, learn}) => {
  function handleNavigate(name) {
    if (name === 'Television') {
      learn === false || learn == undefined
        ? navigation.navigate('Brands')
        : navigation.navigate('LearnSignal');
    } else if (name === 'Air conditioner') {
      navigation.navigate('ACBrands');
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
