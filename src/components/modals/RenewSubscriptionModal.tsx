import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload } from 'lucide-react';
import { useStore } from '../../store';

interface RenewSubscriptionModalProps {
  subscription: {
    id: number;
    clientId: number;
    durationId: number;
    deviceId: number;
    status: string;
  };
  onClose: () => void;
}

interface RenewalForm {
  paymentDate: string;
  amount: number;
  methodId: number;
  justificatif?: FileList;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export function RenewSubscriptionModal({ subscription, onClose }: RenewSubscriptionModalProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RenewalForm>();
  const { editSubscription, addPayment, subscriptionDurations, paymentMethods, clients } = useStore();
  const [fileError, setFileError] = useState<string | null>(null);

  const selectedFile = watch('justificatif');
  const duration = subscriptionDurations.find(d => d.id === subscription.durationId);
  const client = clients.find(c => c.id === subscription.clientId);

  useEffect(() => {
    setValue('amount', duration?.price || 0);
    setValue('paymentDate', new Date().toISOString().split('T')[0]);
  }, [duration, setValue]);

  useEffect(() => {
    if (selectedFile && selectedFile[0]) {
      const file = selectedFile[0];
      
      if (file.size > MAX_FILE_SIZE) {
        setFileError('Le fichier ne doit pas dépasser 5 Mo');
        return;
      }
      
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        setFileError('Format de fichier non accepté. Utilisez JPG, PNG ou PDF');
        return;
      }
      
      setFileError(null);
    }
  }, [selectedFile]);

  const onSubmit = async (data: RenewalForm) => {
    if (fileError) {
      alert('Veuillez corriger les erreurs du fichier justificatif.');
      return;
    }

    // Calculer la nouvelle date de fin
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + (duration?.months || 0));

    // Mettre à jour l'abonnement
    editSubscription(subscription.id, {
      ...subscription,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'active'
    });

    // Créer le paiement
    const paymentData = {
      date: data.paymentDate,
      amount: Number(data.amount),
      methodId: Number(data.methodId),
      clientId: subscription.clientId,
      subscriptionId: subscription.id,
      status: 'paid',
      reference: `RENEW-${subscription.id}-${Date.now()}`,
      justificatif: data.justificatif ? data.justificatif[0] : null
    };

    addPayment(paymentData);
    onClose();

    // Notification de succès
    alert('Renouvellement effectué avec succès !');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Renouveler l'Abonnement</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Client: <span className="font-medium">{client?.name}</span></p>
          <p className="text-sm text-gray-600">Durée: <span className="font-medium">{duration?.name}</span></p>
          <p className="text-sm text-gray-600">Montant: <span className="font-medium">{duration?.price} DH</span></p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date du Paiement
            </label>
            <input
              type="date"
              {...register('paymentDate', { required: 'La date est requise' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.paymentDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.paymentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.paymentDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant (DH)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { 
                required: 'Le montant est requis',
                min: { value: 0, message: 'Le montant doit être positif' }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode de Paiement
            </label>
            <select
              {...register('methodId', { required: 'Le mode de paiement est requis' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.methodId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionner un mode de paiement</option>
              {paymentMethods.map(method => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
            {errors.methodId && (
              <p className="mt-1 text-sm text-red-600">{errors.methodId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Justificatif
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Télécharger un fichier</span>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".jpg,.jpeg,.png,.pdf"
                      {...register('justificatif')}
                    />
                  </label>
                  <p className="pl-1">ou glisser-déposer</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, PDF jusqu'à 5MB
                </p>
              </div>
            </div>
            {fileError && (
              <p className="mt-1 text-sm text-red-600">{fileError}</p>
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
              disabled={!!fileError}
            >
              Renouveler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}