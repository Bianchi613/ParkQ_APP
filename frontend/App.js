import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importando as telas
import Home from './src/components/Home/Home';
import Register from './src/components/Register/Register';
import Login from './src/components/Login/Login';
import ForgotPassword from './src/components/ForgotPassword/ForgotPassword';
import ClientDashboard from './src/components/ClientDashboard/ClientDashboard';
import ProfileSettings from './src/components/ProfileSettings/ProfileSettings';
import Reservation from './src/components/Reservation/Reservation';
import Payment from './src/components/Payment/Payment';
import AdminDashboard from './src/components/AdminDashboard/AdminDashboard';
import TariffPlan from './src/components/TariffPlan/TariffPlan';
import ParkingManagement from './src/components/ParkingManagement/ParkingManagement';

// Criando o Stack Navigator
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ClientDashboard" component={ClientDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="TariffPlan" component={TariffPlan} />
        <Stack.Screen name="ProfileSettings" component={ProfileSettings} />
        <Stack.Screen name="Reservation" component={Reservation} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="ParkingManagement" component={ParkingManagement} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
