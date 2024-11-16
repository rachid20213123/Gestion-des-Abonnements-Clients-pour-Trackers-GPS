import React, { useState } from 'react';
import { Plus, Edit, Trash, Search, Printer, Eye, Download } from 'lucide-react';
import { useStore } from '../store';
import { AddInvoiceModal } from './modals/AddInvoiceModal';
import { EditInvoiceModal } from './modals/EditInvoiceModal';
import { ViewInvoiceModal } from './modals/ViewInvoiceModal';

export function Billing() {
  const { invoices, deleteInvoice, openModal, clients } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewInvoice, setViewInvoice] = useState(null);

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    openModal('editInvoiceModal');
  };

  const handleView = (invoice) => {
    setViewInvoice(invoice);
    openModal('viewInvoiceModal');
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      deleteInvoice(id);
    }
  };

  const handlePrint = (invoice) => {
    // Logique d'impression à implémenter
    console.log('Printing invoice:', invoice);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const client = clients.find(c => c.id === invoice.clientId);
    
    const matchesSearch = 
      invoice.number.toLowerCase().includes(search.toLowerCase()) ||
      client?.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || invoice.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Gestion des Factures</h2>
        <button 
          onClick={() => openModal('addInvoiceModal')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Créer une Facture
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une facture..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
        >
          <option value="all">Tous les statuts</option>
          <option value="paid">Payée</option>
          <option value="partial">Partiellement payée</option>
          <option value="unpaid">Impayée</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">N° Facture</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Client</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Échéance</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Montant (DH)</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{invoice.number}</td>
                <td className="py-3 px-4">
                  {clients.find(c => c.id === invoice.clientId)?.name}
                </td>
                <td className="py-3 px-4">{invoice.date}</td>
                <td className="py-3 px-4">{invoice.dueDate}</td>
                <td className="py-3 px-4">{invoice.totalAmount}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    invoice.status === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : invoice.status === 'partial'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {invoice.status === 'paid' ? 'Payée' :
                     invoice.status === 'partial' ? 'Partielle' : 'Impayée'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleView(invoice)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Voir"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => handlePrint(invoice)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Imprimer"
                    >
                      <Printer className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => handleEdit(invoice)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => handleDelete(invoice.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Supprimer"
                    >
                      <Trash className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddInvoiceModal />
      {selectedInvoice && (
        <EditInvoiceModal 
          invoice={selectedInvoice} 
          onClose={() => setSelectedInvoice(null)} 
        />
      )}
      {viewInvoice && (
        <ViewInvoiceModal 
          invoice={viewInvoice}
          onClose={() => setViewInvoice(null)}
        />
      )}
    </div>
  );
}