import React, {useEffect, useState} from 'react';
import t from 'prop-types';
import {Dimensions} from 'react-native';

import Ripple from '../../../components/Ripple';
import {API_URL} from '../../../../constants';

import {Container, Gradient, Name} from './styled';
import {useSelector} from 'react-redux';
import axios from 'axios';

const offset = 30;
const width = Dimensions.get('window').width / 2 - offset;

export default function List({handleNavigate}) {
  const {userId} = useSelector(state => state.user.userId);
  const [deviceTypes, setDeviceTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/device/gettype?user_id=${userId}`,
        );
        const data = response.data;

        if (data.success) {
          setDeviceTypes(data.types);
        } else {
          console.error('Error fetching device types:', data.message);
        }
      } catch (error) {
        console.error('Error fetching device types:', error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <Container
      data={deviceTypes}
      keyExtractor={item => String(item.type_id)}
      renderItem={({item}) => {
        const {type_id, type} = item;
        const gradient = data.find(d => d.id === type_id)?.gradient; // Match gradient based on type_id

        return (
          <Ripple
            onPress={() => handleNavigate(type_id, type)} // Pass the type as a parameter
            width={width}
            height={200}
            radius={16}
            marginBottom={20}>
            <Gradient gradient={gradient}>
              <Name>{type}</Name>
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

const data = [
  {
    id: 1,
    gradient: ['#1e3c72', '#2a5298'],
  },
  {
    id: 2,
    gradient: ['#eb3349', '#f45c43'],
  },
  {
    id: 3,
    gradient: ['#48b1bf', '#06beb6'],
  },
  {
    id: 4,
    gradient: ['#29323c', '#485563'],
  },
];
