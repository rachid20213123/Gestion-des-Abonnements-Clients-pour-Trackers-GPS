import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { useStore } from '../store';
import { AddPaymentMethodModal } from './modals/AddPaymentMethodModal';
import { EditPaymentMethodModal } from './modals/EditPaymentMethodModal';

export default function PaymentMethods() {
  const { paymentMethods, deletePaymentMethod, openModal } = useStore();
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleEdit = (method) => {
    setSelectedMethod(method);
    openModal('editPaymentMethodModal');
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce mode de paiement ?')) {
      deletePaymentMethod(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Modes de Paiement</h3>
        <button 
          onClick={() => openModal('addPaymentMethodModal')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Ajouter un Mode de Paiement
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ID</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nom</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Description</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((method) => (
              <tr key={method.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{method.id}</td>
                <td className="py-3 px-4">{method.name}</td>
                <td className="py-3 px-4">{method.description}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(method)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => handleDelete(method.id)}
                      className="p-1 hover:bg-gray-100 rounded"
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

      <AddPaymentMethodModal />
      {selectedMethod && (
        <EditPaymentMethodModal 
          method={selectedMethod} 
          onClose={() => setSelectedMethod(null)} 
        />
      )}
    </div>
  );
}