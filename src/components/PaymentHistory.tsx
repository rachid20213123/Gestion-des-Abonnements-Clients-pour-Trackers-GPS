import React, { useState } from 'react';
import { Download, Eye, FileText, Search, Filter } from 'lucide-react';
import { useStore } from '../store';
import { formatCurrency } from '../utils/format';
import type { Client, Payment } from '../store/types';

interface ClientSummary {
  totalDue: number;
  totalPaid: number;
  overdue: number;
}

export function PaymentHistory() {
  const { payments, clients, paymentMethods, subscriptions, subscriptionDurations } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedClient, setSelectedClient] = useState('');

  const calculateClientSummary = (clientId: number): ClientSummary => {
    const clientSubscriptions = subscriptions.filter(s => s.clientId === clientId);
    const clientPayments = payments.filter(p => p.clientId === clientId && p.status === 'paid');
    
    const totalDue = clientSubscriptions.reduce((sum, s) => {
      const duration = subscriptionDurations.find(d => d.id === s.durationId);
      return sum + (duration?.price || 0);
    }, 0);
    
    const totalPaid = clientPayments.reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalDue,
      totalPaid,
      overdue: Math.max(0, totalDue - totalPaid)
    };
  };

  const filteredPayments = payments.filter(payment => {
    const client = clients.find(c => c.id === payment.clientId);
    const method = paymentMethods.find(m => m.id === payment.methodId);
    
    const matchesSearch = 
      (client?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (method?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      payment.reference.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === 'all' || payment.status === filter;
    const matchesClient = !selectedClient || payment.clientId === Number(selectedClient);
    
    const matchesDate = (!dateRange.start || payment.date >= dateRange.start) &&
      (!dateRange.end || payment.date <= dateRange.end);

    return matchesSearch && matchesFilter && matchesClient && matchesDate;
  });

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting payment history...');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Historique des Paiements</h2>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <select 
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
        >
          <option value="">Tous les clients</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
          />
        </div>

        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="paid">Payé</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>

      {selectedClient && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {(() => {
            const summary = calculateClientSummary(Number(selectedClient));
            return (
              <>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Total Payé</p>
                  <p className="text-xl font-semibold text-green-700">{formatCurrency(summary.totalPaid)}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600">Total Dû</p>
                  <p className="text-xl font-semibold text-yellow-700">{formatCurrency(summary.totalDue)}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">Montant en Retard</p>
                  <p className="text-xl font-semibold text-red-700">{formatCurrency(summary.overdue)}</p>
                </div>
              </>
            );
          })()}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Client</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Montant</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Méthode</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Référence</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => {
              const client = clients.find(c => c.id === payment.clientId);
              const method = paymentMethods.find(m => m.id === payment.methodId);

              return (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{payment.date}</td>
                  <td className="py-3 px-4">{client?.name || 'N/A'}</td>
                  <td className="py-3 px-4">{formatCurrency(payment.amount)}</td>
                  <td className="py-3 px-4">{method?.name || 'N/A'}</td>
                  <td className="py-3 px-4">{payment.reference}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      payment.status === 'paid' 
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status === 'paid' ? 'Payé' :
                       payment.status === 'pending' ? 'En attente' : 'Annulé'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}