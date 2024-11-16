import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useStore } from '../../store';

interface CityForm {
  name: string;
  status: 'active' | 'inactive';
}

export function AddCityModal() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CityForm>();
  const { modals, closeModal, addCity } = useStore();

  const onSubmit = (data: CityForm) => {
    addCity(data);
    reset();
    closeModal('addCityModal');
  };

  if (!modals.addCityModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ajouter une Ville</h3>
          <button onClick={() => closeModal('addCityModal')}>
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
              Statut
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => closeModal('addCityModal')}
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