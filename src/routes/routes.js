import React, { useContext, useEffect } from 'react'
import { StatusBar } from 'react-native'
import { ThemeContext } from 'styled-components'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { CardStyleInterpolators } from '@react-navigation/stack'
import changeNavigationBarColor from 'react-native-navigation-bar-color'

import Brands from '../screens/Brands'
import Devices from '../screens/Devices'
import Control from '../screens/Control'

import Back from './Back'
import Toggle from './Toggle'

const Stack = createNativeStackNavigator()

export default function Routes () {
  const theme = useContext(ThemeContext)

  useEffect(() => {
    changeNavigationBarColor('#171822', true)
  }, [])

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={theme.colors.background}
        // barStyle='dark-content'
        barStyle='light-content'
      />

      <Stack.Navigator
        initialRouteName='Devices'
        screenOptions={{
          headerStyle: {
            elevation: 0,
            backgroundColor: theme.colors.background
          },
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text
          },
          headerTitleAlign: 'center',
          headerBackImage: Back,
          headerTintColor: theme.colors.text,
          headerPressColorAndroid: theme.colors.ripple,
          headerRight: Toggle,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
      >
        <Stack.Screen
          name='Devices'
          component={Devices}
          options={{ title: 'Devices' }}
        />
        <Stack.Screen
          name='Brands'
          component={Brands}
          options={{ title: 'Brands' }}
        />
        <Stack.Screen
          name='Control'
          component={Control}
          options={{ title: 'Control' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
