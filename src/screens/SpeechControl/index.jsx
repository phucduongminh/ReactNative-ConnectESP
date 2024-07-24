import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AudioRecord from 'react-native-audio-record';
import RNFS, {stat} from 'react-native-fs';
import axios from 'axios';
import {API_URL} from '../../../constants';
import {Container} from './styles';
import {useSelector} from 'react-redux';
import {port} from '../../../constants';

import {useSocketContext} from '../../../SocketContext'; // Assuming you have this context
import dgram from 'react-native-udp'; // Assuming you are using this library for UDP

const SpeechControl = ({mode, Protocol}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState('');
  const {isSocketConnected, isMqtt, client} = useSocketContext();
  const {hostIp} = useSelector(state => state.user.hostIp);
  const {userId} = useSelector(state => state.user.userId);

  const requestRecordAudioPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Record Audio Permission',
          message: 'App needs access to your microphone to record audio.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the microphone');
      } else {
        console.log('Microphone permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestRecordAudioPermission();
  }, []);

  //Bắt đầu ghi âm thanh
  const startRecording = async () => {
    setIsRecording(true);
    const options = {
      sampleRate: 16000, //16000 Hz, âm thanh được lấy mẫu 16000 lần mỗi giây
      channels: 1, //Kênh đơn, dành cho âm thanh đơn âm
      bitsPerSample: 16, //Tiêu chuẩn cho âm thanh chất lượng cao
      wavFile: 'audio.wav', //File .wav với chất lượng âm thanh cao.
    };

    await AudioRecord.init(options);
    AudioRecord.start();
  };

  //Dừng ghi âm và gửi file âm thanh lên server
  const stopRecording = async () => {
    setIsRecording(false);
    const audioFile = await AudioRecord.stop(); //File audio được lưu lại

    //Đọc file âm thanh và encode với base64 để gửi lên server
    const audioData = await RNFS.readFile(audioFile, 'base64');

    try {
      const response = await axios.post(
        `${API_URL}/api/speech/transcribe`,
        {audio: audioData},
        {headers: {'Content-Type': 'application/json'}},
      );
      setText(response.data.text);
      const res = await axios.post(
        `${API_URL}/api/voice/process`,
        {text: response.data.text},
        {headers: {'Content-Type': 'application/json'}},
      );
      if (res.data.success) {
        const signalToSend = {
          command: res.data.data.command,
          user_id: userId,
          ordinal: res.data.data.ordinal || 1,
          mode: mode.toString(),
          ...(isMqtt && {client_id: 'app-01'}), //
          ...(res.data.data.hour && {hour: res.data.data.hour}),
          ...(Protocol && {Protocol: Protocol}),
          //...(res.data.data.hour && {minute: 0}),
        };

        const jsonString = JSON.stringify(signalToSend);
        console.log('Sending JSON object to server:', jsonString);
        if (isSocketConnected) {
          const socket = dgram.createSocket('udp4');

          socket.bind(port);
          socket.once('listening', function () {
            socket.send(
              jsonString,
              undefined,
              undefined,
              port,
              hostIp,
              function (err) {
                if (err) {
                  throw err;
                }
                console.log('Sent JSON object to server:', hostIp);
                //socket.close();
              },
            );
            socket.on('message', function (msg, rinfo) {
              var buffer = {
                data: msg.toString(),
              };
              console.log('data.data', buffer.data);
              if (buffer.data !== 'NETWORK-ERR') {
                console.log('data.data', buffer.data);
                socket.close();
              }
              if (buffer.data === 'NETWORK-ERR') {
                alert('Server is not available!');
              }
              if (buffer.data === 'INVALID-CMD') {
                alert('Invalid command!');
              }
            });
          });
        } else if (isMqtt) {
          const request = new Paho.MQTT.Message(jsonString);
          request.destinationName = 'esp32/request';
          request.retained = false;
          client.send(request);
          client.onMessageArrived = message => {
            const parsedMessage = JSON.parse(message.payloadString);
            if (parsedMessage.message === 'NETWORK-ERR') {
              alert('Server is not available!');
            }
            if (parsedMessage.message === 'INVALID-CMD') {
              alert('Invalid command!');
            }
          };
        }
      } else {
        Alert.alert('Try again!');
      }
    } catch (error) {
      Alert.alert('Try again!');
      console.error('Error making network request', error);
    }
  };

  const handleMicPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Container>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={handleMicPress}
          style={{
            padding: 30,
            borderRadius: 100,
            backgroundColor: isRecording ? '#4083ef' : 'transparent',
            borderColor: isRecording ? 'transparent' : 'black',
            borderWidth: 8,
          }}>
          <Feather
            name="mic"
            size={80}
            color={isRecording ? 'white' : 'black'}
          />
        </TouchableOpacity>
        <Text style={{fontSize: 24, marginTop: 20, color: '#4285F4'}}>
          {text}
        </Text>
      </View>
    </Container>
  );
};

export default SpeechControl;
