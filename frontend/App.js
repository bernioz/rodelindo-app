import { StatusBar } from 'expo-status-bar';
import ParentDashboardScreen from './src/features/dashboard/screens/ParentDashboardScreen';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <ParentDashboardScreen />
    </>
  );
}