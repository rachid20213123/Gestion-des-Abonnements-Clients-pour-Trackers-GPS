import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useStore } from '../../store';

interface EditInstallationModalProps {
  installation: {
    id: number;
    client: string;
    installer: string;
    deviceImei: string;
    method: 'normal' | 'express';
    date: string;
  };
  onClose: () => void;
}

export function EditInstallationModal({ installation, onClose }: EditInstallationModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: installation
  });
  const { editInstallation, clients, installers, devices } = useStore();

  const onSubmit = (data: any) => {
    editInstallation(installation.id, data);
    onClose();
  };

  const availableDevices = devices.filter(device => 
    device.status === 'active' && 
    (device.imei === installation.deviceImei || !devices.some(d => d.imei === device.imei))
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Modifier l'Installation</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              {...register('client', { required: 'Le client est requis' })}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            >
              {clients.map(client => (
                <option key={client.id} value={client.name}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Installateur
            </label>
            <select
              {...register('installer', { required: 'L\'installateur est requis' })}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            >
              {installers.map(installer => (
                <option key={installer.id} value={installer.name}>
                  {installer.name} - {installer.city}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dispositif GPS
            </label>
            <select
              {...register('deviceImei', { required: 'Le dispositif GPS est requis' })}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            >
              {availableDevices.map(device => (
                <option key={device.id} value={device.imei}>
                  {device.imei} - {device.model}
                </option>
              ))}
            </select>
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