import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useStore } from '../../store';

interface InstallationForm {
  clientId: number;
  installerId: number;
  deviceImei: string;
  method: 'normal' | 'express';
  date: string;
}

export function AddInstallationModal() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InstallationForm>();
  const { modals, closeModal, addInstallation, clients, installers, devices } = useStore();

  const onSubmit = (data: InstallationForm) => {
    addInstallation({
      ...data,
      clientId: Number(data.clientId),
      installerId: Number(data.installerId)
    });
    reset();
    closeModal('addInstallationModal');
  };

  if (!modals.addInstallationModal) return null;

  const availableDevices = devices.filter(device => device.status === 'active');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Nouvelle Installation</h3>
          <button onClick={() => closeModal('addInstallationModal')}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              {...register('clientId', { required: 'Le client est requis' })}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
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
              Installateur
            </label>
            <select
              {...register('installerId', { required: 'L\'installateur est requis' })}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            >
              <option value="">Sélectionner un installateur</option>
              {installers.map(installer => (
                <option key={installer.id} value={installer.id}>
                  {installer.name} - {installer.city}
                </option>
              ))}
            </select>
            {errors.installerId && (
              <p className="mt-1 text-sm text-red-600">{errors.installerId.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dispositif GPS
            </label>
            <select
              {...register('deviceImei', { required: 'Le dispositif GPS est requis' })}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            >
              <option value="">Sélectionner un dispositif</option>
              {availableDevices.map(device => (
                <option key={device.id} value={device.imei}>
                  {device.imei} - {device.model}
                </option>
              ))}
            </select>
            {errors.deviceImei && (
              <p className="mt-1 text-sm text-red-600">{errors.deviceImei.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Méthode
            </label>
            <select
              {...register('method')}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            >
              <option value="normal">Normal</option>
              <option value="express">Express</option>
            </select>
          </div>
          
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
          
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => closeModal('addInstallationModal')}
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