import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useStore } from '../../store';

interface InterventionTypeForm {
  name: string;
  description: string;
  duration: number;
  price: number;
  status: 'active' | 'inactive';
}

export function AddInterventionTypeModal() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InterventionTypeForm>();
  const { modals, closeModal, addInterventionType } = useStore();

  const onSubmit = (data: InterventionTypeForm) => {
    addInterventionType({
      ...data,
      duration: Number(data.duration),
      price: Number(data.price)
    });
    reset();
    closeModal('addInterventionTypeModal');
  };

  if (!modals.addInterventionTypeModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ajouter un Type d'intervention</h3>
          <button onClick={() => closeModal('addInterventionTypeModal')}>
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
              Description
            </label>
            <textarea
              {...register('description', { required: 'La description est requise' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              rows={3}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durée (minutes)
            </label>
            <input
              type="number"
              {...register('duration', { 
                required: 'La durée est requise',
                min: { value: 1, message: 'La durée minimum est de 1 minute' }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix (DH)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('price', { 
                required: 'Le prix est requis',
                min: { value: 0, message: 'Le prix ne peut pas être négatif' }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
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
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => closeModal('addInterventionTypeModal')}
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