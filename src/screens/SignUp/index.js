import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import {Container, Header, Action, ButtonSign, GoBack, H1} from './styles';
import * as Animatable from 'react-native-animatable';
import styleGlobal from '../../styles/global';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import db from '../../../db.json';

export default () => {
  const navigation = useNavigation();

  const [data, setData] = React.useState({
    user: {},
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    buttonDisable: true,
    viewPassword: true,
    viewConfirmPassword: true,
    isValidName: true,
    isValidEmail: true,
    isValidPassword: true,
    isValidConfirm: true,
  });

  const handleSignClick = async () => {
    //console.log(process.env.API_URL);
    axios
      .post('http://192.168.1.11:3001/api/users/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      })
      .then(response => {
        if (response.data.success) {
          Alert.alert('Success', 'You have registered successfully');
          navigation.navigate('SignIn');
        } else {
          Alert.alert('Error', response.data.message);
        }
      })
      .catch(error => {
        console.error(error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          Alert.alert('Error', error.response.data.message);
        } else {
          // Something happened in setting up the request that triggered an Error
          Alert.alert('Error', 'Something went wrong. Please try again.');
        }
      });
  };

  const textName = val => {
    if (val.trim().length >= 3) {
      setData({
        ...data,
        name: val,
        isValidName: true,
      });
    } else {
      setData({
        ...data,
        name: val,
        isValidName: false,
      });
    }
  };
  const textEmail = val => {
    if (val.trim().length > 0) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
        isValidEmail: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        isValidEmail: false,
      });
    }
  };
  const textPassword = val => {
    if (val.trim().length >= 6) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };
  const textConfirm = val => {
    if (val.trim().length >= 6) {
      setData({
        ...data,
        confirm_password: val,
        isValidConfirm: true,
      });
    } else {
      setData({
        ...data,
        confirm_password: val,
        isValidConfirm: false,
      });
    }
  };

  const updateViewPassword = () => {
    setData({
      ...data,
      viewPassword: !data.viewPassword,
    });
  };
  const updateConfirmPassword = () => {
    setData({
      ...data,
      viewConfirmPassword: !data.viewConfirmPassword,
    });
  };

  return (
    <Container>
      <StatusBar
        backgroundColor={db.theme.colors.primary}
        barStyle="light-content"
      />
      <Header>
        <GoBack onPress={() => navigation.navigate('SignIn')}>
          <FontAwesome name="arrow-left" size={20} style={{color: '#ffff'}} />
        </GoBack>
        <H1>SIGN UP</H1>
      </Header>
      <Animatable.View animation="fadeInUpBig" style={styleGlobal.footer}>
        <ScrollView
          style={styleGlobal.scrollViewSignIn}
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Text style={styleGlobal.textSignIn}>Name</Text>
          <Action>
            <MaterialIcons name="person" color={'black'} size={20} />
            <TextInput
              placeholder="Enter your name"
              style={styleGlobal.textInputSignIn}
              autoCapitalize="none"
              onChangeText={val => textName(val)}
            />
          </Action>
          {data.isValidName ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styleGlobal.errorMsg}>
                The username must be 4 characters long.
              </Text>
            </Animatable.View>
          )}

          <Text style={styleGlobal.textSignIn}>E-mail</Text>
          <Action>
            <MaterialIcons name="email" color={'black'} size={20} />
            <TextInput
              placeholder="Enter a valid email"
              style={styleGlobal.textInputSignIn}
              autoCapitalize="none"
              onChangeText={val => textEmail(val)}
            />
          </Action>
          {data.isValidEmail ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styleGlobal.errorMsg}>Required field</Text>
            </Animatable.View>
          )}

          <Text style={styleGlobal.textSignIn}>Password</Text>
          <Action>
            <Feather name="lock" size={20} />
            <TextInput
              placeholder="Your password"
              secureTextEntry={data.viewPassword ? true : false}
              style={styleGlobal.textInputSignIn}
              autoCapitalize="none"
              onChangeText={val => textPassword(val)}
            />
            <TouchableOpacity onPress={updateViewPassword}>
              {data.viewPassword ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </Action>
          {data.isValidPassword ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styleGlobal.errorMsg}>
                The password must contain at least 6 characters.
              </Text>
            </Animatable.View>
          )}

          <Text style={styleGlobal.textSignIn}>Confirm Password</Text>
          <Action>
            <Feather name="lock" size={20} />
            <TextInput
              placeholder="Confirm your password"
              secureTextEntry={data.viewConfirmPassword ? true : false}
              style={styleGlobal.textInputSignIn}
              autoCapitalize="none"
              onChangeText={val => textConfirm(val)}
            />
            <TouchableOpacity onPress={updateConfirmPassword}>
              {data.viewConfirmPassword ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </Action>
          {data.isValidConfirm ? null : (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styleGlobal.errorMsg}>
                The password must contain at least 6 characters.
              </Text>
            </Animatable.View>
          )}

          <ButtonSign>
            <TouchableOpacity
              style={styleGlobal.signIn}
              onPress={() => {
                handleSignClick();
              }}>
              <LinearGradient
                colors={[db.theme.colors.primary, db.theme.colors.primary]}
                style={styleGlobal.signIn}>
                <Text style={styleGlobal.textBtnSignIn}>Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ButtonSign>
        </ScrollView>
      </Animatable.View>
    </Container>
  );
};
