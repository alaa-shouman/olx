import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screen/Auth/Login';
import Roles from '../Screen/Auth/Signup/Roles';
import DoctorSignupStack from './DoctorSignupStack';
import PharmacySignup from './PharmacySignup';
import PatientSignupStack from './PatientSignupStack';
import ForgotPassword from '../Screen/Auth/ForgotPassword';
import ResetPassword from '../Screen/Auth/ResetPassword';
const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            animation: 'slide_from_right',
            animationDuration: 3000
        }}>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SignupRole"
                component={Roles}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DoctorSignupStack"
                component={DoctorSignupStack}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PharmacySignup"
                component={PharmacySignup}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PatientSignup"
                component={PatientSignupStack}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ResetPassword"
                component={ResetPassword}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default AuthStack;