import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useStore } from '../../store';

interface EditPaymentModalProps {
  payment: {
    id: number;
    date: string;
    amount: number;
    methodId: number;
    clientId: number;
    status: 'pending' | 'paid' | 'cancelled';
    reference: string;
  };
  onClose: () => void;
}

export function EditPaymentModal({ payment, onClose }: EditPaymentModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: payment
  });
  const { editPayment, clients, paymentMethods } = useStore();

  const onSubmit = (data: any) => {
    editPayment(payment.id, {
      ...data,
      amount: Number(data.amount),
      methodId: Number(data.methodId),
      clientId: Number(data.clientId)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Modifier le Paiement</h3>
          <button onClick={onClose}>
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
              Référence
            </label>
            <input
              {...register('reference', { required: 'La référence est requise' })}
              className={`w-full px-3 py-2 border rounded-lg ${errors.reference ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.reference && (
              <p className="mt-1 text-sm text-red-600">{errors.reference.message}</p>
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
              <option value="paid">Payé</option>
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