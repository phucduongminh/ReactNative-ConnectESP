import React, {useState} from 'react';
import {
  TouchableOpacity,
  PermissionsAndroid,
  View,
  LogBox,
  Alert,
  Text,
  StatusBar,
  ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import styleGlobal from '../../styles/global';
import LinearGradient from 'react-native-linear-gradient';

import base64 from 'react-native-base64';

import CheckBox from '@react-native-community/checkbox';

import {BleManager, Device} from 'react-native-ble-plx';
import { useBluetoothStatus } from 'react-native-bluetooth-status';
import {styles, Container, Header, H1, PrimaryText} from './styles';
import db from '../../../db.json';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const BLTManager = new BleManager();

const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';

const MESSAGE_UUID = '6d68efe5-04b6-4a85-abc4-c2670b7bf7fd';
const BOX_UUID = 'f27b53ad-c63d-49a0-8c0f-9f297e6cc520';

function StringToBool(input) {
  return input == '1';
}

function BoolToString(input) {
  if (input) {
    return 'Value 1';
  } else {
    return 'Value 0';
  }
}

export default ({navigation}) => {
  //Is a device connected?
  const [isConnected, setIsConnected] = useState(false);

  //What device is connected?
  const [connectedDevice, setConnectedDevice] = useState(null);

  const [message, setMessage] = useState('Nothing Yet');
  const [boxValue, setBoxValue] = useState(false);
const [btStatus, isPending, setBluetooth] = useBluetoothStatus();

  // Scans availbale BLT Devices and then call connectDevice
  async function scanDevices() {
    try {
// kiểm tra trạng thái bluetooth
      if (!btStatus) {
        // yêu cầu người dùng bật bluetooth
        await setBluetooth(true)
      }
  
      // yêu cầu quyền truy cập bluetooth
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permission Bluetooth',
          message: 'Requirement for Bluetooth',
          buttonPositive: 'OK',
        },
      );
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        // nếu người dùng cấp quyền
        console.log('scanning');
        // hiển thị Activityindicator
  
        // bắt đầu quét thiết bị
        BLTManager.startDeviceScan(null, null, (error, scannedDevice) => {
          if (error) {
            //throw error; // ném lỗi nếu có
          }
  
          if (scannedDevice && scannedDevice.name == 'BLEExample') {
            // dừng quét nếu tìm thấy thiết bị mong muốn
            BLTManager.stopDeviceScan();
            // kết nối thiết bị
            connectDevice(scannedDevice);
          }
        });
  
        // dừng quét thiết bị sau 5 giây
        setTimeout(() => {
          BLTManager.stopDeviceScan();
          console.log("Stop scan.")
        }, 5000);
      } else {
        // nếu người dùng không cấp quyền
        Alert.alert("Permission Bluetooth","Requirement for Bluetooth")
      }
    } catch (error) {
      // xử lý lỗi nếu có
      console.warn(error);
    }
  }

  // handle the device disconnection (poorly)
  async function disconnectDevice() {
    console.log('Disconnecting start');

    if (connectedDevice != null) {
      const isDeviceConnected = await connectedDevice.isConnected();
      if (isDeviceConnected) {
        BLTManager.cancelTransaction('messagetransaction');
        BLTManager.cancelTransaction('nightmodetransaction');

        BLTManager.cancelDeviceConnection(connectedDevice.id).then(() =>
          console.log('DC completed'),
        );
      }

      const connectionStatus = await connectedDevice.isConnected();
      if (!connectionStatus) {
        setIsConnected(false);
      }
    }
  }

  //Function to send data to ESP32
  async function sendBoxValue(value) {
    BLTManager.writeCharacteristicWithResponseForDevice(
      connectedDevice?.id,
      SERVICE_UUID,
      BOX_UUID,
      base64.encode(value.toString()),
    ).then(characteristic => {
      console.log('Boxvalue changed to :', base64.decode(characteristic.value));
    });
  }
  //Connect the device and start monitoring characteristics
  async function connectDevice(device) {
    console.log('connecting to Device:', device.name);

    device
      .connect()
      .then(device => {
        setConnectedDevice(device);
        setIsConnected(true);
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {
        //  Set what to do when DC is detected
        BLTManager.onDeviceDisconnected(device.id, (error, device) => {
          console.log('Device DC');
          setIsConnected(false);
        });

        //Read inital values

        //Message
        device
          .readCharacteristicForService(SERVICE_UUID, MESSAGE_UUID)
          .then(valenc => {
            setMessage(base64.decode(valenc?.value));
          });

        //BoxValue
        device
          .readCharacteristicForService(SERVICE_UUID, BOX_UUID)
          .then(valenc => {
          });

        //monitor values and tell what to do when receiving an update

        //Message
        device.monitorCharacteristicForService(
          SERVICE_UUID,
          MESSAGE_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              setMessage(base64.decode(characteristic?.value));
              console.log(
                'Message update received: ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'messagetransaction',
        );

        //BoxValue
        device.monitorCharacteristicForService(
          SERVICE_UUID,
          BOX_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              console.log(
                'Box Value update received: ',
                base64.decode(characteristic?.value),
              );
            }
          },
          'boxtransaction',
        );

        console.log('Connection established');
      });
  }

  return (
    <Container>
      <StatusBar
        backgroundColor={db.theme.colors.statuBar}
        barStyle="light-content"
      />
      <Header>
        <H1>Connect BlueTooth</H1>
      </Header>
      <Animatable.View animation="fadeInUpBig" style={[styleGlobal.footer]}>
      <ScrollView
        style={styleGlobal.scrollViewSignIn}>
        <PrimaryText>{message}</PrimaryText>
        <View style={{paddingBottom: 20}}></View>
            {!isConnected ? (
            <TouchableOpacity
            disabled={false}
            style={[styleGlobal.signIn,{width:"50%",left:"25%",right:"25%"}]}
            onPress={() => {
              scanDevices();
            }}>
            <LinearGradient
              colors={
                [db.theme.colors.primary, db.theme.colors.primary]
              }
              style={styleGlobal.signIn}>
              <Text style={styleGlobal.textBtnSignIn}>Connect</Text>
            </LinearGradient>
          </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={false}
              style={[styleGlobal.signIn,{width:"50%",left:"25%",right:"25%"},styleGlobal.signInColor]}
              onPress={() => {
                disconnectDevice();
              }}>
              <LinearGradient
                colors={
                  [db.theme.colors.primary, db.theme.colors.primary]
                }
                style={styleGlobal.signIn}>
                <Text style={styleGlobal.textBtnSignIn}>Disconnect</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          {/* Checkbox */}
      <View style={styles.rowView}>
        <CheckBox
          disabled={false}
          value={boxValue}
          onValueChange={newValue => {
            setBoxValue(newValue)
            sendBoxValue(BoolToString(newValue));
          }}
        />
        <Text style={{marginTop:5}}>Check to send message!</Text>
      </View>
      </ScrollView>
    </Animatable.View>
  </Container>
  );
}