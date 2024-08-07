import React from 'react';
import t from 'prop-types';
import {Dimensions} from 'react-native';

import Ripple from '../../../components/Ripple';

import {Container, Gradient, Name} from './styled';

const data = [
  {
    id: 1,
    name: 'Television',
    gradient: ['#1e3c72', '#2a5298'],
  },
  {
    id: 2,
    name: 'Air conditioner',
    gradient: ['#eb3349', '#f45c43'],
  },
  {
    id: 3,
    name: 'Fan',
    gradient: ['#48b1bf', '#06beb6'],
  },
  {
    id: 4,
    name: 'Smart Box',
    gradient: ['#29323c', '#485563'],
  },
];

const offset = 30;
const width = Dimensions.get('window').width / 2 - offset;

export default function List({handleNavigate}) {
  return (
    <Container
      data={data}
      keyExtractor={item => String(item.id)}
      renderItem={({item}) => {
        const {gradient, name} = item;

        return (
          <Ripple
            onPress={() => handleNavigate(name)} // Pass the name as a parameter
            width={width}
            height={width}
            radius={16}
            marginBottom={20}>
            <Gradient gradient={gradient}>
              <Name>{name}</Name>
            </Gradient>
          </Ripple>
        );
      }}
    />
  );
}

List.propTypes = {
  handleNavigate: t.func.isRequired,
};
