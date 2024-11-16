import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Car,
  Smartphone,
  WrenchIcon,
  MapPin,
  Settings,
  CreditCard,
  Calendar,
  History,
  ChevronDown,
  ChevronRight,
  UserCog,
  Cog,
  Receipt
} from 'lucide-react';
import { useStore } from '../store';

const menuStructure = [
  {
    id: 'dashboard',
    label: 'Tableau de Bord',
    icon: LayoutDashboard,
    type: 'item'
  },
  {
    id: 'clients',
    label: 'Gestion des Clients',
    icon: UserCog,
    type: 'group',
    items: [
      { id: 'clients', label: 'Clients', icon: Users },
      { id: 'cars', label: 'Voitures', icon: Car },
      { id: 'subscriptions', label: 'Abonnements', icon: Calendar },
      { id: 'payments', label: 'Paiements', icon: CreditCard },
      { id: 'paymentHistory', label: 'Historique Paiements', icon: History },
      { id: 'billing', label: 'Facturation', icon: Receipt }
    ]
  },
  {
    id: 'technical',
    label: 'Gestion Technique',
    icon: WrenchIcon,
    type: 'group',
    items: [
      { id: 'installers', label: 'Installateurs', icon: WrenchIcon },
      { id: 'devices', label: 'Dispositifs GPS', icon: Smartphone },
      { id: 'deviceModels', label: 'Modèles GPS', icon: Cog },
      { id: 'installations', label: 'Installations', icon: WrenchIcon },
      { id: 'interventions', label: 'Interventions', icon: WrenchIcon }
    ]
  },
  {
    id: 'settings',
    label: 'Paramétrage',
    icon: Settings,
    type: 'group',
    items: [
      { id: 'cities', label: 'Villes', icon: MapPin },
      { id: 'interventionTypes', label: 'Types d\'intervention', icon: WrenchIcon },
      { id: 'settings', label: 'Paramètres', icon: Settings }
    ]
  }
];

export function Sidebar() {
  const { currentSection, setCurrentSection } = useStore();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['clients', 'technical', 'settings']);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">GPS MYSI</h1>
      </div>
      <nav className="mt-6">
        <ul className="space-y-1 px-3">
          {menuStructure.map((section) => {
            const Icon = section.icon;
            
            if (section.type === 'item') {
              return (
                <li key={section.id}>
                  <button
                    onClick={() => setCurrentSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      currentSection === section.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{section.label}</span>
                  </button>
                </li>
              );
            }

            const isExpanded = expandedGroups.includes(section.id);
            
            return (
              <li key={section.id} className="space-y-1">
                <button
                  onClick={() => toggleGroup(section.id)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                    section.items?.some(item => item.id === currentSection)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{section.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                
                {isExpanded && section.items && (
                  <ul className="pl-4 space-y-1">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => setCurrentSection(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                              currentSection === item.id
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <ItemIcon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}