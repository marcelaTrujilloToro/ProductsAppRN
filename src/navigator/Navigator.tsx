import React from 'react';
import {LoginScreen} from '../pages/LoginScreen';
import {createStackNavigator} from '@react-navigation/stack';

import {RegisterScreen} from '../pages/RegisterScreen';
import {ProtectedScreen} from '../pages/ProtectedScreen';

const Stack = createStackNavigator();

export const Navigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Protected" component={ProtectedScreen} />
    </Stack.Navigator>
  );
};
