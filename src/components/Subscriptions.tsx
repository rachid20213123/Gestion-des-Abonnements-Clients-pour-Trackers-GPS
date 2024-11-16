import React, { useState } from 'react';
import { Plus, Edit, Trash, Search, RefreshCw, CreditCard, FileText } from 'lucide-react';
import { useStore } from '../store';
import { AddSubscriptionModal } from './modals/AddSubscriptionModal';
import { EditSubscriptionModal } from './modals/EditSubscriptionModal';
import { RenewSubscriptionModal } from './modals/RenewSubscriptionModal';
import { AddPaymentModal } from './modals/AddPaymentModal';
import { AddInvoiceModal } from './modals/AddInvoiceModal';
import { formatCurrency } from '../utils/format';
import type { Subscription } from '../store/types';

export function Subscriptions() {
  const { 
    subscriptions = [], 
    deleteSubscription, 
    openModal, 
    clients = [], 
    cars = [],
    subscriptionDurations = [], 
    payments = [] 
  } = useStore();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [selectedSubscriptionForPayment, setSelectedSubscriptionForPayment] = useState<Subscription | null>(null);
  const [selectedSubscriptionForInvoice, setSelectedSubscriptionForInvoice] = useState<Subscription | null>(null);
  const [selectedSubscriptionForRenewal, setSelectedSubscriptionForRenewal] = useState<Subscription | null>(null);

  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    openModal('editSubscriptionModal');
  };

  const handleAddPayment = (subscription: Subscription) => {
    setSelectedSubscriptionForPayment(subscription);
    openModal('addPaymentModal');
  };

  const handleCreateInvoice = (subscription: Subscription) => {
    setSelectedSubscriptionForInvoice(subscription);
    openModal('addInvoiceModal');
  };

  const handleRenew = (subscription: Subscription) => {
    setSelectedSubscriptionForRenewal(subscription);
    openModal('renewSubscriptionModal');
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) {
      deleteSubscription(id);
    }
  };

  const getSubscriptionDetails = (subscription: Subscription) => {
    const duration = subscriptionDurations.find(d => d.id === subscription.durationId);
    const totalAmount = duration?.price || 0;
    const paidAmount = payments
      .filter(p => p.subscriptionId === subscription.id && p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    return {
      totalAmount,
      paidAmount,
      remainingAmount: totalAmount - paidAmount
    };
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const client = clients.find(c => c.id === subscription.clientId);
    const car = cars.find(c => c.id === subscription.carId);
    const duration = subscriptionDurations.find(d => d.id === subscription.durationId);
    
    const searchString = [
      client?.name || '',
      car?.licensePlate || '',
      duration?.name || ''
    ].join(' ').toLowerCase();

    const matchesSearch = search === '' || searchString.includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || subscription.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Gestion des Abonnements</h2>
        <button 
          onClick={() => openModal('addSubscriptionModal')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Ajouter un Abonnement
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un abonnement..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="expired">Expiré</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Client</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Voiture</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Durée</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date début</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date fin</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Montant total</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Montant payé</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Reste à payer</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.map((subscription) => {
              const client = clients.find(c => c.id === subscription.clientId);
              const car = cars.find(c => c.id === subscription.carId);
              const duration = subscriptionDurations.find(d => d.id === subscription.durationId);
              const { totalAmount, paidAmount, remainingAmount } = getSubscriptionDetails(subscription);

              return (
                <tr key={subscription.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{client?.name || 'N/A'}</td>
                  <td className="py-3 px-4">
                    {car ? (
                      <span className="px-2 py-1 bg-gray-100 rounded-lg text-sm">
                        {car.licensePlate}
                      </span>
                    ) : 'N/A'}
                  </td>
                  <td className="py-3 px-4">{duration?.name || 'N/A'}</td>
                  <td className="py-3 px-4">{subscription.startDate}</td>
                  <td className="py-3 px-4">{subscription.endDate}</td>
                  <td className="py-3 px-4">{formatCurrency(totalAmount)}</td>
                  <td className="py-3 px-4 text-green-600">{formatCurrency(paidAmount)}</td>
                  <td className="py-3 px-4 text-red-600 font-medium">{formatCurrency(remainingAmount)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      subscription.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : subscription.status === 'expired'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscription.status === 'active' ? 'Actif' :
                       subscription.status === 'expired' ? 'Expiré' : 'Annulé'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      {remainingAmount > 0 && (
                        <>
                          <button 
                            onClick={() => handleAddPayment(subscription)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Ajouter un paiement"
                          >
                            <CreditCard className="w-4 h-4 text-blue-600" />
                          </button>
                          <button 
                            onClick={() => handleCreateInvoice(subscription)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Créer une facture"
                          >
                            <FileText className="w-4 h-4 text-green-600" />
                          </button>
                        </>
                      )}
                      {(subscription.status === 'expired' || subscription.status === 'active') && (
                        <button 
                          onClick={() => handleRenew(subscription)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Renouveler l'abonnement"
                        >
                          <RefreshCw className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleEdit(subscription)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDelete(subscription.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Trash className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AddSubscriptionModal />
      {selectedSubscription && (
        <EditSubscriptionModal 
          subscription={selectedSubscription} 
          onClose={() => setSelectedSubscription(null)} 
        />
      )}
      {selectedSubscriptionForPayment && (
        <AddPaymentModal 
          subscription={selectedSubscriptionForPayment}
          onClose={() => setSelectedSubscriptionForPayment(null)}
        />
      )}
      {selectedSubscriptionForInvoice && (
        <AddInvoiceModal 
          subscription={selectedSubscriptionForInvoice}
          onClose={() => setSelectedSubscriptionForInvoice(null)}
        />
      )}
      {selectedSubscriptionForRenewal && (
        <RenewSubscriptionModal 
          subscription={selectedSubscriptionForRenewal}
          onClose={() => setSelectedSubscriptionForRenewal(null)}
        />
      )}
    </div>
  );
}