import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useStore } from '../../store';
import type { Intervention } from '../../store/types';

interface InterventionForm {
  date: string;
  carId: number;
  typeId: number;
  installerId: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
}

export function AddInterventionModal() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InterventionForm>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: ''
    }
  });

  const { 
    modals, 
    closeModal, 
    addIntervention, 
    cars = [], 
    interventionTypes = [], 
    installers = [] 
  } = useStore();

  const onSubmit = (data: InterventionForm) => {
    addIntervention({
      ...data,
      carId: Number(data.carId),
      typeId: Number(data.typeId),
      installerId: Number(data.installerId)
    });
    reset();
    closeModal('addInterventionModal');
  };

  if (!modals.addInterventionModal) return null;

  // Filtrer les voitures actives
  const activeCars = cars.filter(car => car.status === 'active');
  // Filtrer les types d'intervention actifs
  const activeTypes = interventionTypes.filter(type => type.status === 'active');
  // Filtrer les installateurs actifs
  const activeInstallers = installers.filter(installer => installer.status === 'active');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ajouter une Intervention</h3>
          <button onClick={() => closeModal('addInterventionModal')}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              {...register('date', { required: 'La date est requise' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voiture
            </label>
            <select
              {...register('carId', { required: 'La voiture est requise' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.carId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionner une voiture</option>
              {activeCars.map(car => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model} - {car.licensePlate}
                </option>
              ))}
            </select>
            {errors.carId && (
              <p className="mt-1 text-sm text-red-600">{errors.carId.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type d'intervention
            </label>
            <select
              {...register('typeId', { required: 'Le type d\'intervention est requis' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.typeId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionner un type</option>
              {activeTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name} - {type.price} DH
                </option>
              ))}
            </select>
            {errors.typeId && (
              <p className="mt-1 text-sm text-red-600">{errors.typeId.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Installateur
            </label>
            <select
              {...register('installerId', { required: 'L\'installateur est requis' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.installerId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionner un installateur</option>
              {activeInstallers.map(installer => (
                <option key={installer.id} value={installer.id}>
                  {installer.name}
                </option>
              ))}
            </select>
            {errors.installerId && (
              <p className="mt-1 text-sm text-red-600">{errors.installerId.message}</p>
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
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes')}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
              rows={3}
              placeholder="Notes optionnelles..."
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => closeModal('addInterventionModal')}
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