import React from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Clients } from './components/Clients';
import { Installers } from './components/Installers';
import { Devices } from './components/Devices';
import { DeviceModels } from './components/DeviceModels';
import { Installations } from './components/Installations';
import { Settings } from './components/Settings';
import { Cities } from './components/Cities';
import { InterventionTypes } from './components/InterventionTypes';
import { Cars } from './components/Cars';
import { Interventions } from './components/Interventions';
import { Payments } from './components/Payments';
import { PaymentHistory } from './components/PaymentHistory';
import { Subscriptions } from './components/Subscriptions';
import { Billing } from './components/Billing';
import { useStore } from './store';

function App() {
  const currentSection = useStore((state) => state.currentSection);

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <Clients />;
      case 'installers':
        return <Installers />;
      case 'devices':
        return <Devices />;
      case 'deviceModels':
        return <DeviceModels />;
      case 'installations':
        return <Installations />;
      case 'settings':
        return <Settings />;
      case 'cities':
        return <Cities />;
      case 'interventionTypes':
        return <InterventionTypes />;
      case 'cars':
        return <Cars />;
      case 'interventions':
        return <Interventions />;
      case 'payments':
        return <Payments />;
      case 'paymentHistory':
        return <PaymentHistory />;
      case 'subscriptions':
        return <Subscriptions />;
      case 'billing':
        return <Billing />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
}

export default App;