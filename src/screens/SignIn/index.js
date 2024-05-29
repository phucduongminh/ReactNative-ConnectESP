import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import {Container, Action, ButtonSign, Header, H1} from './styles';
import * as Animatable from 'react-native-animatable';
import {CommonActions} from '@react-navigation/native';
import styleGlobal from '../../styles/global';
import db from '../../../db.json';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {setUser} from '../../redux/slices/user';

export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [data, setData] = React.useState({
    email: '',
    password: '',
    buttonDisable: true,
    check_textInputChange: false,
    secureTextEntry: true,
    isValidEmail: true,
    isValidPassword: true,
  });

  const handleSignClick = async () => {
    axios
      .post('http://192.168.1.11:3001/api/users/login', {
        email: data.email,
        password: data.password,
      })
      .then(response => {
        if (response.data.success) {
          Alert.alert('Success', 'Login Successfull');
          dispatch(setUser({user: true}));
          navigation.dispatch(
            CommonActions.reset({index: 0, routes: [{name: 'Drawer'}]}),
          );

          // Add this to prevent the hardware back button from navigating back
          const backAction = () => {
            return true; // This will prevent the event from bubbling up and the default back button action from being executed
          };
          const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
          );

          return () => backHandler.remove();
        } else {
          Alert.alert('Error', response.data.message);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleMessageButtonClick = () => {
    navigation.navigate('SignUp');
  };

  const textEmail = val => {
    if (val.trim().length > 0) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
        isValidEmail: true,
        buttonDisable: true,
      });
    } else {
      setData({
        ...data,
        check_textInputChange: false,
        isValidEmail: false,
      });
    }
  };

  const handleValidEmail = val => {
    if (val.trim().length > 1) {
      setData({
        ...data,
        isValidEmail: true,
      });
    } else {
      setData({
        ...data,
        isValidEmail: false,
      });
    }
  };

  const handlePasswordChange = val => {
    if (val.trim().length >= 6) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
        buttonDisable: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  return (
    <Container>
      <StatusBar
        backgroundColor={db.theme.colors.primary}
        barStyle="light-content"
      />
      <Header>
        <H1>SIGN IN</H1>
      </Header>
      <Animatable.View animation="fadeInUpBig" style={[styleGlobal.footer]}>
        <ScrollView
          style={styleGlobal.scrollViewSignIn}
          keyboardShouldPersistTaps={'handled'}>
          <Text style={styleGlobal.textSignIn}>E-mail</Text>
          <Action>
            <MaterialIcons name="person" color={'black'} size={20} />
            <TextInput
              placeholder="Your E-mail"
              style={styleGlobal.textInputSignIn}
              autoCapitalize="none"
              onChangeText={val => textEmail(val)}
              onEndEditing={e => handleValidEmail(e.nativeEvent.text)}
            />
            {data.check_textInputChange ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </Action>
          {data.isValidEmail ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styleGlobal.errorMsg}>Required field!</Text>
            </Animatable.View>
          )}

          <Text style={styleGlobal.textSignIn}>Password</Text>
          <Action>
            <Feather name="lock" size={20} />
            <TextInput
              placeholder="Your password"
              secureTextEntry={data.secureTextEntry}
              style={styleGlobal.textInputSignIn}
              autoCapitalize="none"
              onChangeText={val => handlePasswordChange(val)}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </Action>
          {data.isValidPassword ? null : (
            <Animatable.View animation="fadeInLeft">
              <Text style={styleGlobal.errorMsg}>
                The password must contain at least 6 characters.
              </Text>
            </Animatable.View>
          )}

          <ButtonSign>
            <TouchableOpacity
              disabled={!data.isValidEmail || !data.isValidPassword}
              style={styleGlobal.signIn}
              onPress={() => {
                handleSignClick();
              }}>
              <LinearGradient
                colors={
                  !data.isValidEmail || !data.isValidPassword
                    ? ['#8a92a8', '#8a92a8']
                    : [db.theme.colors.primary, db.theme.colors.primary]
                }
                style={styleGlobal.signIn}>
                <Text style={styleGlobal.textBtnSignIn}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleMessageButtonClick()}
              style={[styleGlobal.signIn, styleGlobal.signInColor]}>
              <Text style={styleGlobal.textBtnSignUp}>Sign Up</Text>
            </TouchableOpacity>
          </ButtonSign>
        </ScrollView>
      </Animatable.View>
    </Container>
  );
};
