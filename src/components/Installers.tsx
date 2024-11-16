import React, { useState } from 'react';
import { Plus, Edit, Trash, Search } from 'lucide-react';
import { useStore } from '../store';
import { AddInstallerModal } from './modals/AddInstallerModal';
import { EditInstallerModal } from './modals/EditInstallerModal';
import type { Installer } from '../store/types';

export function Installers() {
  const { installers = [], deleteInstaller, openModal } = useStore();
  const [search, setSearch] = useState('');
  const [selectedInstaller, setSelectedInstaller] = useState<Installer | null>(null);

  const handleEdit = (installer: Installer) => {
    setSelectedInstaller(installer);
    openModal('editInstallerModal');
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet installateur ?')) {
      deleteInstaller(id);
    }
  };

  const filteredInstallers = installers.filter(installer => {
    const searchString = [
      installer.name || '',
      installer.city || ''
    ].join(' ').toLowerCase();

    return search === '' || searchString.includes(search.toLowerCase());
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Gestion des Installateurs</h2>
        <button 
          onClick={() => openModal('addInstallerModal')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Ajouter un Installateur
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un installateur..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Nom</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Ville</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Installations</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstallers.map((installer) => (
              <tr key={installer.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">{installer.name}</td>
                <td className="py-3 px-4">{installer.city}</td>
                <td className="py-3 px-4">{installer.installations || 0}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(installer)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => handleDelete(installer.id)}
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

      <AddInstallerModal />
      {selectedInstaller && (
        <EditInstallerModal 
          installer={selectedInstaller} 
          onClose={() => setSelectedInstaller(null)} 
        />
      )}
    </div>
  );
}