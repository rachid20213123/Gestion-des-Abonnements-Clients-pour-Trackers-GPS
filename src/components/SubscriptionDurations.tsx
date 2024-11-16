import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { useStore } from '../store';
import { AddSubscriptionDurationModal } from './modals/AddSubscriptionDurationModal';
import { EditSubscriptionDurationModal } from './modals/EditSubscriptionDurationModal';

export default function SubscriptionDurations() {
  const { subscriptionDurations, deleteSubscriptionDuration, openModal } = useStore();
  const [selectedDuration, setSelectedDuration] = useState(null);

  const handleEdit = (duration) => {
    setSelectedDuration(duration);
    openModal('editSubscriptionDurationModal');
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette durée d\'abonnement ?')) {
      deleteSubscriptionDuration(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Durées d'Abonnement</h3>
        <button 
          onClick={() => openModal('addSubscriptionDurationModal')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Ajouter une Durée
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ID</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nom</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Durée (mois)</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Prix</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Description</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptionDurations.map((duration) => (
              <tr key={duration.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{duration.id}</td>
                <td className="py-3 px-4">{duration.name}</td>
                <td className="py-3 px-4">{duration.months}</td>
                <td className="py-3 px-4">{duration.price} DH</td>
                <td className="py-3 px-4">{duration.description}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(duration)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => handleDelete(duration.id)}
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

      <AddSubscriptionDurationModal />
      {selectedDuration && (
        <EditSubscriptionDurationModal 
          duration={selectedDuration} 
          onClose={() => setSelectedDuration(null)} 
        />
      )}
    </div>
  );
}