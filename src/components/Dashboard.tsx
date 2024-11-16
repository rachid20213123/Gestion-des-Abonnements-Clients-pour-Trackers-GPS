import React from 'react';
import { Users, Clock, Wrench } from 'lucide-react';

const kpis = [
  { id: 1, label: 'Clients Actifs', value: '152', icon: Users },
  { id: 2, label: 'Recharges en Attente', value: '23', icon: Clock },
  { id: 3, label: 'Installations du Mois', value: '45', icon: Wrench }
];

const upcomingRecharges = [
  { id: 1, client: 'Jean Dupont', date: '2024-02-15', status: 'En attente' },
  { id: 2, client: 'Marie Martin', date: '2024-02-16', status: 'Planifié' },
  { id: 3, client: 'Pierre Durant', date: '2024-02-14', status: 'En retard' }
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{kpi.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </div>
                <Icon className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recharges à venir</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Client</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
              </tr>
            </thead>
            <tbody>
              {upcomingRecharges.map((recharge) => (
                <tr key={recharge.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{recharge.client}</td>
                  <td className="py-3 px-4">{recharge.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      recharge.status === 'En attente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : recharge.status === 'Planifié'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {recharge.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}