import React, {useState, useCallback} from 'react';
import {TouchableOpacity} from 'react-native';
import t from 'prop-types';
import Ripple from '../../../components/Ripple';
import {Container, Content, Name} from './styled';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {API_URL} from '../../../../constants';
import {useFocusEffect} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

export default function List({handleNavigate, typeId, modalVisible}) {
  const [device, setDevice] = useState([]);
  const {userId} = useSelector(state => state.user.userId);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/device/getbytypeid?user_id=${userId}&type_id=${typeId}`,
      );
      const resdata = response.data;

      if (resdata.success) {
        setDevice(resdata.device);
      } else {
        console.error('Error fetching device types:', resdata.message);
      }
    } catch (error) {
      console.error('Error fetching device types:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [typeId, userId]),
  );

  return (
    <Container
      data={device}
      keyExtractor={item => item.device_id}
      renderItem={({item}) => {
        const {device_id, device_name, Protocol} = item;
        return (
          <Ripple onPress={() => handleNavigate(device_id)} radius={0}>
            <Content>
              <Name>{device_name}</Name>
              <TouchableOpacity
                onPress={() => {
                  modalVisible(device_id, Protocol);
                }}>
                <Feather name="plus-square" color="gray" size={20} />
              </TouchableOpacity>
            </Content>
          </Ripple>
        );
      }}
    />
  );
}

List.propTypes = {
  handleNavigate: t.func.isRequired,
  typeId: t.number.isRequired,
  modalVisible: t.func.isRequired, // Added propTypes check for modalVisible
};
