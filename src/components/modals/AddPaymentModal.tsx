import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload } from 'lucide-react';
import { useStore } from '../../store';
import { formatCurrency } from '../../utils/format';
import type { Payment, Subscription } from '../../store/types';

interface AddPaymentModalProps {
  subscription?: Subscription;
  onClose?: () => void;
}

interface PaymentForm {
  date: string;
  amount: number;
  methodId: number;
  status: 'pending' | 'paid' | 'cancelled';
  justificatif?: FileList;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export function AddPaymentModal({ subscription, onClose }: AddPaymentModalProps) {
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    formState: { errors } 
  } = useForm<PaymentForm>();

  const { 
    modals, 
    closeModal, 
    addPayment, 
    editSubscription,
    subscriptionDurations, 
    paymentMethods,
    payments 
  } = useStore();

  const [fileError, setFileError] = useState<string | null>(null);
  const [remainingAmount, setRemainingAmount] = useState<number | null>(null);

  const selectedFile = watch('justificatif');

  useEffect(() => {
    if (subscription) {
      const duration = subscriptionDurations.find(d => d.id === subscription.durationId);
      const totalAmount = duration?.price || 0;
      const paidAmount = payments
        .filter(p => p.subscriptionId === subscription.id && p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
      setRemainingAmount(totalAmount - paidAmount);

      // Set default values
      setValue('date', new Date().toISOString().split('T')[0]);
      setValue('amount', totalAmount - paidAmount);
      setValue('status', 'paid');
    }
  }, [subscription, subscriptionDurations, payments, setValue]);

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

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    closeModal('addPaymentModal');
  };

  const onSubmit = async (data: PaymentForm) => {
    if (!subscription) return;

    if (remainingAmount !== null && data.amount > remainingAmount) {
      alert('Le montant du paiement ne peut pas dépasser le montant restant à payer.');
      return;
    }

    if (fileError) {
      alert('Veuillez corriger les erreurs du fichier justificatif.');
      return;
    }

    // Créer le paiement
    const newPayment: Partial<Payment> = {
      date: data.date,
      amount: Number(data.amount),
      methodId: Number(data.methodId),
      clientId: subscription.clientId,
      subscriptionId: subscription.id,
      status: data.status,
      reference: `PAY-${Date.now()}`,
      justificatif: data.justificatif ? data.justificatif[0] : undefined
    };

    // Ajouter le paiement
    addPayment(newPayment);

    // Mettre à jour le montant restant de l'abonnement
    const duration = subscriptionDurations.find(d => d.id === subscription.durationId);
    const totalAmount = duration?.price || 0;
    const allPayments = [
      ...payments.filter(p => p.subscriptionId === subscription.id && p.status === 'paid'),
      { ...newPayment, status: 'paid' }
    ];
    const paidAmount = allPayments.reduce((sum, p) => sum + p.amount, 0);
    const newRemainingAmount = totalAmount - paidAmount;

    // Mettre à jour le statut de l'abonnement si nécessaire
    if (newRemainingAmount <= 0) {
      editSubscription(subscription.id, {
        ...subscription,
        remainingAmount: 0,
        paymentStatus: 'paid'
      });
    } else {
      editSubscription(subscription.id, {
        ...subscription,
        remainingAmount: newRemainingAmount,
        paymentStatus: 'partial'
      });
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ajouter un Paiement</h3>
          <button onClick={handleClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {subscription && remainingAmount !== null && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Montant restant à payer: <span className="font-medium">{formatCurrency(remainingAmount)}</span>
            </p>
          </div>
        )}
        
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
              Montant (DH)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { 
                required: 'Le montant est requis',
                min: { value: 0, message: 'Le montant doit être positif' },
                max: remainingAmount ? {
                  value: remainingAmount,
                  message: 'Le montant ne peut pas dépasser le reste à payer'
                } : undefined
              })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode de paiement
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
            >
              <option value="paid">Payé</option>
              <option value="pending">En attente</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={!!fileError}
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}