import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData } from '../redux/types/types';

const USER_DATA_KEY = 'userData';
const USER_TOKEN_KEY = 'userToken';


export interface UserStorageData {
  user: UserData | null;
  token: string;
}

export const saveUserData = async (userStorageData: UserStorageData) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userStorageData.user));
    await AsyncStorage.setItem(USER_TOKEN_KEY, userStorageData.token);
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const getUserData = async (): Promise<UserStorageData | null> => {
  try {
    const userDataJson = await AsyncStorage.getItem(USER_DATA_KEY);
    const token = await AsyncStorage.getItem(USER_TOKEN_KEY);
    if (userDataJson && token) {
      return { user: JSON.parse(userDataJson), token };
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
    await AsyncStorage.removeItem(USER_TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};
