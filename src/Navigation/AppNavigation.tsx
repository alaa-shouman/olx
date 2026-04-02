import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./AppStack";
import { useSelector } from "react-redux";
import AuthStack from "./AuthStack";
import { RootState } from "../redux/store";
import { StatusBar } from "react-native";

const AppNavigation = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    // console.log('isAuthenticated :>> ', isAuthenticated);
    return (
        <NavigationContainer>
            <StatusBar barStyle={"dark-content"} />
            {isAuthenticated ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default AppNavigation;
