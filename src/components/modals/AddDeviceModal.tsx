import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, QrCode } from 'lucide-react';
import { useStore } from '../../store';
import { QRScanner } from '../QRScanner';

interface DeviceForm {
  imei: string;
  modelId: number;
  providerId: number;
  status: 'active' | 'inactive';
}

export function AddDeviceModal() {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<DeviceForm>();
  const { modals, closeModal, addDevice, providers, deviceModels } = useStore();
  const [showScanner, setShowScanner] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const onSubmit = (data: DeviceForm) => {
    addDevice({
      ...data,
      providerId: Number(data.providerId),
      modelId: Number(data.modelId)
    });
    reset();
    closeModal('addDeviceModal');
  };

  const handleScan = (imei: string) => {
    setValue('imei', imei);
    setScanError(null);
  };

  const handleScanError = (error: string) => {
    setScanError(error);
  };

  if (!modals.addDeviceModal) return null;

  const activeProviders = providers?.filter(provider => provider.status === 'active') || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ajouter un Dispositif GPS</h3>
          <button onClick={() => closeModal('addDeviceModal')}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IMEI
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  {...register('imei', { 
                    required: 'L\'IMEI est requis',
                    pattern: {
                      value: /^\d{15}$/,
                      message: 'L\'IMEI doit contenir 15 chiffres'
                    }
                  })}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.imei ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                Scanner
              </button>
            </div>
            {errors.imei && (
              <p className="mt-1 text-sm text-red-600">{errors.imei.message}</p>
            )}
            {scanError && (
              <p className="mt-1 text-sm text-red-600">{scanError}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modèle tracker GPS
            </label>
            <select
              {...register('modelId', { required: 'Le modèle est requis' })}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            >
              <option value="">Sélectionner un modèle</option>
              {deviceModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            {errors.modelId && (
              <p className="mt-1 text-sm text-red-600">{errors.modelId.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fournisseur
            </label>
            <select
              {...register('providerId', { required: 'Le fournisseur est requis' })}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            >
              <option value="">Sélectionner un fournisseur</option>
              {activeProviders.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
            {errors.providerId && (
              <p className="mt-1 text-sm text-red-600">{errors.providerId.message}</p>
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
              onClick={() => closeModal('addDeviceModal')}
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

        {showScanner && (
          <QRScanner
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
            onError={handleScanError}
          />
        )}
      </div>
    </div>
  );
}