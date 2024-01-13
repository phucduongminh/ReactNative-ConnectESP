// Đây là file App.js cho React Native
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';

export default ({navigation}) => {
  // Khai báo các biến trạng thái cho tài khoản, mật khẩu và địa chỉ IP của ESP32
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [espIP, setEspIP] = useState('');

  // Hàm gửi dữ liệu cho ESP32 qua chế độ Access point
  const sendData = async () => {
    // Kiểm tra xem tài khoản và mật khẩu có rỗng không
    if (username === '' || password === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập tài khoản và mật khẩu');
      return;
    }
    // Tạo một đối tượng XMLHttpRequest để gửi dữ liệu
    let xhr = new XMLHttpRequest();
    // Mở một kết nối POST đến địa chỉ IP của ESP32
    xhr.open('POST', 'http://' + espIP);
    // Thiết lập kiểu nội dung là application/json
    xhr.setRequestHeader('Content-Type', 'application/json');
    // Gửi dữ liệu dưới dạng chuỗi JSON
    xhr.send(JSON.stringify({ username: username, password: password }));
    // Xử lý kết quả trả về
    xhr.onload = () => {
      // Nếu mã trạng thái là 200, tức là thành công
      if (xhr.status === 200) {
        // Hiển thị thông báo thành công
        Alert.alert('Thành công', 'Đã gửi dữ liệu cho ESP32');
      } else {
        // Ngược lại, hiển thị thông báo lỗi
        Alert.alert('Lỗi', 'Không thể gửi dữ liệu cho ESP32');
      }
    };
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
        Alert.alert('Lỗi', 'Vui lòng kết nối với wifi của ESP32');
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Provice your Wi-Fi to connect.</Text>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Input Wi-fi Name"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Input Password"
        secureTextEntry={true}
      />
      <Button title="Send" onPress={sendData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
  },
});
