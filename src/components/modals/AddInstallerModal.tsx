import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useStore } from '../../store';
import type { City } from '../../store/types';

interface InstallerForm {
  name: string;
  cityId: number;
}

export function AddInstallerModal() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InstallerForm>();
  const { modals, closeModal, addInstaller, cities = [] } = useStore();

  const onSubmit = (data: InstallerForm) => {
    const selectedCity = cities.find(city => city.id === Number(data.cityId));
    addInstaller({
      name: data.name,
      city: selectedCity?.name || '',
      cityId: Number(data.cityId)
    });
    reset();
    closeModal('addInstallerModal');
  };

  if (!modals.addInstallerModal) return null;

  // Filter active cities
  const activeCities = cities.filter(city => city.status === 'active');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ajouter un Installateur</h3>
          <button onClick={() => closeModal('addInstallerModal')}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              {...register('name', { required: 'Le nom est requis' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville
            </label>
            <select
              {...register('cityId', { required: 'La ville est requise' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.cityId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionner une ville</option>
              {activeCities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.cityId && (
              <p className="mt-1 text-sm text-red-600">{errors.cityId.message}</p>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => closeModal('addInstallerModal')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}