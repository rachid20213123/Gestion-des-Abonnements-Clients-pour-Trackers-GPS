import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useStore } from '../../store';
import type { Subscription } from '../../store/types';

interface EditSubscriptionModalProps {
  subscription: Subscription;
  onClose: () => void;
}

export function EditSubscriptionModal({ subscription, onClose }: EditSubscriptionModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      ...subscription,
      carId: subscription.carId || ''
    }
  });
  const { editSubscription, clients, subscriptionDurations, cars } = useStore();

  const onSubmit = (data: any) => {
    const duration = subscriptionDurations.find(d => d.id === Number(data.durationId));
    const startDate = new Date(data.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + (duration?.months || 0));

    editSubscription(subscription.id, {
      ...data,
      clientId: Number(data.clientId),
      durationId: Number(data.durationId),
      carId: data.carId ? Number(data.carId) : undefined,
      endDate: endDate.toISOString().split('T')[0]
    });
    onClose();
  };

  // Filtrer les voitures actives du client sélectionné
  const clientCars = cars.filter(car => 
    car.status === 'active' && 
    car.clientId === subscription.clientId
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Modifier l'Abonnement</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début
            </label>
            <input
              type="date"
              {...register('startDate', { required: 'La date de début est requise' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              {...register('clientId', { required: 'Le client est requis' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.clientId ? 'border-red-500' : 'border-gray-300'}`}
              disabled // Le client ne peut pas être modifié
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
              Durée d'abonnement
            </label>
            <select
              {...register('durationId', { required: 'La durée est requise' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.durationId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionner une durée</option>
              {subscriptionDurations.map(duration => (
                <option key={duration.id} value={duration.id}>
                  {duration.name} - {duration.price} DH
                </option>
              ))}
            </select>
            {errors.durationId && (
              <p className="mt-1 text-sm text-red-600">{errors.durationId.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voiture
            </label>
            <select
              {...register('carId')}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            >
              <option value="">Sélectionner une voiture</option>
              {clientCars.map(car => (
                <option key={car.id} value={car.id}>
                  {car.brand} {car.model} - {car.licensePlate}
                </option>
              ))}
            </select>
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
              <option value="expired">Expiré</option>
              <option value="cancelled">Annulé</option>
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