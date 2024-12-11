import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import MainAppScreen from '../screens/MainAppScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PromotionsScreen from '../screens/PromotionsScreen';
import CustomHeader from '../components/CustomHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import PromotionDetailScreen from '../screens/PromotionDetailScreen';
import { Promotion, TouristPoint } from '../redux/types/types';
import { getMemoizedAccessToken } from '../redux/selectors/userSelectors';
import LandingPage from '../screens/LandingPage';



export type RootStackParamList = {
  MainAppScreen: undefined;
  Landing: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Profile: undefined;
  FavoritesScreen: undefined;
  PromotionsScreen: undefined;
  ResetPassword: undefined;
  PromotionDetail: { promotion: Promotion };
  TouristDetailScreen: { touristPoint: TouristPoint };
  MainTabs: { screen: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const accessToken = useSelector(getMemoizedAccessToken);
  const isAuthenticated = !!accessToken;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "MainAppScreen" : "Landing"} screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Landing" component={LandingPage} />
            <Stack.Screen name="Login" component={LoginScreen} />
            {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="MainAppScreen"
              component={MainAppScreen}
              options={{
                headerShown: true,
                header: () => <CustomHeader />
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerShown: false,
                headerTitle: 'Perfil',
                headerStyle: { backgroundColor: 'rgb(0, 122, 140)' },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen
              name="PromotionDetail"
              component={PromotionDetailScreen}
              options={{
                headerShown: false,
                headerTitle: "Detalles",
                headerStyle: { backgroundColor: 'rgb(0, 122, 140)' },
                headerTintColor: '#fff',
              }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

