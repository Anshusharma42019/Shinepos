import React from 'react';
import ItemList from './ItemList';

const Menu = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-fadeIn">
          <ItemList />
        </div>
      </div>
    </div>
  );
};

export default Menu;