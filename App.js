/* eslint-disable prettier/prettier */
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {ThemeProvider} from 'styled-components';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';

import MainDrawer from './src/stacks/MainDrawer';
import Preload from './src/screens/Preload';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import Historic from './src/screens/Historic';
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';
import NewHardware from './src/screens/NewHardware';
import Brands from './src/screens/Brands';
import ACBrands from './src/screens/ACBrands';
import Devices from './src/screens/Devices';
import Control from './src/screens/Control';
import ACControl from './src/screens/ACControl';
import ConnectBluetooth from './src/screens/ConnectBluetooth';
import APMode from './src/screens/APMode';
import LearnSignal from './src/screens/LearnSignal';
import SpeechControl from './src/screens/SpeechControl';
import {SocketProvider} from './SocketContext';
import theme from './theme';
import {useSelector} from 'react-redux';
import UserDevices from './src/screens/UserDevices';
import DeviceTypes from './src/screens/DeviceTypes';
import ACLearnSignal from './src/screens/ACLearnSignal';

const navOptionHandler = () => ({
  headerShown: false,
});

const Drawer = createDrawerNavigator();
function DrawerNavigator({navigation}) {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={() => <MainDrawer navigation={navigation} />}>
      <Drawer.Screen name="Preload" component={Preload} />
      <Drawer.Screen name="Historic" component={Historic} />
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="NewHardware" component={NewHardware} />
      <Drawer.Screen name="Brands" component={Brands} />
      <Drawer.Screen name="ACBrands" component={ACBrands} />
      <Drawer.Screen name="Devices" component={Devices} />
      <Drawer.Screen name="Control" component={Control} />
      <Drawer.Screen name="ACControl" component={ACControl} />
      <Drawer.Screen name="ConnectBluetooth" component={ConnectBluetooth} />
      <Drawer.Screen name="APMode" component={APMode} />
      <Drawer.Screen name="LearnSignal" component={LearnSignal} />
      <Drawer.Screen name="ACLearnSignal" component={ACLearnSignal} />
      <Drawer.Screen name="UserDevices" component={UserDevices} />
      <Drawer.Screen name="DeviceTypes" component={DeviceTypes} />
      <Drawer.Screen name="SpeechControl" component={SpeechControl} />
    </Drawer.Navigator>
  );
}

const StackApp = createStackNavigator();
function MainStack({navigation}) {
  const {user} = useSelector(state => state.user.user);
  return (
    <StackApp.Navigator screenOptions={{headerShown: false}}>
      {user && (
        <StackApp.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={navOptionHandler}
        />
      )}
      <StackApp.Screen name="SignIn" component={SignIn} />
      <StackApp.Screen name="SignUp" component={SignUp} />
      {/* {!user && <StackApp.Screen name="SignIn" component={SignIn} />}
      {!user && <StackApp.Screen name="SignUp" component={SignUp} />} */}
    </StackApp.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <ThemeProvider theme={theme.dark}>
          <NavigationContainer>
            <MainStack />
          </NavigationContainer>
        </ThemeProvider>
      </SocketProvider>
    </Provider>
  );
}
