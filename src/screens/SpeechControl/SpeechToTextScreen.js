import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AudioRecord from 'react-native-audio-record';
import RNFS from 'react-native-fs';
import axios from 'axios';
import {PermissionsAndroid} from 'react-native';

const SpeechToTextScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState('');

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

  const startRecording = async () => {
    setIsRecording(true);
    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'test.wav',
    };

    await AudioRecord.init(options);
    AudioRecord.start();
  };

  const stopRecording = async () => {
    setIsRecording(false);
    const audioFile = await AudioRecord.stop();

    // Read the file as base64
    const audioData = await RNFS.readFile(audioFile, 'base64');

    try {
      const response = await axios.post(
        'http://ipconfig:3001/api/speech/transcribe',
        {audio: audioData},
        {headers: {'Content-Type': 'application/json'}},
      );
      setText(response.data);
    } catch (error) {
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
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        onPress={handleMicPress}
        style={{
          padding: 30,
          borderRadius: 100,
          backgroundColor: isRecording ? '#4285F4':'transparent',
          borderColor: isRecording ? 'transparent' : 'black',
          borderWidth: 8,
        }}>
        <Feather
          name="mic"
          size={100}
          color={isRecording ? 'white' : 'black'}
        />
      </TouchableOpacity>
      <Text>{text}</Text>
    </View>
  );
};

export default SpeechToTextScreen;
