/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect} from 'react';
import {
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Keyboard,
  TextInput,
  Alert,
} from 'react-native';
import {Background} from '../components/Background';
import {WhiteLogo} from '../components/WhiteLogo';
import {useForm} from '../hooks/useForm';
import {loginStyles} from '../theme/loginTheme';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthContext} from '../context/authContext';

interface Props extends StackScreenProps<any, any> {}

export const LoginScreen = ({navigation}: Props) => {
  const {signIn, errorMessage, removeError} = useContext(AuthContext);

  const {email, password, onChange} = useForm({
    email: '',
    password: '',
  });

  const onLogin = () => {
    console.log({email, password});
    Keyboard.dismiss();
    signIn({correo: email, password});
  };

  useEffect(() => {
    if (errorMessage.length === 0) {
      return;
    }

    Alert.alert('Login incorrecto', errorMessage, [
      {
        text: 'Ok',
        onPress: removeError,
      },
    ]);
  }, [errorMessage]);

  return (
    <>
      <Background />

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={loginStyles.formContainer}>
          <WhiteLogo />
          <Text style={loginStyles.title}>Login</Text>
          <Text style={loginStyles.label}>Email</Text>
          <TextInput
            style={[loginStyles.inputField, loginStyles.inputFieldBorder]}
            placeholder="Ingrese su Email"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="email-address"
            selectionColor="white"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={value => onChange(value, 'email')}
            value={email}
            onSubmitEditing={onLogin}
          />
          <Text style={loginStyles.label}>Password</Text>
          <TextInput
            style={[loginStyles.inputField, loginStyles.inputFieldBorder]}
            placeholder="*****"
            placeholderTextColor="rgba(255,255,255,0.4)"
            selectionColor="white"
            autoCapitalize="none"
            secureTextEntry={true}
            autoCorrect={false}
            onChangeText={value => onChange(value, 'password')}
            value={password}
            onSubmitEditing={onLogin}
          />
          <View style={loginStyles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={loginStyles.button}
              onPress={onLogin}>
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={loginStyles.newUserContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.replace('RegisterScreen')}>
              <Text style={loginStyles.buttonText}>Nueva cuenta </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
