import React, { useState } from 'react';
import AddonList from './AddonList';
import AddAddon from './AddAddon';

const Addon = () => {
  const [view, setView] = useState('list');

  const handleAddAddon = () => {
    setView('add');
  };

  const handleBackToList = () => {
    setView('list');
  };

  const renderView = () => {
    switch (view) {
      case 'add':
        return <AddAddon onSuccess={handleBackToList} onBack={handleBackToList} />;
      default:
        return <AddonList onAdd={handleAddAddon} />;
    }
  };

  return (
    <div>
      {renderView()}
    </div>
  );
};

export default Addon;