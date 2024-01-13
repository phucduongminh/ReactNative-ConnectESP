import React from 'react';
import {View} from 'react-native';
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
            <TextItem>Devices</TextItem>
          </Opcoes>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          onPress={() => props.navigation.navigate('NewDevice')}>
          <Opcoes>
            <MaterialIcons name="settings-remote" size={28} style={{color: 'white'}} />
            <TextItem>New Controller</TextItem>
          </Opcoes>
        </StyledTouchableOpacity>

        {/*<StyledTouchableOpacity
          onPress={() => props.navigation.navigate('Profile')}>
          <Opcoes>
            <MaterialIcons name="person" size={28} style={{color: 'white'}} />
            <TextItem>Profile</TextItem>
          </Opcoes>
        </StyledTouchableOpacity>*/}

        <StyledTouchableOpacity
          onPress={() => props.navigation.navigate('SignIn')}>
          <Opcoes>
            <MaterialIcons name="login" size={28} style={{color: 'white'}} />
            <TextItem>SignIn</TextItem>
          </Opcoes>
        </StyledTouchableOpacity>

        {/*<StyledTouchableOpacity
          onPress={() => props.navigation.navigate('SignUp')}>
          <Opcoes>
            <MaterialIcons
              name="person-add"
              size={28}
              style={{color: 'white'}}
            />
            <TextItem>SignUp</TextItem>
          </Opcoes>
        </StyledTouchableOpacity>*/}

        {/*<StyledTouchableOpacity
          onPress={() => props.navigation.navigate('Historic')}>
          <Opcoes>
            <MaterialIcons name="favorite" size={28} style={{color: 'white'}} />
            <TextItem>Historic</TextItem>
          </Opcoes>
  </StyledTouchableOpacity>*/}

        <StyledTouchableOpacity
          onPress={() => props.navigation.navigate('Preload')}>
          <Opcoes>
            <MaterialIcons name="refresh" size={28} style={{color: 'white'}} />
            <TextItem>Reload</TextItem>
          </Opcoes>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          onPress={() => props.navigation.navigate('ConnectBluetooth')}>
          <Opcoes>
            <MaterialIcons name="bluetooth" size={28} style={{color: 'white'}} />
            <TextItem>ConnectBluetooth</TextItem>
          </Opcoes>
  </StyledTouchableOpacity>

  <StyledTouchableOpacity
          onPress={() => props.navigation.navigate('APMode')}>
          <Opcoes>
            <MaterialIcons name="bluetooth" size={28} style={{color: 'white'}} />
            <TextItem>APMode</TextItem>
          </Opcoes>
  </StyledTouchableOpacity>

      </ViewItem>
    </Container>
  );
};

export default MainDrawer;
