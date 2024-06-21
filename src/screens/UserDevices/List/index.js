import React, {useState, useCallback} from 'react';
import t from 'prop-types';
import {Dimensions} from 'react-native';
import Ripple from '../../../components/Ripple';
import {API_URL} from '../../../../constants';
import {Container, Gradient, Name} from './styled';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';

const offset = 30;
const width = Dimensions.get('window').width / 2 - offset;

export default function List({handleNavigate}) {
  const {userId} = useSelector(state => state.user.userId);
  const [deviceTypes, setDeviceTypes] = useState([]);

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

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [userId]),
  );

  return (
    <>
      {deviceTypes && deviceTypes.length > 0 && (
        <Container
          data={deviceTypes}
          keyExtractor={item => String(item.type_id)}
          renderItem={({item}) => {
            const {type_id, type} = item;
            const gradient = data.find(d => d.id === type_id)?.gradient || [
              '#000',
              '#fff',
            ]; // Provide a default gradient

            return (
              <Ripple
                onPress={() => handleNavigate(type_id, type)}
                width={width}
                height={width}
                radius={16}
                marginBottom={20}>
                <Gradient gradient={gradient}>
                  <Name>{type}</Name>
                </Gradient>
              </Ripple>
            );
          }}
        />
      )}
    </>
  );
}

List.propTypes = {
  handleNavigate: t.func.isRequired,
};

const data = [
  {id: 1, gradient: ['#1e3c72', '#2a5298']}, // Original (deep blue) - Enhanced contrast
  {id: 2, gradient: ['#ff6f61', '#ff9966']}, // Softened orange/red gradient
  {id: 3, gradient: ['#348F50', '#56B4D3']}, // Teal gradient with more contrast
  {id: 4, gradient: ['#222831', '#393E46']}, // Original (dark gray) - Slightly lighter
  {id: 5, gradient: ['#536976', '#292E49']}, // Purple-toned gradient
  {id: 6, gradient: ['#000428', '#004e92']}, // Deep blue - More saturated
  {id: 7, gradient: ['#f0c27b', '#4b1248']}, // Rich purple to gold
  {id: 8, gradient: ['#2C3E50', '#FD746C']}, // Blue to orange
  {id: 9, gradient: ['#e55d87', '#5fc3e4']}, // Pink to blue
  {id: 10, gradient: ['#1f4037', '#99f2c8']}, // Teal gradient
];
