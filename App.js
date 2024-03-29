/* eslint-disable prettier/prettier */
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { ThemeProvider } from 'styled-components'

import MainDrawer from './src/stacks/MainDrawer';
import Preload from './src/screens/Preload';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import Historic from './src/screens/Historic';
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';
import NewDevice from './src/screens/NewDevice';
import Brands from './src/screens/Brands'
import ACBrands from './src/screens/ACBrands'
import Devices from './src/screens/Devices'
import Control from './src/screens/Control'
import ACControl from './src/screens/ACControl'
import ConnectBluetooth from './src/screens/ConnectBluetooth';
import { SocketProvider } from './SocketContext';
import theme from './theme'

const navOptionHandler = () => ({
  headerShown: false,
});

const Drawer = createDrawerNavigator();
function DrawerNavigator({navigation}) {
  return (
    <Drawer.Navigator
      initialRouteName="Preload"
      drawerContent={
        () => <MainDrawer navigation={navigation} />
      }>
      <Drawer.Screen name="Preload" component={Preload} />
      <Drawer.Screen name="SignIn" component={SignIn} />
      <Drawer.Screen name="SignUp" component={SignUp} />
      <Drawer.Screen name="Historic" component={Historic} />
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="NewDevice" component={NewDevice} />
      <Drawer.Screen name="Brands" component={Brands} />
      <Drawer.Screen name="ACBrands" component={ACBrands} />
      <Drawer.Screen name="Devices" component={Devices} />
      <Drawer.Screen name="Control" component={Control} />
      <Drawer.Screen name="ACControl" component={ACControl} />
      <Drawer.Screen name="ConnectBluetooth" component={ConnectBluetooth} />
    </Drawer.Navigator>
  );
}

const StackApp = createStackNavigator();
function StackNavigator({navigation}) {
  return (
    <StackApp.Navigator initialRouteName="Preload">
      <StackApp.Screen
        name="Drawer"
        component={DrawerNavigator}
        options={navOptionHandler}
      />
    </StackApp.Navigator>
  );
}

export default function App() {
  return (
    <SocketProvider>
    <ThemeProvider theme={theme.dark}>
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
    </ThemeProvider>
    </SocketProvider>
  );
}