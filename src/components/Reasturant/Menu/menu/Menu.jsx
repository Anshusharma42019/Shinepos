import React from 'react';
import ItemList from './ItemList';

const Menu = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Menu Management</h2>
      </div>
      
      <ItemList />
    </div>
  );
};

export default Menu;