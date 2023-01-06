/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {StackScreenProps} from '@react-navigation/stack';
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
import {WhiteLogo} from '../components/WhiteLogo';
import {useForm} from '../hooks/useForm';
import {loginStyles} from '../theme/loginTheme';
import {AuthContext} from '../context/authContext';

interface Props extends StackScreenProps<any, any> {}

export const RegisterScreen = ({navigation}: Props) => {
  const {singUp, errorMessage, removeError} = useContext(AuthContext);
  const {email, password, name, onChange} = useForm({
    name: '',
    email: '',
    password: '',
  });

  const onRegister = () => {
    singUp({nombre: name, correo: email, password});
    Keyboard.dismiss();
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
      <KeyboardAvoidingView
        style={{flex: 1, backgroundColor: '#5856D6'}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={loginStyles.formContainer}>
          <WhiteLogo />
          <Text style={loginStyles.title}>Registro</Text>
          <Text style={loginStyles.label}>Nombre:</Text>
          <TextInput
            style={[loginStyles.inputField, loginStyles.inputFieldBorder]}
            placeholder="Ingrese su nombre"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="default"
            selectionColor="white"
            autoCapitalize="words"
            onChangeText={value => onChange(value, 'name')}
            value={name}
            onSubmitEditing={onRegister}
          />
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
            onSubmitEditing={onRegister}
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
            onSubmitEditing={onRegister}
          />
          <View style={loginStyles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={loginStyles.button}
              onPress={onRegister}>
              <Text style={loginStyles.buttonText}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.replace('LoginScreen')}
            style={loginStyles.buttonReturn}>
            <Text style={loginStyles.buttonText}>Login </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
