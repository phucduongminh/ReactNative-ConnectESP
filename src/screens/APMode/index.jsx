import React, {useState, useEffect} from 'react';
import {NetworkInfo} from 'react-native-network-info';
import {useNavigation} from '@react-navigation/native';
import {
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import {Container, Action, ButtonSign, Header, H1} from './styles';
import * as Animatable from 'react-native-animatable';
import styleGlobal from '../../styles/global';
import db from '../../../db.json';
import { useSocketContext } from '../../../SocketContext';
import { setHostIp } from '../../redux/slices/user';
import { useDispatch } from 'react-redux';

export default ({navigation}) => {
  const dispatch = useDispatch();
  const [espIP, setEspIP] = useState('');
  const [data, setData] = React.useState({
    email: '',
    password: '',
    buttonDisable: true,
    check_textInputChange: false,
    secureTextEntry: true,
    isValidEmail: true,
    isValidPassword: true,
  });
  const {setHostIP} = useSocketContext();

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
    if (val.trim().length >= 8) {
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

  const sendData = async () => {
    let error = false;
    if (data.email === '' || data.password === '') {
      Alert.alert('Không thành công', 'Vui lòng nhập tài khoản và mật khẩu');
      error = true;
    }

    NetworkInfo.getIPV4Address().then(ip => {
      if (ip.startsWith('192.168.4.')) {
        setEspIP('192.168.4.1');
        //console.log(ip);
      } else {
        Alert.alert('Không thành công', 'Vui lòng kết nối với wifi của ESP32');
        error = true;
      }
    });

    if (!error) {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://' + espIP + ':80/post');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({wifiname: data.email, password: data.password}));
      xhr.onload = () => {
        if (xhr.status === 200) {
          const responseJson = xhr.responseText; // Assuming xhr.responseText is your JSON response from the server
          const responseObject = JSON.parse(responseJson);
          console.log(responseObject.local_ip);
          setHostIP(responseObject.local_ip);
          dispatch(setHostIp({hostIp: responseObject.local_ip}));
          Alert.alert('Thành công', 'Đã gửi dữ liệu cho ESP32');
          setData({
            email: '',
            password: '',
            buttonDisable: true,
            check_textInputChange: false,
            secureTextEntry: true,
            isValidEmail: true,
            isValidPassword: true,
          });
        } else {
          Alert.alert('Không thành công', 'Không thể gửi dữ liệu cho ESP32');
          console.log('Request failed. Status:', xhr.status);
        }
      };
    }
  };

  useEffect(() => {
    NetworkInfo.getIPV4Address().then(ip => console.log(ip));
    NetworkInfo.getIPV4Address().then(ip => {
      if (ip.startsWith('192.168.4.')) {
        setEspIP('192.168.4.1');
      } else {
        Alert.alert('Cài đặt', 'Vui lòng kết nối với wifi của ESP32');
      }
    });
  }, []);

  return (
    <Container>
      <StatusBar
        backgroundColor={db.theme.colors.statuBar}
        barStyle="light-content"
      />
      <Header>
        <H1>Provide your Wi-Fi to connect.</H1>
      </Header>
      <Animatable.View animation="fadeInUpBig" style={[styleGlobal.footer]}>
        <ScrollView
          style={styleGlobal.scrollViewSignIn}
          keyboardShouldPersistTaps={'handled'}>
          <Text style={styleGlobal.textSignIn}>Wi-fi Name:</Text>
          <Action>
            <MaterialIcons name="person" color={'black'} size={20} />
            <TextInput
              placeholder="Input Wi-fi Name"
              style={styleGlobal.textInputSignIn}
              autoCapitalize="none"
              value={data.email}
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

          <Text style={styleGlobal.textSignIn}>Password:</Text>
          <Action>
            <Feather name="lock" size={20} />
            <TextInput
              placeholder="Input Password"
              secureTextEntry={data.secureTextEntry}
              style={styleGlobal.textInputSignIn}
              autoCapitalize="none"
              value={data.password}
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
                The password must contain at least 8 characters.
              </Text>
            </Animatable.View>
          )}

          <ButtonSign>
            <TouchableOpacity
              disabled={!data.isValidEmail || !data.isValidPassword}
              style={styleGlobal.signIn}
              onPress={sendData}>
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
          </ButtonSign>
        </ScrollView>
      </Animatable.View>
    </Container>
  );
};
