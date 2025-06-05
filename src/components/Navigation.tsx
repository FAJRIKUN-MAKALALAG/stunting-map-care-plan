
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, BarChart3, UserPlus, FileText } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Ringkasan data'
    },
    {
      id: 'peta',
      label: 'Peta Stunting',
      icon: MapPin,
      description: 'Visualisasi geografis'
    },
    {
      id: 'input',
      label: 'Input Data',
      icon: UserPlus,
      description: 'Tambah data anak'
    },
    {
      id: 'laporan',
      label: 'Laporan',
      icon: FileText,
      description: 'Analisis & export'
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center md:justify-start space-x-1 py-4 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => setActiveTab(item.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105' 
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
                <span className="sm:hidden text-sm">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
