import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useStore } from '../../store';

interface EditCarModalProps {
  car: {
    id: number;
    brand: string;
    model: string;
    licensePlate: string;
    clientId: number;
    status: 'active' | 'inactive';
  };
  onClose: () => void;
}

export function EditCarModal({ car, onClose }: EditCarModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: car
  });
  const { editCar, clients } = useStore();

  const onSubmit = (data: any) => {
    editCar(car.id, {
      ...data,
      clientId: Number(data.clientId)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Modifier la Voiture</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marque
            </label>
            <input
              {...register('brand', { required: 'La marque est requise' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.brand && (
              <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modèle
            </label>
            <input
              {...register('model', { required: 'Le modèle est requis' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.model ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plaque d'immatriculation
            </label>
            <input
              {...register('licensePlate', { required: 'La plaque d\'immatriculation est requise' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.licensePlate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.licensePlate && (
              <p className="mt-1 text-sm text-red-600">{errors.licensePlate.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              {...register('clientId', { required: 'Le client est requis' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.clientId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionner un client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
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