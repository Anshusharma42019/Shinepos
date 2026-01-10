import React, { useState } from 'react';
import VariationList from './VariationList';
import AddVariation from './AddVariation';
import EditVariation from './EditVariation';

const Variation = () => {
  const [view, setView] = useState('list');
  const [editingVariation, setEditingVariation] = useState(null);

  const handleAddVariation = () => {
    setView('add');
  };

  const handleEditVariation = (variation) => {
    setEditingVariation(variation);
    setView('edit');
  };

  const handleBackToList = () => {
    setView('list');
    setEditingVariation(null);
  };

  const renderView = () => {
    switch (view) {
      case 'add':
        return <AddVariation onSuccess={handleBackToList} onBack={handleBackToList} />;
      case 'edit':
        return <EditVariation variation={editingVariation} onSuccess={handleBackToList} onBack={handleBackToList} />;
      default:
        return <VariationList onAdd={handleAddVariation} onEdit={handleEditVariation} />;
    }
  };

  return (
    <div>
      {renderView()}
    </div>
  );
};

export default Variation;