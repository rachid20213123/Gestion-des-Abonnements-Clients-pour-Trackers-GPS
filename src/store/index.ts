import { create } from 'zustand';
import type { State, Actions } from './types';
import { initialData } from './initialData';

export const useStore = create<State & Actions>((set) => ({
  // État initial
  ...initialData as State,
  currentSection: 'dashboard',
  modals: {
    addClientModal: false,
    editClientModal: false,
    addInstallerModal: false,
    editInstallerModal: false,
    // ... autres modals
  },

  // Actions
  setCurrentSection: (section) => set({ currentSection: section }),
  openModal: (modalName) => set((state) => ({
    modals: { ...state.modals, [modalName]: true }
  })),
  closeModal: (modalName) => set((state) => ({
    modals: { ...state.modals, [modalName]: false }
  })),

  // Actions pour les clients
  addClient: (client) => set((state) => ({
    clients: [...state.clients, { ...client, id: Date.now() }]
  })),
  editClient: (id, data) => set((state) => ({
    clients: state.clients.map(client => 
      client.id === id ? { ...client, ...data } : client
    )
  })),
  deleteClient: (id) => set((state) => ({
    clients: state.clients.filter(client => client.id !== id)
  })),

  // Actions pour les installateurs
  addInstaller: (installer) => set((state) => ({
    installers: [...state.installers, { ...installer, id: Date.now() }]
  })),
  editInstaller: (id, data) => set((state) => ({
    installers: state.installers.map(installer => 
      installer.id === id ? { ...installer, ...data } : installer
    )
  })),
  deleteInstaller: (id) => set((state) => ({
    installers: state.installers.filter(installer => installer.id !== id)
  })),

  // Actions pour les villes
  addCity: (city) => set((state) => ({
    cities: [...state.cities, { ...city, id: Date.now() }]
  })),
  editCity: (id, data) => set((state) => ({
    cities: state.cities.map(city => 
      city.id === id ? { ...city, ...data } : city
    )
  })),
  deleteCity: (id) => set((state) => ({
    cities: state.cities.filter(city => city.id !== id)
  })),

  // Actions pour les dispositifs
  addDevice: (device) => set((state) => ({
    devices: [...state.devices, { ...device, id: Date.now() }]
  })),
  editDevice: (id, data) => set((state) => ({
    devices: state.devices.map(device => 
      device.id === id ? { ...device, ...data } : device
    )
  })),
  deleteDevice: (id) => set((state) => ({
    devices: state.devices.filter(device => device.id !== id)
  })),

  // Actions pour les paiements
  addPayment: (payment) => set((state) => ({
    payments: [...state.payments, { ...payment, id: Date.now() }]
  })),
  editPayment: (id, data) => set((state) => ({
    payments: state.payments.map(payment => 
      payment.id === id ? { ...payment, ...data } : payment
    )
  })),
  deletePayment: (id) => set((state) => ({
    payments: state.payments.filter(payment => payment.id !== id)
  })),

  // Actions pour les abonnements
  addSubscription: (subscription) => set((state) => ({
    subscriptions: [...state.subscriptions, { ...subscription, id: Date.now() }]
  })),
  editSubscription: (id, data) => set((state) => ({
    subscriptions: state.subscriptions.map(subscription => 
      subscription.id === id ? { ...subscription, ...data } : subscription
    )
  })),
  deleteSubscription: (id) => set((state) => ({
    subscriptions: state.subscriptions.filter(subscription => subscription.id !== id)
  })),

  // Actions pour les factures
  addInvoice: (invoice) => set((state) => ({
    invoices: [...state.invoices, invoice]
  })),
  editInvoice: (id, data) => set((state) => ({
    invoices: state.invoices.map(invoice => 
      invoice.id === id ? { ...invoice, ...data } : invoice
    )
  })),
  deleteInvoice: (id) => set((state) => ({
    invoices: state.invoices.filter(invoice => invoice.id !== id)
  }))
}));