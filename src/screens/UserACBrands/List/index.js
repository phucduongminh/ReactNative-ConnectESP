import React, {useState, useEffect} from 'react';
import t from 'prop-types';

import Ripple from '../../../components/Ripple';

import {Container, Content, Name} from './styled';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {API_URL} from '../../../../constants';

export default function List({handleNavigate, typeId}) {
  const [device, setDevice] = useState([]);
  const {userId} = useSelector(state => state.user.userId);

  useEffect(() => {
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

    fetchData();
  }, [typeId, userId]);
  return (
    <Container
      data={device}
      keyExtractor={item => String(item.device_id)}
      renderItem={({item}) => {
        return (
          <Ripple
            onPress={() => handleNavigate(item.device_id)}
            radius={0}
            full>
            <Content>
              <Name>{item.device_name}</Name>
            </Content>
          </Ripple>
        );
      }}
    />
  );
}

List.propTypes = {
  handleNavigate: t.func.isRequired,
};
