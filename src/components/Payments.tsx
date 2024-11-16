import React, { useState } from 'react';
import { Plus, Edit, Trash, Search, CreditCard, History, ChevronDown, ChevronRight, Printer } from 'lucide-react';
import { useStore } from '../store';
import { AddPaymentModal } from './modals/AddPaymentModal';
import { EditPaymentModal } from './modals/EditPaymentModal';
import { PaymentReceipt } from './PaymentReceipt';
import { formatCurrency } from '../utils/format';
import type { Client, Subscription, Payment } from '../store/types';

interface ClientSummary {
  totalDue: number;
  totalPaid: number;
  remainingAmount: number;
}

interface SubscriptionSummary extends Subscription {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  payments: Payment[];
}

export function Payments() {
  const { 
    payments, 
    deletePayment, 
    openModal, 
    clients, 
    subscriptions, 
    subscriptionDurations 
  } = useStore();
  
  const [search, setSearch] = useState('');
  const [expandedClients, setExpandedClients] = useState<number[]>([]);
  const [expandedSubscriptions, setExpandedSubscriptions] = useState<number[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [receiptSubscription, setReceiptSubscription] = useState<Subscription | null>(null);

  const toggleClient = (clientId: number) => {
    setExpandedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const toggleSubscription = (subscriptionId: number) => {
    setExpandedSubscriptions(prev => 
      prev.includes(subscriptionId) 
        ? prev.filter(id => id !== subscriptionId)
        : [...prev, subscriptionId]
    );
  };

  const calculateClientSummary = (client: Client): ClientSummary => {
    const clientSubscriptions = subscriptions.filter(s => s.clientId === client.id);
    let totalDue = 0;
    let totalPaid = 0;

    clientSubscriptions.forEach(subscription => {
      const duration = subscriptionDurations.find(d => d.id === subscription.durationId);
      if (duration) {
        totalDue += duration.price;
        const subscriptionPayments = payments.filter(p => 
          p.subscriptionId === subscription.id && 
          p.status === 'paid'
        );
        totalPaid += subscriptionPayments.reduce((sum, p) => sum + p.amount, 0);
      }
    });

    return {
      totalDue,
      totalPaid,
      remainingAmount: totalDue - totalPaid
    };
  };

  const getSubscriptionSummary = (subscription: Subscription): SubscriptionSummary => {
    const duration = subscriptionDurations.find(d => d.id === subscription.durationId);
    const subscriptionPayments = payments.filter(p => 
      p.subscriptionId === subscription.id && 
      p.status === 'paid'
    );
    const totalAmount = duration?.price || 0;
    const paidAmount = subscriptionPayments.reduce((sum, p) => sum + p.amount, 0);

    return {
      ...subscription,
      totalAmount,
      paidAmount,
      remainingAmount: totalAmount - paidAmount,
      payments: subscriptionPayments
    };
  };

  const handleAddPayment = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    openModal('addPaymentModal');
  };

  const handlePrintReceipt = (subscription: Subscription) => {
    setReceiptSubscription(subscription);
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      deletePayment(id);
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase()) ||
    client.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Gestion des Paiements</h2>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-4">
          {filteredClients.map(client => {
            const summary = calculateClientSummary(client);
            const clientSubscriptions = subscriptions.filter(s => s.clientId === client.id);
            const isExpanded = expandedClients.includes(client.id);

            return (
              <div key={client.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleClient(client.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-gray-500">Total dû:</span>
                          <span className="ml-2 font-medium">{formatCurrency(summary.totalDue)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Payé:</span>
                          <span className="ml-2 font-medium text-green-600">{formatCurrency(summary.totalPaid)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Reste:</span>
                          <span className="ml-2 font-medium text-red-600">{formatCurrency(summary.remainingAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200">
                    <div className="p-4 space-y-4">
                      {clientSubscriptions.map(subscription => {
                        const summary = getSubscriptionSummary(subscription);
                        const duration = subscriptionDurations.find(d => d.id === subscription.durationId);
                        const isSubscriptionExpanded = expandedSubscriptions.includes(subscription.id);

                        return (
                          <div key={subscription.id} className="border border-gray-100 rounded-lg">
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-medium">
                                    Abonnement - {duration?.name}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {subscription.startDate} - {subscription.endDate}
                                  </p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-sm">
                                    <span className="text-gray-500">Total:</span>
                                    <span className="ml-2 font-medium">{formatCurrency(summary.totalAmount)}</span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-gray-500">Payé:</span>
                                    <span className="ml-2 font-medium text-green-600">{formatCurrency(summary.paidAmount)}</span>
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-gray-500">Reste:</span>
                                    <span className="ml-2 font-medium text-red-600">{formatCurrency(summary.remainingAmount)}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {summary.remainingAmount > 0 && (
                                  <button
                                    onClick={() => handleAddPayment(subscription)}
                                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                  >
                                    <CreditCard className="w-4 h-4" />
                                    Ajouter un paiement
                                  </button>
                                )}
                                <button
                                  onClick={() => toggleSubscription(subscription.id)}
                                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                                >
                                  <History className="w-4 h-4" />
                                  Historique des paiements
                                  {isSubscriptionExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handlePrintReceipt(subscription)}
                                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                                >
                                  <Printer className="w-4 h-4" />
                                  Imprimer le relevé
                                </button>
                              </div>

                              {isSubscriptionExpanded && summary.payments.length > 0 && (
                                <div className="mt-4">
                                  <table className="min-w-full">
                                    <thead>
                                      <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Date</th>
                                        <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Montant</th>
                                        <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Référence</th>
                                        <th className="text-right py-2 px-4 text-xs font-medium text-gray-500">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {summary.payments.map(payment => (
                                        <tr key={payment.id} className="border-b border-gray-100">
                                          <td className="py-2 px-4 text-sm">{payment.date}</td>
                                          <td className="py-2 px-4 text-sm">{formatCurrency(payment.amount)}</td>
                                          <td className="py-2 px-4 text-sm">{payment.reference}</td>
                                          <td className="py-2 px-4">
                                            <div className="flex justify-end gap-2">
                                              <button
                                                onClick={() => handleDelete(payment.id)}
                                                className="p-1 hover:bg-red-50 rounded text-red-600"
                                              >
                                                <Trash className="w-4 h-4" />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedSubscription && (
        <AddPaymentModal
          subscription={selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
        />
      )}
      {selectedPayment && (
        <EditPaymentModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
      {receiptSubscription && (
        <PaymentReceipt
          subscription={receiptSubscription}
          payments={payments.filter(p => p.subscriptionId === receiptSubscription.id)}
          client={clients.find(c => c.id === receiptSubscription.clientId)}
          duration={subscriptionDurations.find(d => d.id === receiptSubscription.durationId)}
          onClose={() => setReceiptSubscription(null)}
        />
      )}
    </div>
  );
}