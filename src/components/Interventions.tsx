import React, { useState } from 'react';
import { Plus, Edit, Trash, Search } from 'lucide-react';
import { useStore } from '../store';
import { AddInterventionModal } from './modals/AddInterventionModal';
import { EditInterventionModal } from './modals/EditInterventionModal';
import type { Intervention } from '../store/types';

export function Interventions() {
  const { 
    interventions = [], 
    deleteIntervention, 
    openModal, 
    cars = [], 
    interventionTypes = [], 
    installers = [] 
  } = useStore();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);

  const handleEdit = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    openModal('editInterventionModal');
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
      deleteIntervention(id);
    }
  };

  const filteredInterventions = interventions.filter(intervention => {
    const car = cars.find(c => c.id === intervention.carId);
    const type = interventionTypes.find(t => t.id === intervention.typeId);
    const installer = installers.find(i => i.id === intervention.installerId);
    
    const searchString = [
      car?.licensePlate || '',
      type?.name || '',
      installer?.name || '',
      intervention.date || ''
    ].join(' ').toLowerCase();

    const matchesSearch = search === '' || searchString.includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || intervention.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Gestion des Interventions</h2>
        <button 
          onClick={() => openModal('addInterventionModal')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Ajouter une Intervention
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une intervention..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Voiture</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Installateur</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Notes</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInterventions.map((intervention) => {
              const car = cars.find(c => c.id === intervention.carId);
              const type = interventionTypes.find(t => t.id === intervention.typeId);
              const installer = installers.find(i => i.id === intervention.installerId);

              return (
                <tr key={intervention.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{intervention.date}</td>
                  <td className="py-3 px-4">{car?.licensePlate || 'N/A'}</td>
                  <td className="py-3 px-4">{type?.name || 'N/A'}</td>
                  <td className="py-3 px-4">{installer?.name || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      intervention.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : intervention.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : intervention.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {intervention.status === 'completed' ? 'Terminée' :
                       intervention.status === 'in_progress' ? 'En cours' :
                       intervention.status === 'pending' ? 'En attente' : 'Annulée'}
                    </span>
                  </td>
                  <td className="py-3 px-4">{intervention.notes}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(intervention)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDelete(intervention.id)}
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

      <AddInterventionModal />
      {selectedIntervention && (
        <EditInterventionModal 
          intervention={selectedIntervention} 
          onClose={() => setSelectedIntervention(null)} 
        />
      )}
    </div>
  );
}