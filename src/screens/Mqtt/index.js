import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Input, Button} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';
import {host_mqtt, username_mqtt, password_mqtt} from '../../../constants';
import db from '../../../db';
import {useSocketContext} from '../../../SocketContext';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});
const options = {
  host: host_mqtt,
  port: 8083,
  path: '/',
  id: 'app-01',
};

const client = new Paho.MQTT.Client(options.host, options.port, options.path);

const Mqtt = () => {
  const [topic, setTopic] = useState('esp32/response');
  const [subscribedTopic, setSubscribedTopic] = useState('');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [status, setStatus] = useState('');
  const {setIsMqtt, setClient} = useSocketContext();

  useEffect(() => {
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
  }, []);

  const connect = useCallback(() => {
    if (client.isConnected()) {
      console.log('Already connected');
      return;
    }

    setStatus('connecting');
    client.connect({
      onSuccess: onConnect,
      useSSL: false,
      timeout: 3,
      userName: username_mqtt,
      password: password_mqtt,
      onFailure: onFailure,
    });
  }, []);

  const onConnect = () => {
    console.log('onConnect');
    setStatus('connected');
    setIsMqtt(true);
    setClient(client);
    setSubscribedTopic(topic);
    client.subscribe(topic, {qos: 0});
  };

  const onFailure = err => {
    console.log('Connect failed!');
    console.log(err);
    setStatus('failed');
    setIsMqtt(false);
    setClient(null);
  };

  const disconnect = () => {
    console.log('Disconnected');
    client.unsubscribe(subscribedTopic);
    client.disconnect();
    setStatus('disconnected');
    setSubscribedTopic('');
    setMessageList([]);
    setIsMqtt(false);
    setClient(null);
  };

  const onConnectionLost = responseObject => {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
      setStatus('failed');
    }
  };

  const onMessageArrived = message => {
    console.log('onMessageArrived:' + message.payloadString);
    const parsedMessage = JSON.parse(message.payloadString);
    const displayMessage = `Message: "${parsedMessage.message}"`;
    setMessageList(prevMessageList => [displayMessage, ...prevMessageList]);
  };

  const sendMessage = () => {
    const msg = new Paho.MQTT.Message(
      JSON.stringify({client_id: options.id, command: message}),
    );
    msg.destinationName = 'esp32/request';
    msg.retained = false;
    client.send(msg);
  };

  const renderRow = ({item}) => {
    return (
      <View style={styles.messageComponent}>
        <Text style={styles.textMessage}>{item}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.clientIdText,
          {color: status === 'connected' ? 'green' : 'black'},
        ]}>
        ClientID: {options.id}
      </Text>
      {status === 'connected' ? (
        <View>
          <Button
            type="solid"
            title="DISCONNECT"
            onPress={disconnect}
            buttonStyle={[
              styles.connectButton,
              {backgroundColor: db.theme.colors.primary},
            ]}
            icon={{
              name: 'lan-disconnect',
              type: 'material-community',
              color: 'white',
            }}
          />
          {subscribedTopic ? (
            <View style={{marginBottom: 30, alignItems: 'center'}}>
              <Input
                label="MESSAGE"
                placeholder=""
                value={message}
                onChangeText={setMessage}
              />
              <Button
                type="solid"
                title="PUBLISH"
                onPress={sendMessage}
                buttonStyle={{
                  backgroundColor: status === 'failed' ? 'red' : '#397af8',
                  borderRadius: 10,
                }}
                icon={{name: 'send', color: 'white'}}
                disabled={!message || message.match(/^[ ]*$/) ? true : false}
              />
            </View>
          ) : null}
        </View>
      ) : (
        <Button
          type="solid"
          title="CONNECT"
          onPress={connect}
          buttonStyle={[
            styles.connectButton,
            {
              backgroundColor:
                status === 'failed' ? 'red' : db.theme.colors.primary,
            },
          ]}
          icon={{
            name: 'lan-connect',
            type: 'material-community',
            color: 'white',
          }}
          loading={status === 'connecting'}
          disabled={status === 'connecting'}
        />
      )}
      <View style={styles.messageBox}>
        <FlatList
          data={messageList}
          renderItem={renderRow}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
  },
  clientIdText: {
    marginBottom: 50,
    textAlign: 'center',
  },
  connectButton: {
    marginBottom: 50,
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    fontSize: 18,
    alignSelf: 'center',
  },
  messageBox: {
    margin: 16,
    flex: 1,
  },
  messageComponent: {
    marginBottom: 5,
    backgroundColor: '#0075e2',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#004a99',
  },
  textMessage: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Mqtt;
