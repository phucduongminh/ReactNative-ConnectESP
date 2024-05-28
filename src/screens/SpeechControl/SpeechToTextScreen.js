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
      wavFile: 'audio.wav',
    };

    await AudioRecord.init(options);
    AudioRecord.start();
  };

  const stopRecording = async () => {
    const audioFile = await AudioRecord.stop();

    // Read the file as base64
    const audioBase64 = await RNFS.readFile(audioFile, 'base64');

    // Create a blob from the base64 string
    const audioBlob = {
      uri: `data:audio/wav;base64,${audioBase64}`,
      type: 'audio/wav',
      name: 'audio.wav',
    };

    const data = new FormData();
    data.append('audio', audioBlob, 'audio.wav');
    const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

    try {
      const response = await axios.post(
        'http://same_with_ipconfig:3001/api/speech/transcribe',
        {gcsUri: gcsUri},
      );
      setText(JSON.stringify(response));
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
