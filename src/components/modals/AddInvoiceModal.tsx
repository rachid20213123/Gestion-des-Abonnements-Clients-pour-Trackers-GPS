import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Trash } from 'lucide-react';
import { useStore } from '../../store';
import type { Invoice, InvoiceItem } from '../../store/types';

interface AddInvoiceModalProps {
  subscription?: {
    id: number;
    clientId: number;
    durationId: number;
  };
  onClose?: () => void;
}

interface InvoiceForm {
  clientId: number;
  subscriptionId?: number;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  notes: string;
}

export function AddInvoiceModal({ subscription, onClose }: AddInvoiceModalProps) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<InvoiceForm>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    }
  });
  
  const { modals, closeModal, addInvoice, clients, subscriptions, subscriptionDurations } = useStore();
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', quantity: 1, unitPrice: 0, total: 0 }]);

  const selectedClientId = watch('clientId');
  const selectedSubscriptionId = watch('subscriptionId');

  useEffect(() => {
    if (subscription) {
      setValue('clientId', subscription.clientId);
      setValue('subscriptionId', subscription.id);
      
      const duration = subscriptionDurations.find(d => d.id === subscription.durationId);
      if (duration) {
        setItems([{
          description: `Abonnement GPS - ${duration.name}`,
          quantity: 1,
          unitPrice: duration.price,
          total: duration.price
        }]);
      }
    }
  }, [subscription, setValue, subscriptionDurations]);

  useEffect(() => {
    if (selectedSubscriptionId) {
      const selectedSubscription = subscriptions.find(s => s.id === Number(selectedSubscriptionId));
      if (selectedSubscription) {
        const duration = subscriptionDurations.find(d => d.id === selectedSubscription.durationId);
        if (duration) {
          setItems([{
            description: `Abonnement GPS - ${duration.name}`,
            quantity: 1,
            unitPrice: duration.price,
            total: duration.price
          }]);
        }
      }
    }
  }, [selectedSubscriptionId, subscriptions, subscriptionDurations]);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItemTotal = (index: number, quantity: number, unitPrice: number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      quantity,
      unitPrice,
      total: quantity * unitPrice
    };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    closeModal('addInvoiceModal');
  };

  const onSubmit = (data: InvoiceForm) => {
    const invoiceNumber = `FACT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    const newInvoice: Invoice = {
      id: Date.now(),
      number: invoiceNumber,
      clientId: Number(data.clientId),
      subscriptionId: data.subscriptionId ? Number(data.subscriptionId) : undefined,
      date: data.date,
      dueDate: data.dueDate,
      items,
      totalAmount: calculateTotal(),
      status: 'unpaid',
      notes: data.notes
    };

    addInvoice(newInvoice);
    reset();
    handleClose();
  };

  if (!modals.addInvoiceModal && !subscription) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Créer une Facture</h3>
          <button onClick={handleClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {!subscription && (
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
            )}

            {selectedClientId && !subscription && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Abonnement (optionnel)
                </label>
                <select
                  {...register('subscriptionId')}
                  className="w-full px-3 py-2 border rounded-lg border-gray-300"
                >
                  <option value="">Sélectionner un abonnement</option>
                  {subscriptions
                    .filter(s => s.clientId === Number(selectedClientId) && s.status === 'active')
                    .map(sub => {
                      const duration = subscriptionDurations.find(d => d.id === sub.durationId);
                      return (
                        <option key={sub.id} value={sub.id}>
                          {duration?.name} - {duration?.price} DH
                        </option>
                      );
                    })}
                </select>
              </div>
            )}

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
                Date d'échéance
              </label>
              <input
                type="date"
                {...register('dueDate', { required: 'La date d\'échéance est requise' })}
                className={`w-full px-3 py-2 border rounded-lg ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-700">Articles</h4>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                Ajouter un article
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].description = e.target.value;
                        setItems(newItems);
                      }}
                      className="w-full px-3 py-2 border rounded-lg border-gray-300"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        updateItemTotal(index, Number(e.target.value), item.unitPrice);
                      }}
                      className="w-full px-3 py-2 border rounded-lg border-gray-300"
                      placeholder="Qté"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => {
                        updateItemTotal(index, item.quantity, Number(e.target.value));
                      }}
                      className="w-full px-3 py-2 border rounded-lg border-gray-300"
                      placeholder="Prix unit."
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      readOnly
                      value={item.total}
                      className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                      placeholder="Total"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <div className="w-64 p-4 bg-gray-50 rounded-lg">
                <p className="flex justify-between text-sm font-medium text-gray-700">
                  <span>Total:</span>
                  <span>{calculateTotal()} DH</span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg border-gray-300"
              placeholder="Notes ou commentaires additionnels..."
            />
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
            >
              Créer la facture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}