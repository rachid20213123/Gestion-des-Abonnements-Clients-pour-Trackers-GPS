import React, { useState } from 'react';
import { Plus, Edit, Trash, Search } from 'lucide-react';
import { useStore } from '../store';
import { AddDeviceModelModal } from './modals/AddDeviceModelModal';
import { EditDeviceModelModal } from './modals/EditDeviceModelModal';

export function DeviceModels() {
  const { deviceModels, deleteDeviceModel, openModal } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedModel, setSelectedModel] = useState(null);

  const handleEdit = (model) => {
    setSelectedModel(model);
    openModal('editDeviceModelModal');
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
      deleteDeviceModel(id);
    }
  };

  const filteredModels = deviceModels.filter(model => {
    const matchesSearch = 
      model.name.toLowerCase().includes(search.toLowerCase()) ||
      model.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || model.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Modèle tracker GPS</h2>
          <button 
            onClick={() => openModal('addDeviceModelModal')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Ajouter un Modèle
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un modèle..."
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
            <option value="inactive">Inactif</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nom</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Description</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Fonctionnalités</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.map((model) => (
                <tr key={model.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{model.id}</td>
                  <td className="py-3 px-4">{model.name}</td>
                  <td className="py-3 px-4">{model.description}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {model.features.map((feature, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      model.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {model.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(model)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDelete(model.id)}
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
      </div>

      <AddDeviceModelModal />
      {selectedModel && (
        <EditDeviceModelModal 
          model={selectedModel} 
          onClose={() => setSelectedModel(null)} 
        />
      )}
    </>
  );
}