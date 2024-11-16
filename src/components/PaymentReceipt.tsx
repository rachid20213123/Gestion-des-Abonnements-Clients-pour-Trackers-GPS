import React from 'react';
import { formatCurrency } from '../utils/format';
import type { Payment, Subscription, Client, SubscriptionDuration } from '../store/types';

interface PaymentReceiptProps {
  subscription: Subscription;
  payments: Payment[];
  client: Client;
  duration: SubscriptionDuration;
  onClose: () => void;
}

export function PaymentReceipt({ subscription, payments, client, duration, onClose }: PaymentReceiptProps) {
  const totalAmount = duration?.price || 0;
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = totalAmount - paidAmount;

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-8">
        <div className="print:hidden flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold">Relevé des Paiements</h2>
          <div className="flex gap-4">
            <button
              onClick={printReceipt}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Imprimer
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Fermer
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">GPS MYSI</h1>
            <p className="text-gray-600">Relevé des Paiements</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Informations Client</h3>
              <p>Nom: {client.name}</p>
              <p>Email: {client.email}</p>
              <p>Téléphone: {client.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Informations Abonnement</h3>
              <p>Type: {duration?.name}</p>
              <p>Début: {subscription.startDate}</p>
              <p>Fin: {subscription.endDate}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Historique des Paiements</h3>
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Référence</th>
                  <th className="text-right py-2">Montant</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b">
                    <td className="py-2">{payment.date}</td>
                    <td className="py-2">{payment.reference}</td>
                    <td className="py-2 text-right">{formatCurrency(payment.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold">
              <span>Montant Total:</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Total Payé:</span>
              <span>{formatCurrency(paidAmount)}</span>
            </div>
            <div className="flex justify-between text-red-600 font-bold">
              <span>Reste à Payer:</span>
              <span>{formatCurrency(remainingAmount)}</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-8">
            <p>Document généré le {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}