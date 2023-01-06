import React, {useContext} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {AuthContext} from '../context/authContext';

export const ProtectedScreen = () => {
  const {user, token, logOut} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ProtectedScreen</Text>
      <Button title="Logout" color="#5856d6" onPress={logOut} />
      <Text>{JSON.stringify(user, null, 5)}</Text>
      <Text>{token}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justityContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
