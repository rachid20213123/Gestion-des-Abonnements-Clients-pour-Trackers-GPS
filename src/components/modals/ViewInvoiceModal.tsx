import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { useStore } from '../../store';

interface ViewInvoiceModalProps {
  invoice: any;
  onClose: () => void;
}

export function ViewInvoiceModal({ invoice, onClose }: ViewInvoiceModalProps) {
  const { clients } = useStore();
  const client = clients.find(c => c.id === invoice.clientId);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Logique de téléchargement à implémenter
    console.log('Downloading invoice:', invoice);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Facture {invoice.number}</h3>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded"
              title="Imprimer"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded"
              title="Télécharger"
            >
              <Download className="w-5 h-5" />
            </button>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">De</h4>
              <div className="text-sm text-gray-600">
                <p className="font-medium">GPS MYSI</p>
                <p>123 Rue Example</p>
                <p>Ville, Pays</p>
                <p>contact@gps-mysi.com</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Facturé à</h4>
              <div className="text-sm text-gray-600">
                <p className="font-medium">{client?.name}</p>
                <p>{client?.email}</p>
                <p>{client?.phone}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-2 gap-8 text-sm text-gray-600 mb-4">
              <div>
                <p><span className="font-medium">Facture N°:</span> {invoice.number}</p>
                <p><span className="font-medium">Date:</span> {invoice.date}</p>
              </div>
              <div>
                <p><span className="font-medium">Échéance:</span> {invoice.dueDate}</p>
                <p><span className="font-medium">Statut:</span> {
                  invoice.status === 'paid' ? 'Payée' :
                  invoice.status === 'partial' ? 'Partiellement payée' :
                  'Impayée'
                }</p>
              </div>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-700">Description</th>
                <th className="text-right py-3 text-sm font-medium text-gray-700">Quantité</th>
                <th className="text-right py-3 text-sm font-medium text-gray-700">Prix unitaire</th>
                <th className="text-right py-3 text-sm font-medium text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-600">{item.description}</td>
                  <td className="py-3 text-sm text-gray-600 text-right">{item.quantity}</td>
                  <td className="py-3 text-sm text-gray-600 text-right">{item.unitPrice} DH</td>
                  <td className="py-3 text-sm text-gray-600 text-right">{item.total} DH</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="py-3 text-right font-medium">Total</td>
                <td className="py-3 text-right font-medium">{invoice.totalAmount} DH</td>
              </tr>
            </tfoot>
          </table>

          {invoice.notes && (
            <div className="mb-8">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
              <p className="text-sm text-gray-600">{invoice.notes}</p>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Conditions de paiement</p>
            <p>Le paiement est dû dans les 30 jours suivant la date de facturation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}