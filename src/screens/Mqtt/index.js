import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Input, Button} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';
import {host_mqtt, username_mqtt, password_mqtt} from '../../../constants';
import db from '../../../db';

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

client = new Paho.MQTT.Client(options.host, options.port, options.path);

class Mqtt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: 'esp32/acks',
      subscribedTopic: '',
      message: '',
      messageList: [],
      status: '',
    };
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived;
  }

  connect = () => {
    if (client.isConnected()) {
      // Check if already connected
      console.log('Already connected');
      return;
    }

    this.setState({status: 'connecting'}, () => {
      // Use 'connecting' state
      client.connect({
        onSuccess: this.onConnect,
        useSSL: false,
        timeout: 3,
        userName: username_mqtt,
        password: password_mqtt,
        onFailure: this.onFailure,
      });
    });
  };

  onConnect = () => {
    console.log('onConnect');
    this.setState({status: 'connected'});
    this.setState({subscribedTopic: this.state.topic}, () => {
      client.subscribe(this.state.subscribedTopic, {qos: 0});
    });
  };

  onFailure = err => {
    console.log('Connect failed!');
    console.log(err);
    this.setState({status: 'failed'});
  };

  disconnect = () => {
    console.log('Disconnected');
    client.unsubscribe(this.state.subscribedTopic);
    client.disconnect();
    this.setState({
      status: 'disconnected',
      subscribedTopic: '',
      messageList: [],
    }); // Update state
  };

  onConnectionLost = responseObject => {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
      this.setState({status: 'failed'});
    }
  };

  onMessageArrived = message => {
    console.log('onMessageArrived:' + message.payloadString);
    const parsedMessage = JSON.parse(message.payloadString);
    const displayMessage = `Message: "${parsedMessage.message}"`;
    const newMessageList = this.state.messageList;
    newMessageList.unshift(displayMessage);
    this.setState({messageList: newMessageList});
  };

  onChangeMessage = text => {
    this.setState({message: text});
  };

  sendMessage = () => {
    const message = new Paho.MQTT.Message(
      JSON.stringify({client_id: options.id, command: this.state.message}),
    );
    message.destinationName = 'esp32/connect';
    message.retained = false;
    client.send(message);
  };

  renderRow = ({item, index}) => {
    return (
      <View style={styles.messageComponent}>
        <Text style={styles.textMessage}>{item}</Text>
      </View>
    );
  };

  _keyExtractor = (item, index) => item + index;

  render() {
    const {status, messageList} = this.state;
    return (
      <View style={styles.container}>
        <Text
          style={[
            styles.clientIdText,
            {color: this.state.status === 'connected' ? 'green' : 'black'},
          ]}>
          ClientID: {options.id}
        </Text>
        {status === 'connected' ? (
          <View>
            <Button
              type="solid"
              title="DISCONNECT"
              onPress={this.disconnect}
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
            {this.state.subscribedTopic ? (
              <View style={{marginBottom: 30, alignItems: 'center'}}>
                <Input
                  label="MESSAGE"
                  placeholder=""
                  value={this.state.message}
                  onChangeText={this.onChangeMessage}
                />
                <Button
                  type="solid"
                  title="PUBLISH"
                  onPress={this.sendMessage}
                  buttonStyle={{
                    backgroundColor: status === 'failed' ? 'red' : '#397af8',
                    borderRadius: 10,
                  }}
                  icon={{name: 'send', color: 'white'}}
                  disabled={
                    !this.state.message || this.state.message.match(/^[ ]*$/)
                      ? true
                      : false
                  }
                />
              </View>
            ) : null}
          </View>
        ) : (
          <Button
            type="solid"
            title="CONNECT"
            onPress={this.connect}
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
            ref={ref => (this.MessageListRef = ref)}
            data={messageList}
            renderItem={this.renderRow}
            keyExtractor={this._keyExtractor}
            extraData={this.state}
          />
        </View>
      </View>
    );
  }
}

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
