import type { State } from './types';

export const initialData: Partial<State> = {
  currentSection: 'dashboard',
  modals: {},
  
  // Clients par défaut
  clients: [
    {
      id: 1,
      name: 'Ahmed Alami',
      email: 'ahmed.alami@email.com',
      phone: '0661234567',
      status: 'active'
    },
    {
      id: 2,
      name: 'Fatima Benani',
      email: 'fatima.benani@email.com',
      phone: '0662345678',
      status: 'active'
    },
    {
      id: 3,
      name: 'Karim Idrissi',
      email: 'karim.idrissi@email.com',
      phone: '0663456789',
      status: 'active'
    }
  ],

  // Voitures par défaut
  cars: [
    {
      id: 1,
      brand: 'Dacia',
      model: 'Logan',
      licensePlate: '12345-A-1',
      clientId: 1,
      status: 'active'
    },
    {
      id: 2,
      brand: 'Renault',
      model: 'Clio',
      licensePlate: '23456-B-2',
      clientId: 2,
      status: 'active'
    },
    {
      id: 3,
      brand: 'Peugeot',
      model: '208',
      licensePlate: '34567-C-3',
      clientId: 3,
      status: 'active'
    }
  ],

  // Dispositifs GPS par défaut
  devices: [
    {
      id: 1,
      imei: '123456789012345',
      modelId: 1,
      providerId: 1,
      status: 'active'
    },
    {
      id: 2,
      imei: '234567890123456',
      modelId: 2,
      providerId: 2,
      status: 'active'
    },
    {
      id: 3,
      imei: '345678901234567',
      modelId: 1,
      providerId: 1,
      status: 'inactive'
    }
  ],

  // Modèles de dispositifs par défaut
  deviceModels: [
    {
      id: 1,
      name: 'GPS Tracker Pro',
      description: 'Modèle professionnel avec suivi en temps réel',
      features: ['GPS', 'GSM', 'Batterie longue durée'],
      status: 'active'
    },
    {
      id: 2,
      name: 'GPS Tracker Lite',
      description: 'Version économique pour usage standard',
      features: ['GPS', 'GSM'],
      status: 'active'
    }
  ],

  // Fournisseurs réseau par défaut
  providers: [
    {
      id: 1,
      name: 'Orange',
      status: 'active'
    },
    {
      id: 2,
      name: 'Maroc Telecom',
      status: 'active'
    },
    {
      id: 3,
      name: 'Inwi',
      status: 'active'
    }
  ],

  // Installations par défaut
  installations: [
    {
      id: 1,
      clientId: 1,
      installerId: 1,
      deviceId: 1,
      date: '2024-03-15',
      status: 'completed'
    },
    {
      id: 2,
      clientId: 2,
      installerId: 2,
      deviceId: 2,
      date: '2024-03-16',
      status: 'pending'
    }
  ],

  // Interventions par défaut
  interventions: [
    {
      id: 1,
      date: '2024-03-15',
      carId: 1,
      typeId: 1,
      installerId: 1,
      status: 'completed',
      notes: 'Installation standard effectuée'
    },
    {
      id: 2,
      date: '2024-03-16',
      carId: 2,
      typeId: 2,
      installerId: 2,
      status: 'pending',
      notes: 'Maintenance programmée'
    }
  ],

  // Types d'intervention par défaut
  interventionTypes: [
    {
      id: 1,
      name: 'Installation Standard',
      description: 'Installation complète avec configuration',
      duration: 60,
      price: 500,
      status: 'active'
    },
    {
      id: 2,
      name: 'Maintenance',
      description: 'Vérification et mise à jour',
      duration: 30,
      price: 300,
      status: 'active'
    }
  ],

  // Installateurs par défaut
  installers: [
    {
      id: 1,
      name: 'Hassan Tazi',
      city: 'Casablanca',
      cityId: 1,
      installations: 25
    },
    {
      id: 2,
      name: 'Youssef Mansouri',
      city: 'Rabat',
      cityId: 2,
      installations: 18
    },
    {
      id: 3,
      name: 'Ali Benjelloun',
      city: 'Marrakech',
      cityId: 3,
      installations: 15
    }
  ],

  // Villes par défaut
  cities: [
    {
      id: 1,
      name: 'Casablanca',
      status: 'active'
    },
    {
      id: 2,
      name: 'Rabat',
      status: 'active'
    },
    {
      id: 3,
      name: 'Marrakech',
      status: 'active'
    },
    {
      id: 4,
      name: 'Fès',
      status: 'active'
    }
  ],

  // Méthodes de paiement par défaut
  paymentMethods: [
    {
      id: 1,
      name: 'Espèces',
      description: 'Paiement en espèces'
    },
    {
      id: 2,
      name: 'Carte Bancaire',
      description: 'Paiement par carte bancaire'
    },
    {
      id: 3,
      name: 'Virement',
      description: 'Virement bancaire'
    }
  ],

  // Paiements par défaut
  payments: [
    {
      id: 1,
      date: '2024-03-15',
      amount: 1000,
      methodId: 1,
      clientId: 1,
      subscriptionId: 1,
      status: 'paid',
      reference: 'PAY-001'
    },
    {
      id: 2,
      date: '2024-03-16',
      amount: 800,
      methodId: 2,
      clientId: 2,
      subscriptionId: 2,
      status: 'pending',
      reference: 'PAY-002'
    }
  ],

  // Abonnements par défaut
  subscriptions: [
    {
      id: 1,
      clientId: 1,
      durationId: 1,
      deviceId: 1,
      startDate: '2024-03-15',
      endDate: '2024-06-15',
      status: 'active',
      paymentStatus: 'partial',
      remainingAmount: 200
    },
    {
      id: 2,
      clientId: 2,
      durationId: 2,
      deviceId: 2,
      startDate: '2024-03-16',
      endDate: '2024-09-16',
      status: 'active',
      paymentStatus: 'unpaid',
      remainingAmount: 500
    }
  ],

  // Durées d'abonnement par défaut
  subscriptionDurations: [
    {
      id: 1,
      name: '3 Mois',
      months: 3,
      price: 300,
      description: 'Abonnement trimestriel'
    },
    {
      id: 2,
      name: '6 Mois',
      months: 6,
      price: 500,
      description: 'Abonnement semestriel'
    },
    {
      id: 3,
      name: '12 Mois',
      months: 12,
      price: 900,
      description: 'Abonnement annuel'
    }
  ],

  // Factures par défaut
  invoices: [
    {
      id: 1,
      number: 'FACT-2024-001',
      clientId: 1,
      subscriptionId: 1,
      date: '2024-03-15',
      dueDate: '2024-04-15',
      items: [
        {
          description: 'Abonnement GPS - 3 Mois',
          quantity: 1,
          unitPrice: 300,
          total: 300
        }
      ],
      totalAmount: 300,
      status: 'paid'
    },
    {
      id: 2,
      number: 'FACT-2024-002',
      clientId: 2,
      subscriptionId: 2,
      date: '2024-03-16',
      dueDate: '2024-04-16',
      items: [
        {
          description: 'Abonnement GPS - 6 Mois',
          quantity: 1,
          unitPrice: 500,
          total: 500
        }
      ],
      totalAmount: 500,
      status: 'unpaid'
    }
  ]
};