import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setUser} from '../../redux/slices/user';
import {Container, LoadingIcon} from './styles';
import {CommonActions, useNavigation} from '@react-navigation/native';

export default () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUser(false));
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      }),
    );
  }, [dispatch, navigation]);

  return (
    <Container>
      <LoadingIcon size="large" color="#FFFFFF" />
    </Container>
  );
};
