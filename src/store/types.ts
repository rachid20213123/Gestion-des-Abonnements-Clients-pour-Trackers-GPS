export interface Installation {
  id: number;
  clientId: number;
  installerId: number;
  deviceId: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface Device {
  id: number;
  imei: string;
  modelId: number;
  providerId: number;
  status: 'active' | 'inactive';
}

export interface Installer {
  id: number;
  name: string;
  city: string;
  cityId?: number;
  installations?: number;
}

export interface City {
  id: number;
  name: string;
  status: 'active' | 'inactive';
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  licensePlate: string;
  clientId: number;
  status: 'active' | 'inactive';
}

export interface DeviceModel {
  id: number;
  name: string;
  description: string;
  features: string[];
  status: 'active' | 'inactive';
}

export interface Provider {
  id: number;
  name: string;
  status: 'active' | 'inactive';
}

export interface PaymentMethod {
  id: number;
  name: string;
  description: string;
}

export interface Payment {
  id: number;
  date: string;
  amount: number;
  methodId: number;
  clientId: number;
  subscriptionId?: number;
  status: 'pending' | 'paid' | 'cancelled';
  reference: string;
  justificatif?: File;
}

export interface Subscription {
  id: number;
  clientId: number;
  durationId: number;
  deviceId?: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  remainingAmount: number;
}

export interface SubscriptionDuration {
  id: number;
  name: string;
  months: number;
  price: number;
  description: string;
}

export interface SubscriptionForm {
  startDate: string;
  clientId: number;
  durationId: number;
  deviceId?: number;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: number;
  number: string;
  clientId: number;
  subscriptionId?: number;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'unpaid' | 'partial' | 'paid';
  notes?: string;
}

export interface Intervention {
  id: number;
  date: string;
  carId: number;
  typeId: number;
  installerId: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface InterventionType {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  status: 'active' | 'inactive';
}

export interface State {
  currentSection: string;
  modals: {
    [key: string]: boolean;
  };
  clients: Client[];
  cars: Car[];
  devices: Device[];
  deviceModels: DeviceModel[];
  providers: Provider[];
  installations: Installation[];
  interventions: Intervention[];
  interventionTypes: InterventionType[];
  installers: Installer[];
  cities: City[];
  paymentMethods: PaymentMethod[];
  payments: Payment[];
  subscriptions: Subscription[];
  subscriptionDurations: SubscriptionDuration[];
  invoices: Invoice[];
}

export interface Actions {
  setCurrentSection: (section: string) => void;
  openModal: (modalName: string) => void;
  closeModal: (modalName: string) => void;
  
  addInstaller: (installer: Partial<Installer>) => void;
  editInstaller: (id: number, data: Partial<Installer>) => void;
  deleteInstaller: (id: number) => void;
  
  addCity: (city: Partial<City>) => void;
  editCity: (id: number, data: Partial<City>) => void;
  deleteCity: (id: number) => void;
  
  addDevice: (device: Partial<Device>) => void;
  editDevice: (id: number, data: Partial<Device>) => void;
  deleteDevice: (id: number) => void;
  
  addPayment: (payment: Partial<Payment>) => void;
  editPayment: (id: number, data: Partial<Payment>) => void;
  deletePayment: (id: number) => void;
  
  addSubscription: (subscription: Partial<Subscription>) => void;
  editSubscription: (id: number, data: Partial<Subscription>) => void;
  deleteSubscription: (id: number) => void;
  
  addInvoice: (invoice: Invoice) => void;
  editInvoice: (id: number, data: Partial<Invoice>) => void;
  deleteInvoice: (id: number) => void;
}