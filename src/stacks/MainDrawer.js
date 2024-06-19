import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Container,
  ViewItem,
  TextItem,
  Opcoes,
  StyledTouchableOpacity,
} from '../stacks/styles';

const MainDrawer = props => {
  return (
    <Container>
      <ViewItem>
        <StyledTouchableOpacity
          onPress={() => props.navigation.navigate('Home')}>
          <Opcoes>
            <MaterialIcons name="home" size={28} style={{color: 'white'}} />
            <TextItem>Home</TextItem>
          </Opcoes>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          onPress={() => props.navigation.navigate('Devices')}>
          <Opcoes>
            <MaterialIcons name="devices" size={28} style={{color: 'white'}} />
            <TextItem>Available Devices</TextItem>
          </Opcoes>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          onPress={() => props.navigation.navigate('UserDevices')}>
          <Opcoes>
            <MaterialIcons
              name="broadcast-on-personal"
              size={28}
              style={{color: 'white'}}
            />
            <TextItem>My Home Devices</TextItem>
          </Opcoes>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          onPress={() => props.navigation.navigate('NewHardware')}>
          <Opcoes>
            <MaterialIcons
              name="settings-remote"
              size={28}
              style={{color: 'white'}}
            />
            <TextItem>New Hardware</TextItem>
          </Opcoes>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          onPress={() => props.navigation.navigate('ConnectBluetooth')}>
          <Opcoes>
            <MaterialIcons
              name="bluetooth"
              size={28}
              style={{color: 'white'}}
            />
            <TextItem>ConnectBluetooth</TextItem>
          </Opcoes>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          onPress={() => props.navigation.navigate('APMode')}>
          <Opcoes>
            <MaterialIcons name="login" size={28} style={{color: 'white'}} />
            <TextItem>APMode</TextItem>
          </Opcoes>
        </StyledTouchableOpacity>

        {/* <StyledTouchableOpacity
          onPress={() => props.navigation.navigate('TimerScript')}>
          <Opcoes>
            <MaterialIcons name="mic" size={28} style={{color: 'white'}} />
            <TextItem>Voice Control</TextItem>
          </Opcoes>
        </StyledTouchableOpacity> */}

        <StyledTouchableOpacity
          onPress={() => props.navigation.navigate('Preload')}>
          <Opcoes>
            <MaterialIcons name="refresh" size={28} style={{color: 'white'}} />
            <TextItem>Sign Out</TextItem>
          </Opcoes>
        </StyledTouchableOpacity>
      </ViewItem>
    </Container>
  );
};

export default MainDrawer;
