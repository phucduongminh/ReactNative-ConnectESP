import React, { useState, useEffect } from 'react';
import { NetworkInfo } from 'react-native-network-info';
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

export default ({ navigation }) => {
  // Khai báo các biến trạng thái cho tài khoản, mật khẩu và địa chỉ IP của ESP32
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

  // Hàm gửi dữ liệu cho ESP32 qua chế độ Access point
  const sendData = async () => {
     // Tạo một biến để kiểm tra xem có lỗi không
     let error = false;
    // Kiểm tra xem tài khoản và mật khẩu có rỗng không
    if (data.email === '' || data.password === '') {
      Alert.alert('Không thành công', 'Vui lòng nhập tài khoản và mật khẩu');
      // Đặt biến error là true
      error = true;
    }
    NetworkInfo.getIPAddress().then(ip => {
      // Nếu địa chỉ IP có dạng 192.168.4.x, tức là kết nối với ESP32
      if (ip.startsWith('192.168.4.')) {
        // Thiết lập địa chỉ IP của ESP32 là 192.168.4.1
        setEspIP('192.168.4.1');
      } else {
        // Ngược lại, hiển thị thông báo lỗi
        Alert.alert('Không thành công', 'Vui lòng kết nối với wifi của ESP32');
        // Đặt biến error là true
        error = true;
      }
    });
    if (!error) {
      // Tạo một đối tượng XMLHttpRequest để gửi dữ liệu
      let xhr = new XMLHttpRequest();
      // Mở một kết nối POST đến địa chỉ IP của ESP32
      xhr.open('POST', 'http://' + espIP);
      // Thiết lập kiểu nội dung là application/json
      xhr.setRequestHeader('Content-Type', 'application/json');
      // Gửi dữ liệu dưới dạng chuỗi JSON
      xhr.send(JSON.stringify({ wifiname: data.email, password: data.password }));
      // Xử lý kết quả trả về
      xhr.onload = () => {
        // Nếu mã trạng thái là 200, tức là thành công
        if (xhr.status === 200) {
          // Hiển thị thông báo thành công
          Alert.alert('Thành công', 'Đã gửi dữ liệu cho ESP32');
          setData({
            email: '',
            password: '',
            buttonDisable: true,
            check_textInputChange: false,
            secureTextEntry: true,
            isValidEmail: true,
            isValidPassword: true,
          })
        } else {
          // Ngược lại, hiển thị thông báo lỗi
          Alert.alert('Không thành công', 'Không thể gửi dữ liệu cho ESP32');
        }
      };
    }
  };

  // Hàm lấy địa chỉ IP của ESP32 khi ứng dụng khởi động
  useEffect(() => {
    // Lấy địa chỉ IP của mạng wifi hiện tại
    NetworkInfo.getIPAddress().then(ip => {
      // Nếu địa chỉ IP có dạng 192.168.4.x, tức là kết nối với ESP32
      if (ip.startsWith('192.168.4.')) {
        // Thiết lập địa chỉ IP của ESP32 là 192.168.4.1
        setEspIP('192.168.4.1');
      } else {
        // Ngược lại, hiển thị thông báo lỗi
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
}
