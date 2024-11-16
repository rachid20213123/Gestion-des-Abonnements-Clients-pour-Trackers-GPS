import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useStore } from '../../store';

interface EditDeviceModelModalProps {
  model: {
    id: number;
    name: string;
    description: string;
    features: string[];
    status: 'active' | 'inactive';
  };
  onClose: () => void;
}

export function EditDeviceModelModal({ model, onClose }: EditDeviceModelModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      ...model,
      features: model.features.join(', ')
    }
  });
  const { editDeviceModel } = useStore();

  const onSubmit = (data: any) => {
    const features = data.features.split(',').map(f => f.trim()).filter(f => f);
    editDeviceModel(model.id, {
      ...data,
      features
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Modifier le Modèle</h3>
          <button onClick={onClose}>
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
              Fonctionnalités (séparées par des virgules)
            </label>
            <input
              {...register('features', { required: 'Les fonctionnalités sont requises' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.features ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.features && (
              <p className="mt-1 text-sm text-red-600">{errors.features.message}</p>
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
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}