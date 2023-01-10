import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'http://192.168.1.11:8080/api';

const cafeApi = axios.create({baseURL});

//middelwere axios
cafeApi.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    config.headers['x-token'] = token;
  }

  return config;
});

export default cafeApi;
