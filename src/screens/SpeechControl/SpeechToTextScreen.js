import React, {useState, useEffect} from 'react';
import {Button, Text} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import RNFS from 'react-native-fs';
import axios from 'axios';
import {PermissionsAndroid} from 'react-native';

const SpeechToTextScreen = () => {
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
    const audioFile = await AudioRecord.stop();

    // Read the file as base64
    const audioData = await RNFS.readFile(audioFile, 'base64');

    try {
      const response = await axios.post(
        'http://ipconfig:3001/api/speech/transcribe', // Use your local IP address
        {audio: audioData},
        {headers: {'Content-Type': 'application/json'}},
      );
      setText(response.data); // Ensure to use response.data to get the response body
    } catch (error) {
      console.error('Error making network request', error);
    }
  };

  return (
    <>
      <Button title="Start Recording" onPress={startRecording} />
      <Button title="Stop Recording" onPress={stopRecording} />
      <Text>{text}</Text>
    </>
  );
};

export default SpeechToTextScreen;
