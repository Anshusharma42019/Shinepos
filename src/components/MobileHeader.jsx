import React from 'react';
import { FiMenu } from 'react-icons/fi';

const MobileHeader = ({ title, onMenuClick }) => {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/30 backdrop-blur-md z-30 py-3 px-4 border-b border-white/20">
      <div className="flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <FiMenu size={24} className="text-white" />
        </button>
        <h1 className="text-lg font-bold text-white absolute left-1/2 transform -translate-x-1/2">{title}</h1>
        <div className="w-10"></div>
      </div>
    </div>
  );
};

export default MobileHeader;
