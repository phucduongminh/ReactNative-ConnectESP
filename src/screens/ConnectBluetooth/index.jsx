import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  PermissionsAndroid,
  View,
  LogBox,
  Alert,
  Text,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import styleGlobal from '../../styles/global';
import LinearGradient from 'react-native-linear-gradient';
import base64 from 'react-native-base64';
import {BleManager} from 'react-native-ble-plx';
import {useBluetoothStatus} from 'react-native-bluetooth-status';
import {styles, Container, Header, H1, PrimaryText} from './styles';
import db from '../../../db.json';
import {SERVICE_UUID, MESSAGE_UUID} from '../../../constants';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const BLTManager = new BleManager();

export default ({navigation}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [message, setMessage] = useState('No Device');
  const [btStatus, isPending, setBluetooth] = useBluetoothStatus();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function requestPermissions() {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      if (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !==
          PermissionsAndroid.RESULTS.GRANTED ||
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] !==
          PermissionsAndroid.RESULTS.GRANTED ||
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] !==
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        Alert.alert('Permission Bluetooth', 'Requirement for Bluetooth');
      }
    }

    requestPermissions();
  }, []);

  async function scanDevices() {
    try {
      setLoading(true);
      if (!btStatus) {
        await setBluetooth(true);
      }

      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      if (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('scanning');
        BLTManager.startDeviceScan(null, null, (error, scannedDevice) => {
          if (error) {
            console.warn(error);
          }

          if (scannedDevice && scannedDevice.name === 'ESP32-BLE') {
            BLTManager.stopDeviceScan();
            connectDevice(scannedDevice);
          }
        });

        setTimeout(() => {
          BLTManager.stopDeviceScan();
          setLoading(false);
          console.log('Stop scan.');
        }, 5000);
      } else {
        Alert.alert('Permission Bluetooth', 'Requirement for Bluetooth');
        setLoading(false);
      }
    } catch (error) {
      console.warn(error);
      setLoading(false);
    }
  }

  async function disconnectDevice() {
    console.log('Disconnecting start');

    if (connectedDevice != null) {
      const isDeviceConnected = await connectedDevice.isConnected();
      if (isDeviceConnected) {
        BLTManager.cancelTransaction('messagetransaction');
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

  async function sendJsonCommand(command) {
    const jsonMessage = JSON.stringify({command});
    BLTManager.writeCharacteristicWithResponseForDevice(
      connectedDevice?.id,
      SERVICE_UUID,
      MESSAGE_UUID,
      base64.encode(jsonMessage),
    ).then(characteristic => {
      console.log('Command sent:', jsonMessage);
    });
  }

  async function connectDevice(device) {
    console.log('connecting to Device:', device.name);

    device
      .connect()
      .then(device => {
        setConnectedDevice(device);
        setIsConnected(true);
        setLoading(false);
        return device.discoverAllServicesAndCharacteristics();
      })
      .then(device => {
        BLTManager.onDeviceDisconnected(device.id, (error, device) => {
          console.log('Device DC');
          setIsConnected(false);
        });

        device
          .readCharacteristicForService(SERVICE_UUID, MESSAGE_UUID)
          .then(valenc => {
            setMessage(base64.decode(valenc?.value));
          });

        device.monitorCharacteristicForService(
          SERVICE_UUID,
          MESSAGE_UUID,
          (error, characteristic) => {
            if (characteristic?.value != null) {
              const receivedMessage = base64.decode(characteristic.value);
              setMessage(receivedMessage);
              console.log('Message update received: ', receivedMessage);
            }
          },
          'messagetransaction',
        );

        console.log('Connection established');
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }

  return (
    <Container>
      <StatusBar
        backgroundColor={db.theme.colors.statuBar}
        barStyle="light-content"
      />
      <Header>
        <H1>Connect Bluetooth</H1>
      </Header>
      <Animatable.View animation="fadeInUpBig" style={[styleGlobal.footer]}>
        <ScrollView style={styleGlobal.scrollViewSignIn}>
          <PrimaryText>Response: {message}</PrimaryText>
          <View style={{paddingBottom: 30}}></View>
          {!isConnected ? (
            <TouchableOpacity
              disabled={loading}
              style={[
                styleGlobal.signIn,
                {width: '50%', left: '25%', right: '25%'},
                styleGlobal.signInColor,
              ]}
              onPress={() => {
                scanDevices();
              }}>
              <LinearGradient
                colors={[db.theme.colors.primary, db.theme.colors.primary]}
                style={styleGlobal.signIn}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styleGlobal.textBtnSignIn}>Connect</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={false}
              style={[
                styleGlobal.signIn,
                {width: '50%', left: '25%', right: '25%'},
                styleGlobal.signInColor,
              ]}
              onPress={() => {
                disconnectDevice();
              }}>
              <LinearGradient
                colors={[db.theme.colors.primary, db.theme.colors.primary]}
                style={styleGlobal.signIn}>
                <Text style={styleGlobal.textBtnSignIn}>Disconnect</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            disabled={!isConnected}
            style={[
              styleGlobal.signIn,
              {width: '50%', left: '25%', right: '25%', marginTop: 20},
              isConnected
                ? styleGlobal.signInColor
                : styleGlobal.signInDisabled,
            ]}
            onPress={() => {
              sendJsonCommand('ON-AC');
            }}>
            <LinearGradient
              colors={[db.theme.colors.primary, db.theme.colors.primary]}
              style={styleGlobal.signIn}>
              <Text style={styleGlobal.textBtnSignIn}>Send Command</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </Animatable.View>
    </Container>
  );
};
