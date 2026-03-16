import React, { useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiGift, FiCreditCard, FiSettings, FiArrowLeft } from 'react-icons/fi';
import AdvanceSalaryManager from './AdvanceSalaryManager';
import PFManager from './PFManager';
import BonusManager from './BonusManager';
import SalaryCalculator from './SalaryCalculator';

const SalaryManagement = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('advance');

  const tabs = [
    { id: 'advance', label: 'Advance Salary', icon: FiCreditCard },
    { id: 'pf', label: 'PF Management', icon: FiTrendingUp },
    { id: 'bonus', label: 'Bonus Management', icon: FiGift },
    { id: 'calculator', label: 'Salary Calculator', icon: FiSettings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'advance':
        return <AdvanceSalaryManager />;
      case 'pf':
        return <PFManager />;
      case 'bonus':
        return <BonusManager />;
      case 'calculator':
        return <SalaryCalculator />;
      default:
        return <AdvanceSalaryManager />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all border border-white/40"
            >
              <FiArrowLeft size={20} />
            </button>
          )}
          <FiDollarSign className="text-3xl text-white" />
          <h1 className="text-2xl font-bold text-white">Salary Management</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6 bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                activeTab === tab.id
                  ? 'bg-white/30 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <IconComponent size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white/20 backdrop-blur-md rounded-xl border border-white/40 min-h-[600px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default SalaryManagement;