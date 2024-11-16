import React from 'react';
import { useStore } from '../store';
import { AddPaymentMethodModal } from './modals/AddPaymentMethodModal';
import { AddProviderModal } from './modals/AddProviderModal';
import { AddSubscriptionDurationModal } from './modals/AddSubscriptionDurationModal';
import PaymentMethods from './PaymentMethods';
import NetworkProviders from './NetworkProviders';
import SubscriptionDurations from './SubscriptionDurations';

export function Settings() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Paramètres Généraux</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email de contact
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <PaymentMethods />
      <NetworkProviders />
      <SubscriptionDurations />

      <AddPaymentMethodModal />
      <AddProviderModal />
      <AddSubscriptionDurationModal />
    </div>
  );
}