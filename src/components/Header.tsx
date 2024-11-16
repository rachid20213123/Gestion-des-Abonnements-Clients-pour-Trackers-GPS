import React from 'react';
import { useStore } from '../store';

const sectionLabels = {
  dashboard: 'Tableau de Bord',
  clients: 'Gestion des Clients',
  installers: 'Gestion des Installateurs',
  devices: 'Gestion des Dispositifs GPS',
  deviceModels: 'Modèle tracker GPS',
  installations: 'Gestion des Installations',
  cities: 'Gestion des Villes',
  interventionTypes: 'Types d\'intervention',
  settings: 'Paramétrage',
  cars: 'Gestion des Voitures',
  interventions: 'Gestion des Interventions',
  payments: 'Gestion des Paiements',
  paymentHistory: 'Historique des Paiements',
  subscriptions: 'Gestion des Abonnements',
  billing: 'Facturation'
};

export function Header() {
  const currentSection = useStore((state) => state.currentSection);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          {sectionLabels[currentSection as keyof typeof sectionLabels]}
        </h1>
      </div>
    </header>
  );
}